var http = require('http');
var url = require('url');
var fs = require('fs');

function envoyerFichier(filepath, result) {
  fs.readFile(filepath, function (err, data) {
    if (err) {console.log('Erreur en lecture de ' + filepath + ' : ' + err);
    result.writeHead(404);
    result.end('Page ' + filepath + ' could not be found');
  } else {
    result.writeHead(200, {'Content-Type': 'text/html'});
    result.write(data);result.end();}
  });
}

var serveur = http.createServer(
  function(request, result) {
    var page = url.parse(request.url).pathname;
    console.log('Page demandée : ' + page);
    if (page == '/accueil.html') {
      envoyerFichier('../template/accueil.html', result);
    }
  }
);

serveur.listen(50000);
