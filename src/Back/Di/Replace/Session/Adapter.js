/**
 * Implementation of the session plugin adapter interface for the application.
 *
 * @implements Fl64_Web_Session_Back_Api_Adapter
 */
export default class Svelters_Back_Di_Replace_Session_Adapter {
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper
     * @param {Svelters_Back_Store_RDb_Repo_User} repoUser
     * @param {Svelters_Back_Dto_SessionData} dtoSessionData
     * @param {typeof Svelters_Shared_Enum_User_State} STATE
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Svelters_Back_Store_RDb_Repo_User$: repoUser,
            Svelters_Back_Dto_SessionData$: dtoSessionData,
            Svelters_Shared_Enum_User_State$: STATE,
        }
    ) {
        /* eslint-enable jsdoc/require-param-description */
        /**
         * Retrieves and processes user data for session purposes.
         *
         * @param {object} params - Parameters object.
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx] - Database transaction instance.
         * @param {number} params.userId - Identifier of the user whose data is being accessed.
         * @return {Promise<{data:object, allowed:boolean, redirectUri:string}>} Resolves with a user data object.
         */
        this.retrieveUserData = async function ({trx: trxOuter, userId}) {
            let data = null, allowed = false, redirectUri = undefined;
            await trxWrapper.execute(trxOuter, async (trx) => {
                // Fetch the user details
                const {record: user} = await repoUser.readOne({trx, key: userId});
                if (user) {
                    data = dtoSessionData.createDto();
                    data.user = user;
                    allowed = user.state === STATE.ACTIVE;
                    if (!allowed) {
                        redirectUri = DEF.URI_403;
                        logger.info(`User #${userId} is not allowed to access the application.`);
                    }
                } else {
                    logger.error(`Cannot fetch user data for user ID: ${userId}`);
                }
            });
            return {data, allowed, redirectUri};
        };

    }
}
