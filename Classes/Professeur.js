const Client = require('./Client');

/**
 * Un Professeur
 */
module.exports = class Professeur extends Client {

    /**
     *
     * @param idProfesseur
     * @param nom
     * @param prenom
     * @param nomDeCompte
     * @param motDePasse
     * @param moduleA
     */
    constructor(idProfesseur, nom, prenom, nomDeCompte, motDePasse, moduleA) {
        super(null);

        this._idProfesseur = idProfesseur;
        this._nom = nom;
        this._prenom = prenom;
        this._nomDeCompte = nomDeCompte;
        this._motDePasse = motDePasse;
        this._moduleA = moduleA;
    }

    // ------------------------------------------------------------------------------
    // Fonctions de mapping avec la BDD
    // ------------------------------------------------------------------------------

    /**
     * Crée un professeur en BD et met à jour son id
     *
     * @returns {boolean} true si succes
     */
    createInDB() {
        // Todo
        return false;
    }

    /**
     * Récupère un professeur via son id
     *
     * @param id
     * @returns {Etudiant}
     */
    static getById(id) {
        // Todo
        return null;
    }

    /**
     * Met à jour le professeur en BD
     *
     * @returns {boolean} true si succes
     */
    updateInDB() {
        // Todo
        return false;
    }

    /**
     * Supprime un professeur de la BD
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

    get idProfesseur() {
        return this._idProfesseur;
    }

    set idProfesseur(value) {
        this._idProfesseur = value;
    }

    get nom() {
        return this._nom;
    }

    set nom(value) {
        this._nom = value;
    }

    get prenom() {
        return this._prenom;
    }

    set prenom(value) {
        this._prenom = value;
    }

    get nomDeCompte() {
        return this._nomDeCompte;
    }

    set nomDeCompte(value) {
        this._nomDeCompte = value;
    }

    get motDePasse() {
        return this._motDePasse;
    }

    set motDePasse(value) {
        this._motDePasse = value;
    }

    get moduleA() {
        return this._moduleA;
    }

    set moduleA(value) {
        this._moduleA = value;
    }
}
