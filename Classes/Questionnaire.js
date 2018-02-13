function Questionnaire() {
  this.id = -1;
	this.pid = -1;
	this.motDePasse = "";
  this.questionsID = [];
  this.nbQuestions = 1;
  this.idProfesseur = -1;

	this.create = function(motDePasse,idProfesseur) {
    generatePid();
    this.motDePasse = motDePasse;
    this.idProfesseur = idProfesseur;
	}

  this.get = function() {
    //TODO récupérration d'une question dans la BD
  }

  this.push = function() {
    //TODO creation d'un objet question avec apelle ajax
  }

  this.addQuestion = function(idQuestion) {
    this.questionsID.push({numQuestion : ""+this.nbQuestions+"",idQuestion : ""+idQuestion+""});
    this.nbQuestions++;
  }

  this.getQuestions = function() {

  }

  this.generatePid = function() {
    this.pid = Math.floor(Math.random() * 100001);
  }
}
