/**
 * Un Resultat
 */
module.exports = class Resultat {

    /**
     *
     * @param idEtudiant
     * @param idQuestionnaire
     * @param idQuestion
     * @param idReponse
     */
    constructor(idEtudiant, idQuestionnaire, idQuestion, idReponse) {
        this._idEtudiant = idEtudiant;
        this._idQuestionnaire = idQuestionnaire;
        this._idQuestion = idQuestion;
        this._idReponse = idReponse;
    }

    // ------------------------------------------------------------------------------
    // Fonctions de mapping avec la BDD
    // ------------------------------------------------------------------------------

    /**
     * Crée un resultat en BD et met à jour son id
     *
     * @param db
     * @returns {boolean} true si succes
     */
    createInDB() {
      db.query("INSERT INTO resultat (idEtudiant,idQuestionnaire,idQuestion,idReponse) VALUES (?,?,?,?)", [this._idEtudiant,this._idQuestionnaire,this._idQuestion,this._idReponse], function (err, result) {
          if (err) throw err;
          console.log(result);
      });
    }

    /**
    * Récupère un resultat via id Questionnaire
    *
    * @param db
    * @param id
    * @returns
     */
    getByQuestionnaireId(db,idQuestionnaire) {
      db.query("SELECT * FROM resultat WHERE idQuestionnaire=?", [idQuestionnaire], function (err, result) {
          if (err) throw err;
          //TODO voir getById Etudiant
      });
    }

    /**
    * Récupère un resultat via id etu x id Questionnaire
    *
    * @param db
    * @param id
    * @returns
     */
    getByEtudiantId(db,idQuestionnaire,idEtudiant) {
      db.query("SELECT * FROM resultat WHERE idQuestionnaire=? AND idEtudiant=?", [idQuestionnaire,idEtudiant], function (err, result) {
          if (err) throw err;
          //TODO voir getById Etudiant
      });
    }

    /**
    * Récupère un resultat via id question x id Questionnaire
    *
    * @param db
    * @param id
    * @returns
     */
    getByQuestionId(db,idQuestionnaire,idQuestion) {
      db.query("SELECT * FROM resultat WHERE idQuestionnaire=? AND idQuestion=?", [idQuestionnaire,idQuestion], function (err, result) {
          if (err) throw err;
          //TODO voir getById Etudiant
      });
    }

    // ------------------------------------------------------------------------------
    // Getter / Setter
    // ------------------------------------------------------------------------------

    get idEtudiant() {
        return this._idEtudiant;
    }

    set idEtudiant(value) {
        this._idEtudiant = value;
    }

    get idQuestionnaire() {
        return this._idQuestionnaire;
    }

    set idQuestionnaire(value) {
        this._idQuestionnaire = value;
    }

    get idQuestion() {
        return this._idQuestion;
    }

    set idQuestion(value) {
        this._idQuestion = value;
    }

    get idReponse() {
        return this._idReponse;
    }

    set idReponse(value) {
        this._idReponse = value;
    }
}
