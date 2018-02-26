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

// Les routes qui suivent seront à modifier, elles me servent à tester mes pages pour l'instant
/*server.get('/question', function(req, res) {
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
});*/
server.get('/questionnaires', function(req, res) {
    var params = {};
    var questionnaire = new Questionnaire();
    var resQuestionnaire = questionnaire.getAll(connection);
    resQuestionnaire.then(function(result) {
      if (result) {
        params.Allquestionnaires = result;
        res.render('questionnaires.ejs', params);
      }
    });
});
server.get('/questionnaire', function(req, res) {
    var params = {};
    res.render('previewQuestionnaire.ejs', params);
});

var prof = null;

// Acceder au questionnaire
server.get('/:idObjet/questionnaire', function(req, res) {

    // Todo : vérifier que l'utilisateur est connecté

    var client = null;
    if (prof == null){
        client = new Professeur(); // Todo : récupérer le client connecté
        prof = true;
    }else{
        client = new Etudiant(); // Todo : récupérer le client connecté
        client.idEtudiant = Math.round(Math.random() * 10000000000);
    }

    if (client == null){
        res.status(403)
            .send('Identification impossible !');
        return;
    }

    var questionnaireId = req.params.idObjet;

    var questionnaire = new Questionnaire();
    var resQuestionnaire = questionnaire.getById(connection, questionnaireId);
    resQuestionnaire.then(function(questionnaire) {
        if (questionnaire == null){
            res.status(404)
                .send('Questionnaire introuvable !');
            return;
        }

        if (questionnaire.questions.length === 0){
            res.status(404)
                .send('Ce questionnaire n\'a pas de questions !');
            return;
        }

        // Todo : check pid et mot de passe

        var identificationId = Math.round(Math.random() * 10000000000); // Todo : creer une vraie valeur aléatoire

        waitToIdentify[identificationId] = {"client": client, "questionnaireId": questionnaireId};

        var isProf = false;
        if (client instanceof Professeur){
            isProf = true;
        }

        var params = {};
        params.questionnaireId = questionnaireId;
        params.identificationId = identificationId;
        params.isProf = isProf;
        params.pid = questionnaire.pid;
        res.render('questionnaire.ejs', params);
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
// 1 groupe : [questionnaire, professeur, etudiants, questionActuelle, reponsesArrete, estArrete, resultats]
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

            var questionnaire = new Questionnaire();
            var resQuestionnaire = questionnaire.getById(connection, questionnaireId);
            resQuestionnaire.then(function(questionnaire) {
                delete waitToIdentify[identificationId];

                var connecte = false;

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
                                "questionActuelle": null,
                                "reponsesArrete": true,
                                "resultats": []
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

            var reponses = [];

            var getReponseCallback = function (reponse) {
                let question = groups[questionnaireId]["questionActuelle"];

                reponses.push(reponse);
                groups[questionnaireId]["resultats"][reponse.idReponse] = 0;

                if (reponses.length === question.reponses.length){
                    question.reponses = reponses;

                    for (var i = 0, length = groups[questionnaireId]["etudiants"].length ; i < length ; i++){
                        groups[questionnaireId]["etudiants"][i].socket.emit("newQuestion", question);
                    }
                    socket.emit("newQuestion", question);

                    if (testMode){
                        console.log("Un professeur a demander a passer à la question suivante");
                    }
                }
            };

            var getQuestionCallback = function (question) {
                groups[questionnaireId]["questionActuelle"] = question;
                groups[questionnaireId]["reponsesArrete"] = false;

                // Recupération des réponses
                for (reponseId of question.reponses) {

                    Reponse.getById(connection, reponseId, getReponseCallback);
                }
            };


            groups[questionnaireId]["resultats"] = [];
            let questionActuelle = groups[questionnaireId]["questionActuelle"];

            if (data === true && questionActuelle != null){
                // Relancer la meme question
                for (reponse of questionActuelle.reponses){
                    groups[questionnaireId]["resultats"][reponse.idReponse] = 0;
                }

                for (var i = 0, length = groups[questionnaireId]["etudiants"].length ; i < length ; i++){
                    groups[questionnaireId]["etudiants"][i].socket.emit("newQuestion", questionActuelle);
                }
                socket.emit("newQuestion", questionActuelle);

                if (testMode){
                    console.log("Un professeur a demander a relancer la question");
                }
            }else{
                // Lancer la question suivante
                let nextQuestionId = null;

                if (questionActuelle == null){
                    // Première question
                    nextQuestionId = groups[questionnaireId]["questionnaire"].questions[0];
                }else if (groups[questionnaireId]["questionnaire"].questions.length > groups[questionnaireId]["questionnaire"].questions.indexOf(questionActuelle.idQuestion) + 1){
                    nextQuestionId = groups[questionnaireId]["questionnaire"].questions[groups[questionnaireId]["questionnaire"].questions.indexOf(questionActuelle.idQuestion) + 1];
                }else{
                    // On était à la dernière question
                    socket.emit("noMoreQuestion", null);
                    return;
                }

                Question.getById(connection, nextQuestionId, getQuestionCallback);
            }

        }
    });

    /**
     * Un étudiant répond à une question
     */
    socket.on('answerQuestion', function(data){
        if (questionnaireId in groups && groups[questionnaireId]["questionActuelle"] != null){
            var reponsesId = data;

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

            for (var i = 0, length = groups[questionnaireId]["etudiants"].length ; i < length ; i++){
                groups[questionnaireId]["etudiants"][i].socket.emit("stopAnswerQuestion");
            }

            var resultats = groups[questionnaireId]["resultats"];

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

                for (var i = 0, length = groups[questionnaireId]["etudiants"].length ; i < length ; i++){
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
