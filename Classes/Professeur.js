function Professeur() {
  this.id = -1;
	this.nom = "";
	this.prenom = "";
  this.nomDeCompte = "";
  this.motDePasse = "";
  this.module = "";

	this.create = function(nom,prenom,nomDeCompte,motDePasse,moduleA) {
		this.nom = nom;
    this.prenom = prenom;
    this.nomDeCompte = nomDeCompte;
    this.motDePasse = motDePasse;
    this.module = moduleA;
	}

  this.push = function() {
    //TODO creation d'un objet question avec apelle ajax
  }

  this.get = function() {
    //TODO récupérration d'une question dans la BD
    return this;
  }
}
