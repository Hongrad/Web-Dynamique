const Client = require('./Client');

/**
 * Un Etudiant
 */
module.exports = class Etudiant extends Client {

    /**
     *
     * @param idEtudiant
     * @param nom
     * @param prenom
     */
    constructor(nom, prenom) {
        super(null);

        this._idEtudiant = -1;
        this._nom = nom;
        this._prenom = prenom;
    }

    // ------------------------------------------------------------------------------
    // Fonctions de mapping avec la BDD
    // ------------------------------------------------------------------------------

    /**
     * Crée un etudiant en BD et met à jour son id
     *
     * @param db
     * @returns {boolean} true si succes
     */
    createInDB(db) {
        db.query("INSERT INTO etudiant (nom,prenom) VALUES (?,?)", [this._nom,this._prenom], function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    }

    /**
     * Récupère un étudiant via son id
     *
     * @param db
     * @param id
     * @returns {Etudiant}
     */
    getById(db,id) {
      db.query("SELECT * FROM etudiant WHERE idEtudiant=?", [id], function (err, result) {
          if (err) throw err;
          /*this._idEtudiant = result[0]['idEtudiant'];
          this._nom = result[0]['nom'];
          this._prenom = result[0]['prenom'];
          console.log(this);*/ //TODO voir comment on souhaite faire pour les etudiants quand on getById on modifie le this ou pas ?
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
}
