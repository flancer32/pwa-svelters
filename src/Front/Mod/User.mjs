/**
 * Model to handle events related to users registration.
 * @namespace Svelters_Front_Mod_User
 */
export default class Svelters_Front_Mod_User {
    constructor(spec) {
        // DEPS
        /** @type {Svelters_Front_Defaults} */
        const DEF = spec['Svelters_Front_Defaults$'];
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Web_Api_Front_Web_Connect} */
        const connApi = spec['TeqFw_Web_Api_Front_Web_Connect$'];
        /** @type {Svelters_Shared_Web_Api_User_Sign_Up} */
        const apiRegister = spec['Svelters_Shared_Web_Api_User_Sign_Up$'];
        /** @type {Fl32_Auth_Front_Mod_PubKey} */
        const modPubKey = spec['Fl32_Auth_Front_Mod_PubKey$'];
        /** @type {Fl32_Auth_Front_Mod_Password} */
        const modPass = spec['Fl32_Auth_Front_Mod_Password$'];

        // MAIN
        logger.setNamespace(this.constructor.name);

        // FUNCS

        // INSTANCE METHODS
        /**
         * Register new user on backend and get data to attest new user on the current device.
         * @param {Date} dob
         * @param {string} email
         * @param {number} height
         * @param {string} name
         * @param {string} [password] plain password, if missed PublicKey authentication will be requested
         * @returns {Promise<Svelters_Shared_Web_Api_User_Sign_Up.Response>}
         */
        this.signUp = async function ({dob, email, height, name, password}) {
            try {
                const req = apiRegister.createReq();
                req.dateBirth = dob;
                req.email = email;
                req.height = height;
                req.name = name;
                if (password) {
                    req.usePubKey = false;
                    req.passwordSalt = modPass.saltNew(DEF.SHARED.PASS_SALT_BYTES);
                    req.passwordHash = await modPass.hashCompose(password, req.passwordSalt);
                    logger.info(`New user with pwd auth. (salt: ${req.passwordSalt}; hash: ${req.passwordHash}).`);
                } else {
                    req.usePubKey = await modPubKey.isPublicKeyAvailable();
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
