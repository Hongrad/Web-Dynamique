function Etudiant() {
  this.id = -1;
	this.nom = "";
	this.prenom = "";

	this.create = function(nom,prenom) {
		this.nom = nom;
    this.prenom = prenom;
	}

  this.push = function() {
    //TODO creation d'un objet question avec apelle ajax
  }

  this.get = function() {
    //TODO récupérration d'une question dans la BD
    return this;
  }
}
