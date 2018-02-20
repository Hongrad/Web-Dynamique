/**
 * Une Question
 */
class Question {

    /**
     *
     * @param idQuestion
     * @param libelle
     * @param multiple
     * @param reponses
     */
    constructor(idQuestion, libelle, multiple, reponses) {
        this._idQuestion = idQuestion;
        this._libelle = libelle;
        this._multiple = multiple;
        this._reponses = reponses;
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
     * @returns {boolean} true si succes
     */
    createInDB() {
        // Todo
        return false;
    }

    /**
     * Récupère une question via son id
     *
     * @param id
     * @returns {Etudiant}
     */
    static getById(id) {
        // Todo
        return null;
    }

    /**
     * Met à jour la question en BD
     *
     * @returns {boolean} true si succes
     */
    updateInDB() {
        // Todo
        return false;
    }

    /**
     * Supprime une question de la BD
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

    static get nbReponse() {
        return 4;
    }

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
