/**
 * Action that load information about user subscription.
 * TODO: this action should load subscription info for authenticated user.
 *
 * @implements {TeqFw_Core_Shared_Api_Action}
 */
export default class Svelters_Back_Act_User_Subscription_Info {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper
     * @param {Svelters_Back_Store_RDb_Repo_User} repoUser
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Svelters_Back_Store_RDb_Repo_User$: repoUser,
        }
    ) {
        // VARS
        const A_USER = repoUser.getSchema().getAttributes();
        const DAYS_AFTER = 7; // Default subscription period (7 days from the current date)

        // FUNCS


        // MAIN

        /**
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {number} [params.userId]
         * @returns {Promise<{user: Svelters_Back_Store_RDb_Schema_User.Dto}>}
         */
        this.run = async function ({trx: trxOuter, userId} = {}) {
            return await trxWrapper.execute(trxOuter, async (trx) => {

            });

        };
    }
}
