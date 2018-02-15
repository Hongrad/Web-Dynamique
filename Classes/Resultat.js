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
     * @returns {boolean} true si succes
     */
    createInDB() {
        // Todo
        return false;
    }

    /**
     * Récupère un resultat via son id
     *
     * @param id
     * @returns {Etudiant}
     */
    static getById(id) {
        // Todo
        return null;
    }

    getByQuestionnaireId(idQuestionnaire) {
        //TODO retourne tout les résultat pour un questionnaire spécifique
    }

    getByEtudiantId(idEtudiant) {
        //TODO retourne tout les résultat pour un étudiant spécifique
    }

    getByQuestionId(idQuestion) {
        //TODO retourne tout les résultat pour une question spécifique
    }

    /**
     * Met à jour le resultat en BD
     *
     * @returns {boolean} true si succes
     */
    updateInDB() {
        // Todo
        return false;
    }

    /**
     * Supprime un resultat de la BD
     *
     * @param id
     * @returns {boolean} true si succes
     */
    static remove(id) {
        // Todo
        return false;
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
