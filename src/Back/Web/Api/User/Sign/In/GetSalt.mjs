/**
 * Get password salt.
 */
// MODULE'S CLASSES

/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Svelters_Back_Web_Api_User_Sign_In_GetSalt {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Core_Shared_Util_Codec.binToHex|function} */
        const binToHex = spec['TeqFw_Core_Shared_Util_Codec.binToHex'];
        /** @type {Svelters_Shared_Web_Api_User_Sign_In_GetSalt} */
        const endpoint = spec['Svelters_Shared_Web_Api_User_Sign_In_GetSalt$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
        /** @type {Fl32_Auth_Back_RDb_Schema_Password} */
        const rdbPass = spec['Fl32_Auth_Back_RDb_Schema_Password$'];
        /** @type {Svelters_Back_Act_User_Read.act|function} */
        const actUserRead = spec['Svelters_Back_Act_User_Read$'];

        // VARS
        logger.setNamespace(this.constructor.name);

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Svelters_Shared_Web_Api_User_Sign_In_GetSalt.Request|Object} req
         * @param {Svelters_Shared_Web_Api_User_Sign_In_GetSalt.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            // FUNCS
            async function readPasswordSalt(trx, userBid) {
                /** @type {Fl32_Auth_Back_RDb_Schema_Password.Dto} */
                const found = await crud.readOne(trx, rdbPass, userBid);
                return (found?.salt) ? binToHex(found.salt) : null;
            }

            // MAIN
            const trx = await conn.startTransaction();
            try {
                // get and normalize input data
                const email = req.email.trim().toLowerCase();
                //
                const {
                    /** @type {Svelters_Back_RDb_Schema_User.Dto} */
                    user
                } = await actUserRead({trx, email});
                res.salt = await readPasswordSalt(trx, user?.bid);
                await trx.commit();
                logger.info(`${this.constructor.name}: ${JSON.stringify(res)}'.`);
            } catch (error) {
                logger.error(error);
                await trx.rollback();
            }
        };
    }


}
