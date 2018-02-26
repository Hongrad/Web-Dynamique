const Client = require('./Client');

/**
 * Un Etudiant
 */
module.exports = class Etudiant extends Client {

    /**
     * @param nom
     */
    constructor(nom) {
        super(null);

        this._idEtudiant = -1;
        this._nom = nom;
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

    get nom() {
        return this._nom;
    }

    set nom(value) {
        this._nom = value;
    }
}
