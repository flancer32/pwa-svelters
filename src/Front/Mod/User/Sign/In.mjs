/**
 * Model to handle events related to users authentication.
 * @namespace Svelters_Front_Mod_User_Sign_In
 */
export default class Svelters_Front_Mod_User_Sign_In {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Svelters_Front_Util_Codec.binToB64Url|function} */
        const binToB64Url = spec['Svelters_Front_Util_Codec.binToB64Url'];
        /** @type {TeqFw_Web_Api_Front_Web_Connect} */
        const connApi = spec['TeqFw_Web_Api_Front_Web_Connect$'];
        /** @type {Svelters_Shared_Web_Api_User_Sign_In_Challenge} */
        const apiChallenge = spec['Svelters_Shared_Web_Api_User_Sign_In_Challenge$'];
        /** @type {Svelters_Shared_Web_Api_User_Sign_In_Validate} */
        const apiValidate = spec['Svelters_Shared_Web_Api_User_Sign_In_Validate$'];

        // MAIN
        logger.setNamespace(this.constructor.name);

        // FUNCS

        // INSTANCE METHODS
        /**
         * Request backend to generate new challenge for user authentication.
         * @param {string} attestationId
         * @returns {Promise<Svelters_Shared_Web_Api_User_Sign_In_Challenge.Response>}
         */
        this.getChallenge = async function (attestationId) {
            try {
                const req = apiChallenge.createReq();
                req.attestationId = attestationId;
                // noinspection JSValidateTypes
                return await connApi.send(req, apiChallenge);
            } catch (e) {
                // timeout or error
                logger.error(`Cannot get challenge for user sign in from backend. Error: ${e?.message}`);
            }
            return null;
        };

        /**
         * Validate user authentication on the back using store public key.
         * @param {AuthenticatorAssertionResponse} resp
         * @returns {Promise<Svelters_Shared_Web_Api_User_Sign_In_Validate.Response>}
         */
        this.validate = async function (resp) {
            try {
                const req = apiValidate.createReq();
                req.authenticatorData = binToB64Url(resp.authenticatorData);
                req.clientDataJSON = binToB64Url(resp.clientDataJSON);
                req.signature = binToB64Url(resp.signature);
                // noinspection JSValidateTypes
                return await connApi.send(req, apiValidate);
            } catch (e) {
                // timeout or error
                logger.error(`Cannot get challenge for user sign in from backend. Error: ${e?.message}`);
            }
            return null;
        };
    }
}
