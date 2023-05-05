/**
 * Validate user authentication with WebAuthn API.
 */
// MODULE'S CLASSES

/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Svelters_Back_Web_Api_User_Sign_In_Validate {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Svelters_Shared_Web_Api_User_Sign_In_Validate} */
        const endpoint = spec['Svelters_Shared_Web_Api_User_Sign_In_Validate$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {Fl32_Auth_Back_Act_Assert_Validate.act|function} */
        const actValid = spec['Fl32_Auth_Back_Act_Assert_Validate$'];

        // VARS
        logger.setNamespace(this.constructor.name);

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Svelters_Shared_Web_Api_User_Sign_In_Validate.Request|Object} req
         * @param {Svelters_Shared_Web_Api_User_Sign_In_Validate.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            const trx = await conn.startTransaction();
            try {
                // get and normalize input data
                const assertion = req.assert;
                //
                const {
                    /** @type {Fl32_Auth_Back_RDb_Schema_Attest.Dto} */
                    attestation,
                    success
                } = await actValid({trx, assertion});
                res.success = success;
                await trx.commit();
                logger.info(`${this.constructor.name}: ${JSON.stringify(res)}'.`);
            } catch (error) {
                logger.error(error);
                await trx.rollback();
            }
        };
    }


}
