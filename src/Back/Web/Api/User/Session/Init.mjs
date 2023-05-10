/**
 * Initialize the session and fetch user data from the backend using the session ID stored in cookies.
 */
// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Svelters_Back_Web_Api_User_Session_Init {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Svelters_Shared_Web_Api_User_Session_Init} */
        const endpoint = spec['Svelters_Shared_Web_Api_User_Session_Init$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
        /** @type {Fl32_Auth_Back_RDb_Schema_Session} */
        const rdbSess = spec['Fl32_Auth_Back_RDb_Schema_Session$'];
        /** @type {Svelters_Back_RDb_Schema_User} */
        const rdbUser = spec['Svelters_Back_RDb_Schema_User$'];
        /** @type {Svelters_Shared_Dto_User} */
        const dtoUser = spec['Svelters_Shared_Dto_User$'];
        /** @type {Fl32_Auth_Back_Mod_Session_Store} */
        const modSessStore = spec['Fl32_Auth_Back_Mod_Session_Store$'];

        // VARS
        logger.setNamespace(this.constructor.name);

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Svelters_Shared_Web_Api_User_Session_Init.Request|Object} req
         * @param {Svelters_Shared_Web_Api_User_Session_Init.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            const trx = await conn.startTransaction();
            try {
                // load session data
                /** @type {Fl32_Auth_Back_RDb_Schema_Session.Dto} */
                const sessData = modSessStore.getData(context.request);
                // extract sessionId and read session data from RDb 
                const sessionId = sessData?.code;
                if (sessionId) {
                    /** @type {Fl32_Auth_Back_RDb_Schema_Session.Dto} */
                    const sessRec = await crud.readOne(trx, rdbSess, sessionId);
                    if (sessRec) {
                        // read related user and compose response data
                        /** @type {Svelters_Back_RDb_Schema_User.Dto} */
                        const userRec = await crud.readOne(trx, rdbUser, sessRec.user_ref);
                        const user = dtoUser.createDto();
                        user.uuid = userRec.uuid;
                        res.user = user;
                    }
                }
                await trx.commit();
                logger.info(`${this.constructor.name}: ${JSON.stringify(res)}'.`);
            } catch (error) {
                logger.error(error);
                await trx.rollback();
            }
        };
    }


}
