/**
 * Une Question
 */
class Question {

    static get nbReponse() {
        return 4;
    }
    /**
     *
     * @param idQuestion
     * @param libelle
     * @param multiple
     * @param idQuestionnaire
     * @param reponses
     */
    constructor(libelle, multiple, idQuestionnaire) {
        this._libelle = libelle;
        this._multiple = multiple;
        this._idQuestionnaire = idQuestionnaire;
    }

    /**
     * Ajoute une réponse à un question
     *
     * @param reponseId
     * @returns {boolean} true si succes
     */
    addReponses(reponseId) {
        if(this.reponses.length < Question.nbReponse) {
            this.reponses.push({numReponse : ""+this.reponses.length+"",idReponse : ""+reponseId+""});
            return true;
        } else {
            return false;
        }
    }

    // ------------------------------------------------------------------------------
    // Fonctions de mapping avec la BDD
    // ------------------------------------------------------------------------------

    /**
     * Crée une question en BD et met à jour son id
     *
     * @param db
     * @returns {boolean} true si succes
     */
    createInDB(db,question,numRep) {
      return new Promise((resolve, reject) => {
        db.query("INSERT INTO question (libelle,multiple,idQuestionnaire) VALUES (?,?,?)", [question._libelle,question._multiple,question._idQuestionnaire], function (err, result) {
          if (err) {
              return reject(err);
            }
            else {
              var array = [result.insertId,numRep];
							resolve(array); //Tout c'est bien passé, on retourne l'id de l'élément inséré
            }
        });
    });
    }

    /**
     * Récupère une question via son id
     *
     * @param db
     * @param id
     * @returns {Etudiant}
     */
    static getById(db, id, callback) {
      db.query("SELECT * FROM question WHERE idQuestion=?", [id], function (err, result) {
          if (err) throw err;

          var question = null;

          if (result.length > 0){
              question = new Question(result[0].libelle, result[0].multiple, JSON.parse(result[0].reponses));
              question.idQuestion = result[0].idQuestion;
          }

          return callback(question);
      });
    }

    /**
     * Récupère une question via son id
     *
     * @param db
     * @param id
     * @returns {Etudiant}
     */
    static getByIdQuestionnaire(db, idQuestionnaire) {
      return new Promise((resolve, reject) => {
        db.query("SELECT * FROM question WHERE idQuestionnaire=?", [idQuestionnaire], function (err, result) {
          if (err) {
              return reject(err);
          }else if (result.length == 0) {
              resolve(null);
          }else{
            var questions = [];
            for (var i = 0; i < result.length; i++) {
              var question = new Question();
              question.idQuestion = result[i].idQuestion;
              question.libelle = result[i].libelle;
              question.idQuestionnaire = result[i].idQuestionnaire;
              question.multiple = result[i].multiple;
              questions.push(question);
            }
            resolve(questions);
          }
        });
      });
    }


    // ------------------------------------------------------------------------------
    // Getter / Setter
    // ------------------------------------------------------------------------------

    get idQuestion() {
        return this._idQuestion;
    }

    set idQuestion(value) {
        this._idQuestion = value;
    }

    get libelle() {
        return this._libelle;
    }

    set libelle(value) {
        this._libelle = value;
    }

    get multiple() {
        return this._multiple;
    }

    set multiple(value) {
        this._multiple = value;
    }

    get idQuestionnaire() {
        return this._idQuestionnaire;
    }

    set idQuestionnaire(value) {
        this._idQuestionnaire = value;
    }

    get reponses() {
        return this._reponses;
    }

    set reponses(value) {
        this._reponses = value;
    }
}

if (typeof window === 'undefined') {
    // Coté serveur
    module.exports = Question;
}
