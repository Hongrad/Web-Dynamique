/**
 * Un Questionnaire
 */
class Questionnaire {

    /**
     * @param titre
     * @param motDePasse
     * @param idProfesseur
     */
    constructor(motDePasse, titre, idProfesseur) {
        this._idQuestionnaire = -1;
        this._pid = Questionnaire.generatePid();
        this._titre = titre;
        this._motDePasse = motDePasse;
        this._idProfesseur = idProfesseur;
    }
    /**
     * Ajoute une question au questionnaire
     *
     * @param idQuestion
     */
    addQuestion(idQuestion) {
        this._questions.push({numQuestion : ""+this.questions.length+"",idQuestion : ""+idQuestion+""});
    }

    /*generatePid() {
        this._pid = Math.floor(Math.random() * 100001);
    }*/

    static generatePid(){
        return Math.round(Math.random() * 100001); // Todo : creer une vraie valeur aléatoire
    }

    // ------------------------------------------------------------------------------
    // Fonctions de mapping avec la BDD
    // ------------------------------------------------------------------------------

    /**
     * Crée un questionnaire en BD et met à jour son id
     *
     * @param db
     * @returns {boolean} true si succes
     */
    createInDB(db,questionnaire) {
      return new Promise((resolve, reject) => {
        db.query("INSERT INTO questionnaire (pid,motDePasse,titre,idProfesseur) VALUES (?,?,?,?)", [questionnaire._pid,questionnaire._motDePasse,questionnaire._titre,questionnaire._idProfesseur], function (err, result) {
          if (err) {
              return reject(err);
            }
            else {
              resolve(result.insertId); //on retourne l'id de l'élément inséré
            }
        });
    });
    }

    /**
	 * Récupère un questionnaire avec son id
	 *
	 * @param db
	 * @param id
	 * @returns {Questionnaire}
	 */
	static getById(db, id) {
		return new Promise((resolve, reject) => {
            db.query("SELECT * FROM questionnaire WHERE idQuestionnaire=?", [id], function (err, result) {
                if (err) {
                    return reject(err);
                }else if (result.length == 0) {
                    resolve(null);
                }else{
                    let questionnaire = new Questionnaire();
                    questionnaire.idQuestionnaire = result[0].idQuestionnaire;
                    questionnaire.pid = result[0].pid;
                    questionnaire.titre = result[0].titre;
                    questionnaire.motDePasse = result[0].motDePasse;
                    questionnaire.idProfesseur = result[0].idProfesseur;
                    resolve(questionnaire);
                }
            });
		});
	}

    /**
    * Récupère un questionnaire avec son id
    *
    * @param db
    * @param id
    * @returns {Questionnaire}
    */
    static getByIdProf(db,id) {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM questionnaire WHERE idProfesseur=?", [id], function (err, result) {
                if (err) {
                return reject(err);
              }
              else {
                var questionnaires = [];
  							for (var i = 0; i < result.length; i++) {
                  var questionnaire = new Questionnaire();
                  questionnaire.idQuestionnaire = result[i].idQuestionnaire;
                  questionnaire.pid = result[i].pid;
                  questionnaire.titre = result[i].titre;
                  questionnaire.motDePasse = result[i].motDePasse;
                  questionnaire.idProfesseur = result[i].idProfesseur;
  								questionnaires.push(questionnaire);
  							}
  							resolve(questionnaires); // Renvoie la liste des questionnaires
              }
          });
      });
    }

	/**
	 * Récupère tous les questionnaires
	 *
	 * @param db
	 * @returns {Questionnaire}
	 */
    static getAll(db) {
		return new Promise((resolve, reject) => {
				db.query("SELECT * FROM questionnaire",function (err, result) {
						if (err) {
							return reject(err);
						}
						else {
							var questionnaires = [];
							for (var i = 0; i < result.length; i++) {
                var questionnaire = new Questionnaire();
                questionnaire.idQuestionnaire = result[i].idQuestionnaire;
                questionnaire.pid = result[i].pid;
                questionnaire.titre = result[i].titre;
                questionnaire.motDePasse = result[i].motDePasse;
                questionnaire.idProfesseur = result[i].idProfesseur;
								questionnaires.push(questionnaire);
							}
							resolve(questionnaires); // Renvoie la liste des questionnaires
						}
				});
		});
	}

    // ------------------------------------------------------------------------------
    // Getter / Setter
    // ------------------------------------------------------------------------------

    get idQuestionnaire() {
        return this._idQuestionnaire;
    }

    set idQuestionnaire(value) {
        this._idQuestionnaire = value;
    }

    get pid() {
        return this._pid;
    }

    set pid(value) {
        this._pid = value;
    }

    get titre() {
        return this._titre;
    }

    set titre(value) {
        this._titre = value;
    }

    get motDePasse() {
        return this._motDePasse;
    }

    set motDePasse(value) {
        this._motDePasse = value;
    }

    get questions() {
        return this._questions;
    }

    set questions(value) {
        this._questions = value;
    }

    get idProfesseur() {
        return this._idProfesseur;
    }

    set idProfesseur(value) {
        this._idProfesseur = value;
    }
}

if (typeof window === 'undefined') {
    // Coté serveur
    module.exports = Questionnaire;
}
