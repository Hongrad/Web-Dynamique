conf = require('./conf.json');

var path = require('path');
var express = require('express');
var mysql = require('mysql');
var EtudiantModule = require('./Classes/Etudiant.js');


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
etudiant.getById(connection,2);


server.use('/css', express.static(path.join(__dirname + '/template/css')));
server.use('/Classes', express.static(path.join(__dirname + '/Classes')));

server.listen(666);
