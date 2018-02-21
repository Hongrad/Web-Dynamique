conf = require('./conf.json');

var path = require('path');
var express = require('express');
var sockets = require('socket.io');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');
var mysql = require('mysql');

var Client = require('./Classes/Client.js');
var Etudiant = require('./Classes/Etudiant');
var Professeur = require('./Classes/Professeur');
var Question = require('./Classes/Question');
var Questionnaire = require('./Classes/Questionnaire');
var Reponse = require('./Classes/Reponse');
var Resultat = require('./Classes/Resultat');


var server = express();


server.get('/', function(req, res) {
  res.sendFile(path.join((__dirname + '/template/accueil.html')))
});
server.get('/connexion', function(req, res) {
  res.sendFile(path.join((__dirname + '/template/connexion.html')))
});
server.get('/creerQuestionnaire', function(req, res) {
  res.sendFile(path.join((__dirname + '/template/creerQuestionnaire.html')))
});

// Les routes qui suivent seront à modifier, elles me servent à tester mes pages pour l'instant
server.get('/question', function(req, res) {
  res.sendFile(path.join((__dirname + '/template/question.html')))
});
server.get('/reponse', function(req, res) {
  res.sendFile(path.join((__dirname + '/template/reponse.html')))
});
server.get('/attente', function(req, res) {
  res.sendFile(path.join((__dirname + '/template/attente.html')))
});
server.get('/finQuestion', function(req, res) {
  res.sendFile(path.join((__dirname + '/template/finQuestion.html')))
});
server.get('/listeParticipants', function(req, res) {
  res.sendFile(path.join((__dirname + '/template/listeParticipants.html')))
});
server.get('/questionnaires', function(req, res) {
  res.sendFile(path.join((__dirname + '/template/questionnaires.html')))
});
server.get('/questionnaire', function(req, res) {
  res.sendFile(path.join((__dirname + '/template/previewQuestionnaire.html')))
});
server.get('/attente', function(req, res) {
  res.sendFile(path.join((__dirname + '/template/attente.html')))
});

server.get('/:idObjet/Questionnaire', function(req, res) {

    // Todo : vérifier l'éxistence du questionnaire

    var client = new Etudiant(); // Todo : récupérer le client connecté

    var questionnaireId = req.params.idObjet;
    var identificationId = Math.round(Math.random() * 10000000000); // Todo : creer une vraie valeur aléatoire

    waitToIdentify[identificationId] = {"client": client, "questionnaireId": questionnaireId};

    var params = {};
    params.questionnaireId = questionnaireId;
    params.identificationId = identificationId;
    res.render('Questionnaire.ejs', params);
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
// 1 groupe : [professeur, etudiants]
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
                    var questionnaire = Questionnaire.getById(questionnaireId);
                    groups[questionnaireId] = {"professeur": client, "etudiants": []};
                    connecte = true;
                }

            }else if (client instanceof Etudiant){
                if (questionnaireId in groups){
                    // Si le questionnaire est ouvert et que le mot de passe est bon
                    groups[questionnaireId]["etudiants"].push(client);
                    connecte = true;

                    // Todo : envoyer notification au prof
                }else{
                    socket.emit("errors", "Le questionnaire n'a pas démarré");

                    if (testMode){
                        console.log("Un utilisateur n'a pas réussi à se connecter à un questionnaire");
                    }
                    return;
                }
            }

            if (connecte){
                socket.emit("identifySuccess", null);

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
        // Todo
    });

    /**
     * Client déconnecté
     */
    socket.on('disconnect', function(data){
        if (client != null){
            // Si l'utilisateur était connecté à un questionnaire : on le déconnecte
            groups[questionnaireId]["etudiants"].remove(client);
            // Todo : envoyer notification au prof
        }

        if (testMode){
            console.log("Un utilisateur s'est déconnecté");
        }
    });
});
