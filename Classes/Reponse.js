/**
 * Une Reponse
 */
class Reponse {

    /**
     *
     * @param idReponse
     * @param libelle
     * @param estLaReponse
     * @param idQuestion
     */
    constructor(idReponse, libelle, estLaReponse, idQuestion) {

        this._idReponse = idReponse;
        this._libelle = libelle;
        this._estLaReponse = estLaReponse;
        this._idQuestion = idQuestion;
    }

    // ------------------------------------------------------------------------------
    // Fonctions de mapping avec la BDD
    // ------------------------------------------------------------------------------

    /**
     * Crée une réponse en BD et met à jour son id
     *
     * @returns {boolean} true si succes
     */
    createInDB() {
        // Todo
        return false;
    }

    /**
     * Récupère une réponse via son id
     *
     * @param id
     * @returns {Etudiant}
     */
    static getById(id) {
        // Todo
        return null;
    }

    /**
     * Met à jour la réponse en BD
     *
     * @returns {boolean} true si succes
     */
    updateInDB() {
        // Todo
        return false;
    }

    /**
     * Supprime une réponse de la BD
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

    get idReponse() {
        return this._idReponse;
    }

    set idReponse(value) {
        this._idReponse = value;
    }

    get libelle() {
        return this._libelle;
    }

    set libelle(value) {
        this._libelle = value;
    }

    get estLaReponse() {
        return this._estLaReponse;
    }

    set estLaReponse(value) {
        this._estLaReponse = value;
    }

    get idQuestion() {
        return this._idQuestion;
    }

    set idQuestion(value) {
        this._idQuestion = value;
    }
}

if (typeof window === 'undefined') {
    // Coté serveur
    module.exports = Reponse;
}
