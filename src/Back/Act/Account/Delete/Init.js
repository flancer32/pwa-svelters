/**
 * Handles the initialization of a user account deletion request.
 *
 * This action sets the user's state to `DELETING`, removes all of their active sessions (both in-memory and in-database),
 * and sends a confirmation email notifying the user that the deletion process has started.
 *
 * Once invoked, the user loses access to their account immediately.
 * The account and associated data will be permanently deleted after a scheduled delay (e.g., 7 days), handled elsewhere.
 *
 * @implements {TeqFw_Core_Shared_Api_Action}
 */
export default class Svelters_Back_Act_Account_Delete_Init {
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper
     * @param {TeqFw_Db_Shared_Dto_List_Selection} dbSelect
     * @param {Fl64_Web_Session_Back_Store_RDb_Repo_Session} repoSession
     * @param {Svelters_Back_Store_RDb_Repo_User} repoUser
     * @param {Svelters_Back_Store_RDb_Repo_User_Delete} repoDelete
     * @param {Fl64_Web_Session_Back_Store_Mem_Session} memSession
     * @param {Svelters_Back_Email_Account_Delete_Init} emailInit
     * @param {typeof Svelters_Shared_Enum_User_State} STATE
     * @param {typeof Svelters_Shared_Enum_User_Delete_State} DELETE
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            TeqFw_Db_Shared_Dto_List_Selection$: dbSelect,
            Fl64_Web_Session_Back_Store_RDb_Repo_Session$: repoSession,
            Svelters_Back_Store_RDb_Repo_User$: repoUser,
            Svelters_Back_Store_RDb_Repo_User_Delete$: repoDelete,
            Fl64_Web_Session_Back_Store_Mem_Session$: memSession,
            Svelters_Back_Email_Account_Delete_Init$: emailInit,
            Svelters_Shared_Enum_User_State$: STATE,
            Svelters_Shared_Enum_User_Delete_State$: DELETE,
        }
    ) {
        /* eslint-enable jsdoc/require-param-description,jsdoc/check-param-names */
        // VARS
        const FUNC = dbSelect.getFunctions();
        const A_SESS = repoSession.getSchema().getAttributes();

        // MAIN

        /**
         * @param {object} [params={}] - Optional parameters.
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx] - External transaction (if provided).
         * @param {number} params.userId - Identifier of the user whose account is being deleted.
         * @param {string} params.emailTmpl - Email template to use for the confirmation email (`/account/delete/init/cli`).
         * @returns {Promise<{ok: boolean}>}
         */
        this.run = async function ({trx: trxOuter, userId, emailTmpl} = {}) {
            return await trxWrapper.execute(trxOuter, async (trx) => {
                logger.info(`Processing account deletion request for user #${userId}.`);
                // check if the user is already being deleted 
                const {record: foundUser} = await repoUser.readOne({trx, key: userId});
                if (foundUser?.state === STATE.DELETING) {
                    logger.info(`User #${userId} is already being deleted.`);
                    return {ok: false};
                } else if (foundUser) {
                    // set the state for the user  
                    foundUser.state = STATE.DELETING;
                    await repoUser.updateOne({trx, updates: foundUser});
                    // get all sessions for the user and delete them
                    const selection = dbSelect.createDto({
                        filter: {
                            name: FUNC.EQ,
                            params: [{alias: A_SESS.USER_REF}, {value: userId}],
                        }
                    });
                    const {records} = await repoSession.readMany({trx, selection});
                    for (const record of records) {
                        memSession.delete({key: record[A_SESS.UUID]});
                        await repoSession.deleteOne({trx, key: record[A_SESS.ID]});
                        logger.info(`Session #${record[A_SESS.ID]} has been deleted.`);
                    }
                    await emailInit.perform({trx, userId, emailTmpl});
                    // register the deletion process
                    const {record: foundDelete} = await repoDelete.readOne({trx, key: userId});
                    if (!foundDelete) {
                        const dto = repoDelete.createDto();
                        dto.date_created = new Date();
                        dto.date_updated = new Date();
                        dto.state = DELETE.ACTIVE;
                        dto.user_ref = userId;
                        await repoDelete.createOne({trx, dto});
                        logger.info(`User #${userId} has been registered for account deletion.`);
                    }
                    return {ok: true};
                }
                return {ok: false};
            });
        };

    }
}
