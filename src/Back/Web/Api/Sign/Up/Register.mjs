/**
 * Generate sign up challenge before new user registration.
 */
// MODULE'S IMPORTS

// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Svelters_Back_Web_Api_Sign_Up_Register {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Svelters_Shared_Web_Api_Sign_Up_Register} */
        const endpoint = spec['Svelters_Shared_Web_Api_Sign_Up_Register$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
        /** @type {Svelters_Back_RDb_Schema_User_Id_Email} */
        const rdbIdEmail = spec['Svelters_Back_RDb_Schema_User_Id_Email$'];
        /** @type {Svelters_Back_RDb_Schema_User} */
        const rdbUser = spec['Svelters_Back_RDb_Schema_User$'];

        // VARS
        logger.setNamespace(this.constructor.name);
        const A_ID_EMAIL = rdbIdEmail.getAttributes();
        const A_USER = rdbUser.getAttributes();

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Svelters_Shared_Web_Api_Sign_Up_Register.Request|Object} req
         * @param {Svelters_Shared_Web_Api_Sign_Up_Register.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            const trx = await conn.startTransaction();
            try {
                // get and normalize input data
                const email = req.email;
                //
                const {[A_USER.BID]: bid} = await crud.create(trx, rdbUser);
                const dtoEmail = rdbIdEmail.createDto();
                dtoEmail.email = email.trim().toLowerCase();
                dtoEmail.user_ref = bid;
                await crud.create(trx, rdbIdEmail, dtoEmail);
                await trx.commit();
                res.success = Boolean(bid);
                logger.info(`${this.constructor.name}: ${JSON.stringify(res)}'.`);
            } catch (error) {
                logger.error(error);
                await trx.rollback();
            }
        };
    }


}
