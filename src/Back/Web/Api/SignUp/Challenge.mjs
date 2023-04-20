/**
 * Generate sign up challenge before new user registration.
 */
// MODULE'S IMPORTS
import {randomBytes, randomUUID} from 'node:crypto';

// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Svelters_Back_Web_Api_SignUp_Challenge {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Svelters_Shared_Web_Api_SignUp_Challenge} */
        const endpoint = spec['Svelters_Shared_Web_Api_SignUp_Challenge$'];
        /** @type {Svelters_Back_Util_Codec.bin2b64Url|function} */
        const bin2b64Url = spec['Svelters_Back_Util_Codec.bin2b64Url'];
        /** @type {Svelters_Back_Listen_Trans_Z_Store} */
        const zStore = spec['Svelters_Back_Listen_Trans_Z_Store$'];
        /** @type {Svelters_Back_Listen_Trans_Z_Dto} */
        const zDto = spec['Svelters_Back_Listen_Trans_Z_Dto$'];


        // VARS
        logger.setNamespace(this.constructor.name);

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         *
         * @param {Svelters_Shared_Web_Api_SignUp_Challenge.Request|Object} req
         * @param {Svelters_Shared_Web_Api_SignUp_Challenge.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            try {
                // get and normalize input data
                const userName = req.userName;
                // generate or select data for sign up challenge
                const challenge = bin2b64Url(randomBytes(32));
                const userUuid = randomUUID();
                // compose DTO with challenge data to store internally
                const dto = zDto.createDto();
                dto.challenge = challenge;
                dto.userName = userName;
                dto.userUuid = userUuid;
                zStore.put(dto);
                // compose response
                res.challenge = challenge;
                res.relyingPartyName = 'Svelters PWA';
                res.userName = userName;
                res.userUuid = userUuid;
                logger.info(`new challenge is created: '${challenge}' to sign up new user '${userName}' (uuid: ${userUuid}).`);
                logger.info(`${this.constructor.name}: ${JSON.stringify(res)}'.`);
            } catch (error) {
                logger.error(error);
            }
        };
    }


}
