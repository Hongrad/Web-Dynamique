conf = require('./conf.json');

var path = require('path');
var express = require('express');
var sockets = require('socket.io');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');
var mysql = require('mysql');

var EtudiantModule = require('./Classes/Etudiant.js');
var Client = require('./Classes/Client.js');
var Etudiant = require('./Classes/Etudiant');
var Professeur = require('./Classes/Professeur');
var Question = require('./Classes/Question');
var Questionnaire = require('./Classes/Questionnaire');
var Reponse = require('./Classes/Reponse');
var Resultat = require('./Classes/Resultat');


var server = express();


server.get('/', function(req, res) {
  res.send(path.join((__dirname + '/Views/accueil.ejs')))
});
server.get('/connexion', function(req, res) {
  res.send(path.join((__dirname + '/Views/connexion.ejs')))
});
server.get('/creerQuestionnaire', function(req, res) {
  res.send(path.join((__dirname + '/Views/creerQuestionnaire.ejs')))
});

// Les routes qui suivent seront à modifier, elles me servent à tester mes pages pour l'instant
server.get('/question', function(req, res) {
  res.send(path.join((__dirname + '/Views/question.ejs')))
});
server.get('/reponse', function(req, res) {
  res.send(path.join((__dirname + '/Views/reponse.ejs')))
});
server.get('/attente', function(req, res) {
  res.send(path.join((__dirname + '/Views/attente.ejs')))
});
server.get('/finQuestion', function(req, res) {
  res.send(path.join((__dirname + '/Views/finQuestion.ejs')))
});
server.get('/listeParticipants', function(req, res) {
  res.send(path.join((__dirname + '/Views/listeParticipants.ejs')))
});
server.get('/questionnaires', function(req, res) {
  res.send(path.join((__dirname + '/Views/questionnaires.ejs')))
});
server.get('/questionnaire', function(req, res) {
  res.send(path.join((__dirname + '/Views/previewQuestionnaire.ejs')))
});
server.get('/attente', function(req, res) {
  res.send(path.join((__dirname + '/Views/attente.ejs')))
});

server.get('/:idObjet/Questionnaire', function(req, res) {
  var params = {};
  params.idObjet = req.params.idObjet;
  params.nom = "idQuestionnaire";
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

var etudiant = new EtudiantModule("","");
var etudiant = new Etudiant("","");
etudiant.getById(connection,2);


server.use('/css', express.static(path.join(__dirname + '/template/css')));
server.use('/img', express.static(path.join(__dirname + '/template/img')));
server.use('/js', express.static(path.join(__dirname + '/template/js')));
server.use('/Classes', express.static(path.join(__dirname + '/Classes')));

server.listen(666);
server.use(cookieParser());
server.use(session({
    secret: "a secret key",
    cookie: { maxAge: 2628000000 },
    resave: false,
    saveUninitialized: false
}));

var io = sockets.listen(server.listen(7800));

// -----------------------------------------------------------------------------
// socket
// -----------------------------------------------------------------------------

// Ajoute des log à la console pour les tests
var testMode = true;

// Liste des groupes connéctés
// les clées sont les id des questionnaires
// 1 groupe : [professeur, motDePasse, etudiants]
var groups = [];

// Nouvelle connexion
io.sockets.on("connection", function (socket){
    if (testMode){
        console.log("Un nouvelle utilisateur s'est connecté");
    }

    // Le client lié à la socket
    var client = new Client(socket);

    // L'id du questionnaire dans lequel l'utilisateur s'est connecté
    var questionnaireId = null;

    /**
     * Identification
     * Transforme le client en étudiant ou professeur
     */
    socket.on('identify', function(data){
        // Todo
        if (testMode){
            console.log("Un utilisateur s'est identifié");
        }

        socket.emit("connectionSuccess", null);
    });

    /**
     * Connexion au questionnaire
     *
     * data : [questionnaireId, motDePasse]
     */
    socket.on('connectToQuestioning', function(data){
        if (testMode){
            console.log("Un utilisateur se connecte a un questionnaire");
        }

        if (client instanceof Professeur){
            if (data["questionnaireId"] in groups){
                // Si le prof se reconnect à un questionnaire
                questionnaireId = data["questionnaireId"];
                groups[questionnaireId]["professeur"] = client;

            }else{
                // Si le prof se connect à un questionnaire qui n'est pas encore ouvert : on ouvre le questionnaire
                var questionnaire = Questionnaire.getById(data["questionnaireId"]);

                questionnaireId = questionnaire.idQuestion;
                groups[questionnaireId] = {"professeur": client, "motDePasse": questionnaire.motDePasse, "etudiants": []};
            }

        }else if (client instanceof Etudiant){
            if (data["questionnaireId"] in groups && groups[data["questionnaireId"]]["motDePasse"] === data["motDePasse"]){
                // Si le questionnaire est ouvert et que le mot de passe est bon
                questionnaireId = data["questionnaireId"];
                groups[questionnaireId]["etudiants"].push(client);

                // Todo : envoyer notification au prof
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
        if (testMode){
            console.log("Un utilisateur c'est déconnecté");
        }

        if (questionnaireId != null){
            // Si l'utilisateur était connecté à un questionnaire : on le déconnecte
            groups[questionnaireId]["etudiants"].remove(client);
            // Todo : envoyer notification au prof
        }
    });
});
