function Question() {
  this.id = -1;
	this.libelle = "";
	this.multiple = false;
  this.reponsesID = [];
  this.nbreponses = 4;

	this.create = function(libelle,multiple) {
		this.libelle = libelle;
    this.multiple = multiple;
	}

  this.push = function() {
    //TODO creation d'un objet question avec apelle ajax
  }

  this.get = function() {
    //TODO récupérration d'une question dans la BD
    return this;
  }

  this.addReponses = function(idReponse) {
    if(nbreponses>0) {
      this.reponsesID.push({numReponse : ""+this.nbreponses+"",idReponse : ""+idReponse+""});
      this.nbreponses--;
    } else {
      return 0;
    }
  }
}
