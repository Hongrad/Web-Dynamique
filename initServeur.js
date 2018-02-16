conf = require('./conf.json');

var path = require('path');
var express = require('express');
var mysql = require('mysql');
var EtudiantModule = require('./Classes/Etudiant.js');


var server = express();

server.get('/:idObjet/Questionnaire', function(req, res) {
  var params = {};
  params.idObjet = req.params.idObjet;
  params.nom = "idQuestionnaire";
  res.render('Questionnaire.ejs', params);
});

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
