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
    static getById(db,id) {
      db.query("SELECT * FROM question WHERE idQuestion=?", [id], function (err, result) {
          if (err) throw err;
          //TODO voir getById Etudiant
      });
    }

    /**
     * Met à jour la question en BD
     *
     * @returns {boolean} true si succes
     */
    updateInDB() {
        // TODO update seulement les reponses
        return false;
    }

    /**
     * Supprime une question de la BD
     *
     * @param id
     * @returns {boolean} true si succes
     */
    static remove(id) {
        // TODO delete seulement les reponses
        return false;
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
