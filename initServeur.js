conf = require('./conf.json');

var path = require('path');
var express = require('express');
var sockets = require('socket.io');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');
var mysql = require('mysql');
var wait = require('wait.for');

var Client = require('./Classes/Client.js');
var Etudiant = require('./Classes/Etudiant');
var Professeur = require('./Classes/Professeur');
var Question = require('./Classes/Question');
var Questionnaire = require('./Classes/Questionnaire');
var Reponse = require('./Classes/Reponse');
var Resultat = require('./Classes/Resultat');

var server = express();
// parse application/x-www-form-urlencoded
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

server.get('/', function(req, res) {
    var params = {};
    res.render('accueil.ejs', params);
});
server.get('/connexion', function(req, res) {
    var params = {};
    res.render('connexion.ejs', params);
});
server.get('/creerQuestionnaire', function(req, res) {
    var params = {};
    res.render('creerQuestionnaire.ejs', params);
});

// Les routes qui suivent seront à modifier, elles me servent à tester mes pages pour l'instant
server.get('/question', function(req, res) {
    var params = {};
    res.render('question.ejs', params);
});
server.get('/reponse', function(req, res) {
    var params = {};
    res.render('reponse.ejs', params);
});
server.get('/attente', function(req, res) {
    var params = {};
    res.render('attente.ejs', params);
});
server.get('/finQuestion', function(req, res) {
    var params = {};
    res.render('finQuestion.ejs', params);
});
server.get('/listeParticipants', function(req, res) {
    var params = {};
    res.render('listeParticipants.ejs', params);
});
server.get('/questionnaires', function(req, res) {
    var params = {};
    res.render('questionnaires.ejs', params);
});
server.get('/questionnaire', function(req, res) {
    var params = {};
    res.render('previewQuestionnaire.ejs', params);
});

// Acceder au questionnaire
server.get('/:idObjet/Questionnaire', function(req, res) {

    // Todo : vérifier l'éxistence du questionnaire
    // Todo : vérifier que l'utilisateur est connecté

    var client = new Professeur(); // Todo : récupérer le client connecté

    var questionnaireId = req.params.idObjet;
    var identificationId = Math.round(Math.random() * 10000000000); // Todo : creer une vraie valeur aléatoire

    waitToIdentify[identificationId] = {"client": client, "questionnaireId": questionnaireId};

    var params = {};
    params.questionnaireId = questionnaireId;
    params.identificationId = identificationId;
    res.render('Questionnaire.ejs', params);
});

server.post('/newQuestionnaire', jsonParser, function(req, res){
  var questionnaire = new Questionnaire("123",req.body["titreQuestionnaire"],1);
  var resQuestionnaire = questionnaire.createInDB(connection,questionnaire);
  resQuestionnaire.then(function(result) {
    //Si l'insertion s'est bien passée
    if (result) {
      var idQuestionnaire = result;
      for(var index in req.body) {
        if(index!="titreQuestionnaire") {
          var question = new Question(req.body[index]["libelle"],req.body[index]["multiple"],idQuestionnaire);
          var resQuestion = question.createInDB(connection,question,index);
          resQuestion.then(function(result2) {
            //Si l'insertion s'est bien passée
            if (result2) {
              var idQuestion = result2[0];
              var numRep = result2[1];
              for(var index2 in req.body[numRep]["reponses"]) {
                var reponse = new Reponse(req.body[numRep]["reponses"][index2]["libelle"],req.body[numRep]["reponses"][index2]["estLaReponse"],idQuestion);
                var resReponse = reponse.createInDB(connection,reponse);
              }
            }
          });
        }
      }
    }
  });

  //res.send(req);
});
/*
server.get('/:idObjet/Question', function(req, res) {
  var params = {};
  params.idObjet = req.params.idObjet;
  params.nom = "idQuestionn";
  res.render('Question.ejs', params);
});*/
// Créer une route pour: la reponse à une question, une pour les questionnaires d'un prof,
// une pour la preview d'un questionnaire, la liste des participants à un questionnaire

var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root', // pour éviter de créer un user on verra par la suite
  password : '',
  database : 'webdynamiquebd'
});

connection.connect( function(err) {
  if (err) throw err;
  console.log("Connected!");
});

var etudiant = new Etudiant("","");
etudiant.getById(connection,2);


server.use('/css', express.static(path.join(__dirname + '/template/css')));
server.use('/img', express.static(path.join(__dirname + '/template/img')));
server.use('/js', express.static(path.join(__dirname + '/template/js')));
server.use('/Classes', express.static(path.join(__dirname + '/Classes')));

server.use(cookieParser());
server.use(session({
    secret: "a secret key",
    cookie: { maxAge: 2628000000 },
    resave: false,
    saveUninitialized: false
}));

var io = sockets.listen(server.listen(6900));

// -----------------------------------------------------------------------------
// socket
// -----------------------------------------------------------------------------

// Ajoute des log à la console pour les tests
var testMode = true;

// Liste des clients en attente d'identification
var waitToIdentify = [];

// Liste des groupes connéctés
// les clées sont les id des questionnaires
// 1 groupe : [professeur, etudiants, questionActuelle]
var groups = [];

// Nouvelle connexion
io.sockets.on("connection", function (socket){
    if (testMode){
        console.log("Un nouvelle utilisateur s'est connecté");
    }

    // Le client lié à la socket
    var client = null;

    // L'id du questionnaire dans lequel l'utilisateur s'est connecté
    var questionnaireId = null;

    /**
     * Identification
     * Transforme le client en étudiant ou professeur
     */
    socket.on('identify', function(data){

        var identificationId = data.identificationId;

        if (identificationId in waitToIdentify){

            client = waitToIdentify[identificationId]["client"];
            client.socket = socket;

            questionnaireId = waitToIdentify[identificationId]["questionnaireId"];

            delete waitToIdentify[identificationId];

            var connecte = false;

            if (client instanceof Professeur){
                if (questionnaireId in groups){
                    // Si le prof se reconnect à un questionnaire
                    groups[questionnaireId]["professeur"] = client;
                    connecte = true;

                }else{
                    // Si le prof se connect à un questionnaire qui n'est pas encore ouvert : on ouvre le questionnaire
                    var questionnaire = new Questionnaire(); // Todo : récupérer le questionnaire
                    groups[questionnaireId] = {"professeur": client, "etudiants": [], "questionActuelle": null};
                    connecte = true;
                }

            }else if (client instanceof Etudiant){
                if (questionnaireId in groups){
                    // Si le questionnaire est ouvert
                    groups[questionnaireId]["etudiants"].push(client);
                    connecte = true;

                    groups[questionnaireId]["professeur"].socket.emit("newUser", client.nom + " " + client.prenom);
                }else{
                    socket.emit("errors", "Le questionnaire n'a pas encore démarré");

                    if (testMode){
                        console.log("Un utilisateur n'a pas réussi à se connecter à un questionnaire");
                    }
                    return;
                }
            }

            if (connecte){
                socket.emit("identifySuccess", null);

                if (groups[questionnaireId]["questionActuelle"] != null){
                    socket.emit("newQuestion", groups[questionnaireId]["questionActuelle"]);
                }

                if (testMode){
                    if (client instanceof Professeur){
                        console.log("Un professeur s'est identifié");
                    }else{
                        console.log("Un etudiant s'est identifié");
                    }
                }
            }else{
                socket.emit("errors", "Erreur de connexion");

                if (testMode){
                    console.log("Un utilisateur n'a pas réussi à s'identifier");
                }
            }

        }else{
            socket.emit("errors", "Erreur de connexion : identifiant invalide");

            if (testMode){
                console.log("Un utilisateur n'a pas réussi à s'identifier : identifiant invalide");
            }
        }
    });

    /**
     * Un étudiant répond à une question
     */
    socket.on('answerQuestion', function(data){
        var reponse = data;

        //Todo : enregistrer la réponse

        if (testMode){
            console.log("Un étudiant à répondu à une question");
        }
    });

    /**
     * Un professeur demande a passer à la question suivante
     * si data == true : relancer la meme question
     */
    socket.on('nextQuestion', function(data){
        if (client instanceof Professeur && questionnaireId in groups){

            question = groups[questionnaireId]["questionActuelle"];

            if (data == false){
                var question = new Question(); // Todo : récupérer prochaine question
                groups[questionnaireId]["questionActuelle"] = question;
            }


            for (var i = 0, length = groups[questionnaireId]["etudiants"].length ; i < length ; i++){
                groups[questionnaireId]["etudiants"][i].socket.emit("newQuestion", question);
            }
            groups[questionnaireId]["professeur"].socket.emit("newQuestion", question);

            if (testMode){
                console.log("Un professeur a demander a passer à la question suivante");
            }
        }
    });

    /**
     * Un professeur demande a arreter les réponses
     */
    socket.on('stopAnswerQuestion', function(data){
        if (client instanceof Professeur && questionnaireId in groups){

            groups[questionnaireId]["questionActuelle"] = null;

            for (var i = 0, length = groups[questionnaireId]["etudiants"].length ; i < length ; i++){
                groups[questionnaireId]["etudiants"][i].socket.emit("stopAnswerQuestion");
            }

            var results = null; // Todo : récuperer les résultats

            groups[questionnaireId]["professeur"].socket.emit("showResultQuestion", results);

            if (testMode){
                console.log("Un professeur a demander d'arreter les réponses");
            }
        }
    });


    /**
     * Client déconnecté
     */
    socket.on('disconnect', function(data){
        if (client != null && questionnaireId in groups){
            // Si l'utilisateur était connecté à un questionnaire : on le déconnecte

            if (client instanceof Professeur){
                // Todo : ? supprimer le questionnaire ?

            }else if (client instanceof Etudiant){
                groups[questionnaireId]["etudiants"].remove(client);

                groups[questionnaireId]["professeur"].socket.emit("userDisconnected", client.nom + " " + client.prenom);
            }
        }

        if (testMode){
            console.log("Un utilisateur s'est déconnecté");
        }
    });
});
