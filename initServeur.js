conf = require('./conf.json');

var express = require('express');
var sockets = require('socket.io');
var server = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');

var Client = require('./Classes/Client.js');
var Etudiant = require('./Classes/Etudiant');
var Professeur = require('./Classes/Professeur');
var Question = require('./Classes/Question');
var Questionnaire = require('./Classes/Questionnaire');
var Reponse = require('./Classes/Reponse');
var Resultat = require('./Classes/Resultat');

server.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.sendFile(path.join((__dirname + '/template/accueil.html')));
});

server.use('/css', express.static(path.join(__dirname + '/template/css')));
server.use('/js', express.static(path.join(__dirname + '/template/js')));

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
