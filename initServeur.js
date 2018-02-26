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

var server = express();
// parse application/x-www-form-urlencoded
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

server.use(cookieParser());
server.use(session({
    secret: "a secret key",
    cookie: { maxAge: 2628000000 },
    resave: false,
    saveUninitialized: false
}));

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
server.get('/questionnaires', function(req, res) {
    var params = {};
<<<<<<< HEAD
    var questionnaire = new Questionnaire();
    var resQuestionnaire = questionnaire.getAll(connection);
    resQuestionnaire.then(function(result) {
      if (result) {
        params.Allquestionnaires = result;
        res.render('questionnaires.ejs', params);
      }
=======
    Questionnaire.getAll(connection).then(function(result) {
      if (result) {params.allQuestionnaire = result;}
>>>>>>> b8d47b531ca3aabeef8f05ceeca4f50efa0e3112
    });
});
server.get('/:idObjet/previewQuestionnaire', function(req, res) {
    var params = {};
    var questionnaire = new Questionnaire();
    var resQuestionnaire = questionnaire.getById(connection, req.params.idObjet);
    resQuestionnaire.then(function(result) {
      if (result) {
        params.questionnaire = result;
        var questions = new Question();
        var resQuestion = Question.getByIdQuestionnaire(connection, req.params.idObjet);
        resQuestion.then(function(result2){
          params.questions = result2;
          res.render('previewQuestionnaire.ejs', params);
        });
      }
    });
});

var prof = null;

// Acceder au questionnaire
server.get('/:idObjet/questionnaire', function(req, res) {

    if (req.session.client){ // Todo : négation
        res.status(403)
            .send('Identification impossible !');
        return;
    }

    let client = req.session.client;
    if (prof == null){
        client = new Professeur(); // Todo : récupérer le client connecté
        client.idProfesseur = 1;
        prof = true;
    }else{
        client = new Etudiant(); // Todo : récupérer le client connecté
        client.idEtudiant = Math.round(Math.random() * 10000000000);
    }

    let questionnaireId = req.params.idObjet;

    Questionnaire.getById(connection, questionnaireId).then(function(questionnaire) {
        if (questionnaire == null){
            res.status(404)
                .send('Questionnaire introuvable !');
            return;
        }

        Question.getByQuestionnaireId(connection, questionnaire.idQuestionnaire).then(function (questions) {
            if (questions.length === 0){
                res.status(404)
                    .send('Ce questionnaire n\'a pas de questions !');
                return;
            }

            // Todo : check pid et mot de passe

            let identificationId = Math.round(Math.random() * 10000000000); // Todo : creer une vraie valeur aléatoire

            waitToIdentify[identificationId] = {"client": client, "questionnaireId": questionnaireId};

            let isProf = false;
            if (client instanceof Professeur){
                isProf = true;
            }

            let params = {};
            params.questionnaireId = questionnaireId;
            params.identificationId = identificationId;
            params.isProf = isProf;
            params.pid = questionnaire.pid;
            res.render('questionnaire.ejs', params);
        });
    });
});

server.post('/newQuestionnaire', jsonParser, function(req, res){console.log(req.session);
  var questionnaire = new Questionnaire(req.body["PassQuestionnaire"],req.body["titreQuestionnaire"],1);
  var resQuestionnaire = questionnaire.createInDB(connection,questionnaire);
  resQuestionnaire.then(function(result) {
    //Si l'insertion s'est bien passée
    if (result) {
      var idQuestionnaire = result;
      for(var index in req.body) {
        if(index!="titreQuestionnaire" && index!="PassQuestionnaire") {
          var question = new Question(req.body[index]["libelle"],req.body[index]["multiple"],idQuestionnaire);
          var resQuestion = question.createInDB(connection,question,index);
          resQuestion.then(function(result2) {
            //Si l'insertion s'est bien passée
            if (result2) {
              var idQuestion = result2[0];
              var numRep = result2[1];
              for(var index2 in req.body[numRep]["reponses"]) {console.log(numRep);
                var reponse = new Reponse(req.body[numRep]["reponses"][index2]["libelle"],req.body[numRep]["reponses"][index2]["estLaReponse"],idQuestion);
                var resReponse = reponse.createInDB(connection,reponse);
              }
            }
          });
        }
      }
    }
  });
  var params = {};
  res.json({status: "Success", redirect: '/'});
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

server.use('/css', express.static(path.join(__dirname + '/template/css')));
server.use('/img', express.static(path.join(__dirname + '/template/img')));
server.use('/js', express.static(path.join(__dirname + '/template/js')));
server.use('/Classes', express.static(path.join(__dirname + '/Classes')));


var io = sockets.listen(server.listen(666));

// -----------------------------------------------------------------------------
// socket
// -----------------------------------------------------------------------------

// Ajoute des log à la console pour les tests
var testMode = true;

// Liste des clients en attente d'identification
var waitToIdentify = [];

// Liste des groupes connéctés
// les clées sont les id des questionnaires
// 1 groupe : [questionnaire, professeur, etudiants, questions, questionActuelle, reponsesArrete, resultats, etudiantQuiOntRepondu]
var groups = [];

// Nouvelle connexion
io.sockets.on("connection", function (socket){
    if (testMode){
        console.log("Un nouvelle utilisateur s'est connecté");
    }

    // Le client lié à la socket
    let client = null;

    // L'id du questionnaire dans lequel l'utilisateur s'est connecté
    let questionnaireId = null;

    /**
     * Identification
     * Transforme le client en étudiant ou professeur
     */
    socket.on('identify', function(data){

        let identificationId = data.identificationId;

        if (identificationId in waitToIdentify){

            client = waitToIdentify[identificationId]["client"];
            client.socket = socket;

            questionnaireId = waitToIdentify[identificationId]["questionnaireId"];

            Questionnaire.getById(connection, questionnaireId).then(function(questionnaire) {
                Question.getByQuestionnaireId(connection, questionnaire.idQuestionnaire).then(function (questions) {
                    delete waitToIdentify[identificationId];

                    let connecte = false;

                    if (client instanceof Professeur){
                        if (questionnaireId in groups){
                            if (client.idProfesseur === groups[questionnaireId]["professeur"].idProfesseur){
                                // Si le prof se reconnect à un questionnaire
                                groups[questionnaireId]["professeur"] = client;
                                connecte = true;
                            }
                        }else{
                            if (client.idProfesseur === questionnaire.idProfesseur){
                                // Si le prof se connect à un questionnaire qui n'est pas encore ouvert : on ouvre le questionnaire
                                groups[questionnaireId] = {
                                    "questionnaire": questionnaire,
                                    "professeur": client,
                                    "etudiants": [],
                                    "questions": questions,
                                    "questionActuelle": null,
                                    "reponsesArrete": true,
                                    "resultats": [],
                                    "etudiantQuiOntRepondu": []
                                };
                                connecte = true;
                            }
                        }

                    }else if (client instanceof Etudiant){
                        if (questionnaireId in groups){
                            // Si le questionnaire est ouvert
                            groups[questionnaireId]["etudiants"].push(client);
                            connecte = true;

                            groups[questionnaireId]["professeur"].socket.emit("newUser", {"id": client.idEtudiant, "nom": client.nom + " " + client.prenom});
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

                        if (!groups[questionnaireId]["reponsesArrete"]){
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
                });
            });
        }else{
            socket.emit("errors", "Erreur de connexion : identifiant invalide");

            if (testMode){
                console.log("Un utilisateur n'a pas réussi à s'identifier : identifiant invalide");
            }
        }
    });

    /**
     * Un professeur demande a passer à la question suivante
     * si data == true : relancer la meme question
     */
    socket.on('nextQuestion', function(data){
        if (client instanceof Professeur && questionnaireId in groups){

            groups[questionnaireId]["resultats"] = [];
            groups[questionnaireId]["etudiantQuiOntRepondu"] = [];

            var questionActuelle = groups[questionnaireId]["questionActuelle"];

            if (data === true && questionActuelle != null){
                // Relancer la meme question
                for (reponse of questionActuelle.reponses){
                    groups[questionnaireId]["resultats"][reponse.idReponse] = 0;
                }

                for (let i = 0, length = groups[questionnaireId]["etudiants"].length ; i < length ; i++){
                    groups[questionnaireId]["etudiants"][i].socket.emit("newQuestion", questionActuelle);
                }
                socket.emit("newQuestion", questionActuelle);

                if (testMode){
                    console.log("Un professeur a demander a relancer la question");
                }
            }else{
                // Lancer la question suivante
                var nextQuestion = null;

                if (questionActuelle == null){
                    // Première question
                    nextQuestion = groups[questionnaireId]["questions"][0];
                }else if (groups[questionnaireId]["questions"].length > groups[questionnaireId]["questions"].indexOf(questionActuelle) + 1){
                    nextQuestion = groups[questionnaireId]["questions"][groups[questionnaireId]["questions"].indexOf(questionActuelle) + 1];
                }else{
                    // On était à la dernière question
                    socket.emit("noMoreQuestion", null);
                    return;
                }

                groups[questionnaireId]["questionActuelle"] = nextQuestion;
                groups[questionnaireId]["reponsesArrete"] = false;

                // Recupération des réponses
                Reponse.getByQuestionId(connection, nextQuestion.idQuestion).then(function(reponses) {

                    for (reponse of reponses){
                        groups[questionnaireId]["resultats"][reponse.idReponse] = 0;
                    }

                    nextQuestion.reponses = reponses;

                    for (let i = 0, length = groups[questionnaireId]["etudiants"].length ; i < length ; i++){
                        groups[questionnaireId]["etudiants"][i].socket.emit("newQuestion", nextQuestion);
                    }
                    socket.emit("newQuestion", nextQuestion);

                    if (testMode){
                        console.log("Un professeur a demander a passer à la question suivante");
                    }
                });
            }

        }
    });

    /**
     * Un étudiant répond à une question
     */
    socket.on('answerQuestion', function(reponsesId){
        if (questionnaireId in groups
            && groups[questionnaireId]["questionActuelle"] != null
            && groups[questionnaireId]["etudiantQuiOntRepondu"].indexOf(client) === -1){

            groups[questionnaireId]["etudiantQuiOntRepondu"].push(client);

            for (reponseId of reponsesId){
                if (reponseId in groups[questionnaireId]["resultats"]){
                    groups[questionnaireId]["resultats"][reponseId] ++;
                }
            }

            if (testMode){
                console.log("Un étudiant à répondu à une question");
            }
        }
    });

    /**
     * Un professeur demande a arreter les réponses
     */
    socket.on('stopAnswerQuestion', function(data){
        if (client instanceof Professeur && questionnaireId in groups){

            groups[questionnaireId]["reponsesArrete"] = true;

            for (let i = 0, length = groups[questionnaireId]["etudiants"].length ; i < length ; i++){
                groups[questionnaireId]["etudiants"][i].socket.emit("stopAnswerQuestion");
            }

            let resultats = groups[questionnaireId]["resultats"];

            socket.emit("showResultQuestion", resultats);

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
                // Si le prof se déconnect : on supprime le questionnaire

                for (let i = 0, length = groups[questionnaireId]["etudiants"].length ; i < length ; i++){
                    groups[questionnaireId]["etudiants"][i].socket.emit("errors", "Erreur : le professeur s'est déconnecté");
                }

                delete groups[questionnaireId];

            }else if (client instanceof Etudiant){
                groups[questionnaireId]["etudiants"].splice(groups[questionnaireId]["etudiants"].indexOf(client), 0);

                groups[questionnaireId]["professeur"].socket.emit("userDisconnected", {"id": client.idEtudiant, "nom": client.nom + " " + client.prenom});
            }
        }

        if (testMode){
            console.log("Un utilisateur s'est déconnecté");
        }
    });
});
