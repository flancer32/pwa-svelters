/**
 * Model to handle events related to users authentication.
 * @namespace Svelters_Front_Mod_User_Sign_In
 */
export default class Svelters_Front_Mod_User_Sign_In {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Fl32_Auth_Front_Util_Codec.binToB64Url|function} */
        const binToB64Url = spec['Fl32_Auth_Front_Util_Codec.binToB64Url'];
        /** @type {TeqFw_Web_Api_Front_Web_Connect} */
        const connApi = spec['TeqFw_Web_Api_Front_Web_Connect$'];
        /** @type {Svelters_Shared_Web_Api_User_Sign_In_GetSalt} */
        const apiGetSalt = spec['Svelters_Shared_Web_Api_User_Sign_In_GetSalt$'];
        /** @type {Svelters_Shared_Web_Api_User_Sign_In_Validate} */
        const apiValidate = spec['Svelters_Shared_Web_Api_User_Sign_In_Validate$'];
        /** @type {Fl32_Auth_Shared_Dto_Assert} */
        const dtoAssert = spec['Fl32_Auth_Shared_Dto_Assert$'];

        // MAIN
        logger.setNamespace(this.constructor.name);

        // FUNCS

        // INSTANCE METHODS
        /**
         * Get password salt (HEX string) for the user.
         * @param {string} email
         * @return {Promise<string>}
         */
        this.getPasswordSalt = async function (email) {
            try {
                const req = apiGetSalt.createReq();
                req.email = email;
                // noinspection JSValidateTypes
                /** @type {Svelters_Shared_Web_Api_User_Sign_In_GetSalt.Response} */
                const res = await connApi.send(req, apiGetSalt);
                return res?.salt;
            } catch (e) {
                // timeout or error
                logger.error(`Cannot get password salt for current user. Error: ${e?.message}`);
            }
            return null;
        };

        this.validatePassword = async function (email, hash) {
            try {
                const req = apiValidate.createReq();
                req.email = email;
                req.passwordHash = hash;
                // noinspection JSValidateTypes
                return await connApi.send(req, apiValidate);
            } catch (e) {
                // timeout or error
                logger.error(`Cannot validate password on backend. Error: ${e?.message}`);
            }
            return null;
        };

        /**
         * Validate user authentication on the back using store public key.
         * @param {AuthenticatorAssertionResponse} resp
         * @returns {Promise<Svelters_Shared_Web_Api_User_Sign_In_Validate.Response>}
         */
        this.validatePubKey = async function (resp) {
            try {
                const req = apiValidate.createReq();
                req.assert = dtoAssert.createDto();
                req.assert.authenticatorData = binToB64Url(resp.authenticatorData);
                req.assert.clientData = binToB64Url(resp.clientDataJSON);
                req.assert.signature = binToB64Url(resp.signature);
                req.assert.userHandle = binToB64Url(resp.userHandle);
                // noinspection JSValidateTypes
                return await connApi.send(req, apiValidate);
            } catch (e) {
                // timeout or error
                logger.error(`Cannot get validate public key assertion on backend. Error: ${e?.message}`);
            }
            return null;
        };
    }
}
