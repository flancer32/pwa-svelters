/**
 * Model to handle events related to users registration.
 * @namespace Svelters_Front_Mod_User_Sign_Up
 */
export default class Svelters_Front_Mod_User_Sign_Up {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Svelters_Front_Util_Codec.binToB64Url|function} */
        const binToB64Url = spec['Svelters_Front_Util_Codec.binToB64Url'];
        /** @type {TeqFw_Web_Api_Front_Web_Connect} */
        const connApi = spec['TeqFw_Web_Api_Front_Web_Connect$'];
        /** @type {Svelters_Shared_Web_Api_Sign_Up_Register} */
        const apiRegister = spec['Svelters_Shared_Web_Api_Sign_Up_Register$'];

        // MAIN
        logger.setNamespace(this.constructor.name);

        // FUNCS

        // INSTANCE METHODS
        /**
         * Register new `email` on backend.
         * @param {string} email
         * @returns {Promise<Svelters_Shared_Web_Api_Sign_Up_Register.Response>}
         */
        this.registerEmail = async function (email) {
            try {
                const req = apiRegister.createReq();
                req.email = email;
                // noinspection JSValidateTypes
                return await connApi.send(req, apiRegister);
            } catch (e) {
                // timeout or error
                logger.error(`Cannot register attestation for a new user on the backend. Error: ${e?.message}`);
            }
            return null;
        };

    }
}
