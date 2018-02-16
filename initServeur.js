conf = require('./conf.json');

var express = require('express');
var server = express();
var path = require('path');

server.get('/', function(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(path.join((__dirname + '/template/accueil.html')))
});

server.use('/css', express.static(path.join(__dirname + '/template/css')));

server.listen(666);
