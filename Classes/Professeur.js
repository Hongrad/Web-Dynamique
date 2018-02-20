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
    constructor(nom, prenom, nomDeCompte, motDePasse, moduleA) {
        super(null);

        this._idProfesseur = -1;
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
     * @param db
     * @returns {boolean} true si succes
     */
    createInDB(db) {
      db.query("INSERT INTO professeur (nom,prenom,nomDeCompte,motDePasse,module) VALUES (?,?,?,?,?)", [this._nom,this._prenom,this._nomDeCompte,this._motDePasse,this._moduleA], function (err, result) {
          if (err) throw err;
          console.log(result);
      });
    }

    /**
     * Récupère un professeur via son id
     *
     * @param db
     * @param id
     * @returns {Etudiant}
     */
    static getById(db,id) {
      db.query("SELECT * FROM professeur WHERE idProfesseur=?", [id], function (err, result) {
          if (err) throw err;
          //TODO voir getById Etudiant
      });
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
