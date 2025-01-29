/**
 * Implementation of the UserDataProvider service.
 * This service is responsible for retrieving and processing user data
 * for session initialization or validation purposes.
 *
 * @implements Fl64_Web_Session_Back_Api_Service_UserDataProvider
 */
export default class Svelters_Back_Di_Replace_Session_Service_UserDataProvider {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger instance for logging events.
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper - Database transaction wrapper
     * @param {Svelters_Back_Store_RDb_Repo_User} repoUser - User repository
     * @param {Svelters_Back_Dto_SessionData} dtoSessionData
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Svelters_Back_Store_RDb_Repo_User$: repoUser,
            Svelters_Back_Dto_SessionData$: dtoSessionData,
        }
    ) {
        // VARS
        const ATTR_USER = repoUser.getSchema().getAttributes();

        // MAIN
        /**
         * @param {TeqFw_Db_Back_RDb_ITrans} trx - Database transaction instance.
         * @param {number} userId - Identifier of the user whose data is being accessed.
         * @return {Promise<Svelters_Back_Dto_SessionData.Dto|Object>} Resolves with an object containing session data.
         */
        this.perform = async function ({trx: trxOuter, userId}) {
            // FUNCS
            /**
             * @param {TeqFw_Db_Back_Api_RDb_Repository} repo
             * @param {Object} key
             * @param {TeqFw_Db_Back_RDb_ITrans} trx
             * @return {Promise<Object|null>}
             */
            async function fetchRecord(repo, key, trx) {
                const {record} = await repo.readOne({trx, key});
                return record || null;
            }

            // MAIN
            let data = null;
            await trxWrapper.execute(trxOuter, async (trx) => {
                // Fetch user details
                /** @type {Svelters_Back_Store_RDb_Schema_User.Dto} */
                const user = await fetchRecord(repoUser, {[ATTR_USER.ID]: userId}, trx);
                if (user) {
                    data = dtoSessionData.createDto();
                    data.user = user;
                } else {
                    logger.error(`Cannot fetch user data for user ID: ${userId}`);
                }
            });
            return {data};
        };
    }
}
