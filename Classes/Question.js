/**
 * Une Question
 */
class Question {

    static get nbReponse() {
        return 4;
    }
    /**
     * @param libelle
     * @param multiple
     * @param idQuestionnaire
     */
    constructor(libelle, multiple, idQuestionnaire) {
        this._idQuestion = -1;
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
     * Récupère les question d'un questionnaire
     *
     * @param db
     * @param questionnaireId
     *
     * @returns {question}
     */
    static getByQuestionnaireId(db, questionnaireId) {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM question WHERE idQuestionnaire=?", [questionnaireId], function (err, result) {
                if (err) {
                    return reject(err);
                }else{
                    let questions = [];
                    for (let i = 0 ; i < result.length ; i++) {
                        let question = new Question();
                        question.idQuestion = result[i].idQuestion;
                        question.libelle = result[i].libelle;
                        question.multiple = result[i].multiple;
                        question.idQuestionnaire = result[i].idQuestionnaire;
                        questions.push(question);
                    }
                    resolve(questions); // Renvoie la liste des questions
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
