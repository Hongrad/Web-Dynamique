function Reponse() {
  this.id = -1;
	this.libelle = "";
	this.estLaReponse = false;
  this.idQuestion;

	this.create = function(libelle,estLaReponse,idQuestion) {
		this.libelle = libelle;
    this.estLaReponse = estLaReponse;
    this.idQuestion = idQuestion;
	}

  this.push = function() {
    //TODO creation d'un objet question avec apelle ajax
  }

  this.get = function() {
    //TODO récupérration d'une question dans la BD
    return this;
  }
}
