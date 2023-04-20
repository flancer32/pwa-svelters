/**
 * Generate challenge upon existing user authentication.
 */
// MODULE'S IMPORTS
import {randomBytes} from 'node:crypto';

// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Svelters_Back_Web_Api_SignIn_Challenge {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Svelters_Shared_Web_Api_SignIn_Challenge} */
        const endpoint = spec['Svelters_Shared_Web_Api_SignIn_Challenge$'];
        /** @type {Svelters_Back_Util_Codec.bin2b64Url|function} */
        const bin2b64Url = spec['Svelters_Back_Util_Codec.bin2b64Url'];
        /** @type {Svelters_Back_Listen_Trans_Z_Store} */
        const zStore = spec['Svelters_Back_Listen_Trans_Z_Store$'];


        // VARS
        logger.setNamespace(this.constructor.name);

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         *
         * @param {Svelters_Shared_Web_Api_SignIn_Challenge.Request|Object} req
         * @param {Svelters_Shared_Web_Api_SignIn_Challenge.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            try {
                // get and normalize input data
                const userName = req.userName;
                // generate or select data for sign in challenge
                const challenge = bin2b64Url(randomBytes(32));
                // get user data from internal store
                const dto = zStore.get(userName);
                res.attestationId = dto.attestationId;
                res.challenge = challenge;
                // replace sign up challenge with sign in challenge in the storage
                dto.challenge = challenge;
                zStore.put(dto);
                console.log(`Authentication challenge '${challenge}' for user '${userName}' is created (attestation id: ${dto.attestationId}).`);
                logger.info(`${this.constructor.name}: ${JSON.stringify(res)}'.`);
            } catch (error) {
                logger.error(error);
            }
        };
    }


}
