/**
 * Un Client
 */
module.exports = class Client {

    /**
     *
     * @param socket
     */
    constructor(socket) {
        this._socket = socket;
    }

    // ------------------------------------------------------------------------------
    // Getter / Setter
    // ------------------------------------------------------------------------------

    get socket() {
        return this._socket;
    }

    set socket(value) {
        this._socket = value;
    }
}
