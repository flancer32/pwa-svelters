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
        /** @type {Fl32_Auth_Front_Mod_PubKey} */
        const modWebAuthn = spec['Fl32_Auth_Front_Mod_PubKey$'];
        /** @type {Fl32_Auth_Front_Mod_Password} */
        const modPass = spec['Fl32_Auth_Front_Mod_Password$'];

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
         * @param {string} [password] plain password, if missed PublicKey authentication will be requested
         * @returns {Promise<Svelters_Shared_Web_Api_User_Sign_Up_Register.Response>}
         */
        this.register = async function (age, email, height, name, password) {
            try {
                const req = apiRegister.createReq();
                req.age = age;
                req.email = email;
                req.height = height;
                req.name = name;
                if (password) {
                    req.useWebAuthn = false;
                    req.passwordSalt = modPass.salt(16);
                    req.passwordHash = await modPass.hash(password, req.passwordSalt);
                } else {
                    req.useWebAuthn = await modWebAuthn.isPublicKeyAvailable();
                }
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
