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
    constructor(libelle, estLaReponse, idQuestion) {
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
     * @param db
     * @returns {boolean} true si succes
     */
    createInDB(db,reponse) {
      return new Promise((resolve, reject) => {
        db.query("INSERT INTO reponse (libelle,estLaReponse,idQuestion) VALUES (?,?,?)", [reponse._libelle,reponse._estLaReponse,reponse._idQuestion], function (err, result) {
          if (err) {
              return reject(err);
            }
            else {
              resolve(result.insertId); //Tout c'est bien passé
            }
        });
      });
    }

    /**
     * Récupère une réponse via son id
     *
     * @param db
     * @param id
     * @returns {Etudiant}
     */
    static getById(db, id, callback) {
      db.query("SELECT * FROM reponse WHERE idReponse=?", [id], function (err, result) {
          if (err) throw err;

          var reponse = null;

          if (result.length > 0){
              reponse = new Reponse(result[0].idReponse, result[0].libelle, result[0].estLaReponse, result[0].idQuestion);
          }

          return callback(reponse);
      });
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
