import {randomUUID} from 'node:crypto';

/**
 * Action that creates a new user profile.
 * It initializes the profile with default values and stores it in the database.
 *
 * @implements {TeqFw_Core_Shared_Api_Action}
 */
export default class Svelters_Back_Act_User_Create {
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
        /**
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @return {Promise<string>}
         */
        async function generateUniqueUUID(trx) {
            let uuid;
            let isUnique = false;
            while (!isUnique) {
                uuid = randomUUID();
                const {record} = await repoUser.readOne({trx, key: {[A_USER.UUID]: uuid}});
                isUnique = !record;
            }
            return uuid;
        }

        // MAIN

        /**
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @returns {Promise<{user: Svelters_Back_Store_RDb_Schema_User.Dto}>}
         */
        this.run = async function ({trx: trxOuter} = {}) {
            return await trxWrapper.execute(trxOuter, async (trx) => {
                logger.info(`Initializing record for new user.`);
                const week = new Date();
                week.setDate(week.getDate() + DAYS_AFTER);
                const dto = repoUser.createDto();
                dto.date_created = new Date();
                dto.date_subscription = week;
                dto.uuid = await generateUniqueUUID(trx);
                const {primaryKey: key} = await repoUser.createOne({trx, dto});
                const userId = key[A_USER.ID];
                logger.info(`Record for user #${userId} has been created.`);
                const {record: user} = await repoUser.readOne({trx, key});
                return {user};
            });

        };
    }
}
