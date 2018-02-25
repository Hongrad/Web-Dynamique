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
    constructor(motDePasse, questions, idProfesseur) {
        this._idQuestionnaire = -1;
        this._pid = Questionnaire.generatePid();
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

    static generatePid(){
        return Math.round(Math.random() * 10000000000); // Todo : creer une vraie valeur aléatoire
    }

    // ------------------------------------------------------------------------------
    // Fonctions de mapping avec la BDD
    // ------------------------------------------------------------------------------

    /**
     * Crée un questionnaire en BD et met à jour son id
     *
     * @param db
     * @returns {boolean} true si succes
     */
    createInDB(db) {
      db.query("INSERT INTO questionnaire (pid,motDePasse,questions,idProfesseur) VALUES (?,?,?,?)", [this._pid,this._motDePasse,this._questions,this._idProfesseur], function (err, result) {
          if (err) throw err;
          console.log(result);
      });
    }

    /**
     * Récupère un questionnaire via son id
     *
     * @param db
     * @param id
     * @returns {Etudiant}
     */
    static getById(db, id, callback) {
      db.query("SELECT * FROM questionnaire WHERE idQuestionnaire=?", [id], function (err, result) {
          if (err) throw err;

          var questionnaire = null;

          if (result.length > 0){
              questionnaire = new Questionnaire(result[0].motDePasse, JSON.parse(result[0].questions), result[0].idProfesseur);
              questionnaire.idQuestionnaire = result[0].idQuestion;
          }

          return callback(questionnaire);
      });
    }

    /**
     * Met à jour le questionnaire en BD
     *
     * @returns {boolean} true si succes
     */
    updateInDB() {
        // TODO seulement pour les questions
        return false;
    }

    /**
     * Supprime un questionnaire de la BD
     *
     * @param id
     * @returns {boolean} true si succes
     */
    static remove(id) {
        // TODO seulement pour les questions
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
