/**
 * Validate uniqueness for given type of data on backend.
 */
// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Svelters_Back_Web_Api_Data_Unique {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {Svelters_Shared_Web_Api_Data_Unique} endpoint
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Svelters_Back_RDb_Schema_User} rdbUser
     * @param {typeof Svelters_Shared_Enum_Data_Type_Unique} TYPE
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Svelters_Shared_Web_Api_Data_Unique$: endpoint,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Svelters_Back_RDb_Schema_User$: rdbUser,
            Svelters_Shared_Enum_Data_Type_Unique$: TYPE,
        }) {
        // VARS
        logger.setNamespace(this.constructor.name);
        const A_USER = rdbUser.getAttributes();

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Svelters_Shared_Web_Api_Data_Unique.Request|Object} req
         * @param {Svelters_Shared_Web_Api_Data_Unique.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            // FUNCS

            async function uniqueEmail(trx, value) {
                const key = value.trim().toLowerCase();
                const found = await crud.readOne(trx, rdbUser, {[A_USER.EMAIL]: key});
                return !Boolean(found);
            }

            // MAIN
            const trx = await conn.startTransaction();
            try {
                // get and normalize input data
                const value = req.value;
                const type = req.type;
                //
                if (type === TYPE.EMAIL) res.isUnique = await uniqueEmail(trx, value);

                await trx.commit();
                logger.info(`${this.constructor.name}: ${JSON.stringify(res)}'.`);
            } catch (error) {
                logger.error(error);
                await trx.rollback();
            }
        };
    }


}
