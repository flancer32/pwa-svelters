/**
 * Model to handle events related to users registration.
 * @namespace Svelters_Front_Mod_User_Sign_Up
 */
export default class Svelters_Front_Mod_User_Sign_Up {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Web_Api_Front_Web_Connect} */
        const connApi = spec['TeqFw_Web_Api_Front_Web_Connect$'];
        /** @type {Svelters_Shared_Web_Api_User_Sign_Up_Register} */
        const apiRegister = spec['Svelters_Shared_Web_Api_User_Sign_Up_Register$'];
        /** @type {Svelters_Front_Util_WebAuthn.isPublicKeyAvailable|function} */
        const isPublicKeyAvailable = spec['Svelters_Front_Util_WebAuthn.isPublicKeyAvailable'];

        // MAIN
        logger.setNamespace(this.constructor.name);

        // FUNCS

        // INSTANCE METHODS
        /**
         * Register new user on backend and get data to attest new user on the current device.
         * @param {number} age
         * @param {string} email
         * @param {number} height
         * @param {string} name
         * @returns {Promise<Svelters_Shared_Web_Api_User_Sign_Up_Register.Response>}
         */
        this.register = async function (age, email, height, name) {
            try {
                const req = apiRegister.createReq();
                req.age = age;
                req.email = email;
                req.height = height;
                req.name = name;
                req.useWebAuthn = await isPublicKeyAvailable();
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
