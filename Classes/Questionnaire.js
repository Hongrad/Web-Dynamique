/**
 * Un Questionnaire
 */
class Questionnaire {

    /**
     *
     * @param idQuestionnaire
     * @param pid
     * @param motDePasse
     * @param questions
     * @param idProfesseur
     */
    constructor(idQuestionnaire, pid, motDePasse, questions, idProfesseur) {
        this._idQuestionnaire = idQuestionnaire;
        this._pid = pid;
        this._motDePasse = motDePasse;
        this._questions = questions;
        this._idProfesseur = idProfesseur;
    }

    /**
     * Ajoute une question au questionnaire
     *
     * @param idQuestion
     */
    addQuestion(idQuestion) {
        this.questions.push({numQuestion : ""+this.questions.length+"",idQuestion : ""+idQuestion+""});
    }

    generatePid() {
        this.pid = Math.floor(Math.random() * 100001);
    }

    // ------------------------------------------------------------------------------
    // Fonctions de mapping avec la BDD
    // ------------------------------------------------------------------------------

    /**
     * Crée un questionnaire en BD et met à jour son id
     *
     * @returns {boolean} true si succes
     */
    createInDB() {
        // Todo
        return false;
    }

    /**
     * Récupère un questionnaire via son id
     *
     * @param id
     * @returns {Etudiant}
     */
    static getById(id) {
        // Todo
        return null;
    }

    /**
     * Met à jour le questionnaire en BD
     *
     * @returns {boolean} true si succes
     */
    updateInDB() {
        // Todo
        return false;
    }

    /**
     * Supprime un questionnaire de la BD
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
