/**
 * Service to generate sign up challenge for Web Authentication.
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Svelters_Back_Web_Api_SignUp_Challenge {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Svelters_Shared_Web_Api_SignUp_Challenge} */
        const endpoint = spec['Svelters_Shared_Web_Api_SignUp_Challenge$'];

        // VARS
        logger.setNamespace(this.constructor.name);

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () {
            logger.info(`Service is initialized...`);
        };
        /**
         *
         * @param {Svelters_Shared_Web_Api_SignUp_Challenge.Request} req
         * @param {Svelters_Shared_Web_Api_SignUp_Challenge.Response} res
         * @returns {Promise<void>}
         */
        this.process = async function (req, res) {
            logger.info(`service is processed a request.`);
            res.challenge = 'boobs';
        };
    }


}
