/**
 * Action that creates a new user profile.
 * It initializes the profile with default values and stores it in the database.
 *
 * @implements {TeqFw_Core_Shared_Api_Action}
 */
export default class Svelters_Back_Act_User_Create {
    /**
     * @param {typeof import('node:crypto')} nodeCrypto
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper
     * @param {Svelters_Back_Store_RDb_Repo_User} repoUser
     */
    constructor(
        {
            'node:crypto': nodeCrypto,
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Svelters_Back_Store_RDb_Repo_User$: repoUser,
        }
    ) {
        // VARS
        const {randomUUID} = nodeCrypto;
        const A_USER = repoUser.getSchema().getAttributes();
        const DAYS_DEFAULT = DEF.SUBSCRIPTION_DAYS_DEFAULT;
        const MONTHS_PROMO = DEF.SUBSCRIPTION_MONTHS_PROMO;
        const USERS_MAX = DEF.SUBSCRIPTION_USERS_MAX;
        let ifPromoEnded = false;

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

        /**
         * Determines the subscription end date based on user count and promo status.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx - Database transaction object.
         * @returns {Promise<Date>} - The calculated subscription end date.
         */
        async function getSubscriptionEnd(trx) {
            let res = new Date(); // Start with the current date.

            // TODO: This approach is inefficient for large databases.
            // Consider using a query with `COUNT()` instead of fetching all records.
            const {records} = await repoUser.readMany({trx});

            if (ifPromoEnded) {
                // If the promo period has already ended, apply the default duration.
                res.setDate(res.getDate() + DAYS_DEFAULT);
            } else if (records.length <= USERS_MAX) {
                // If the number of users is within the promo limit, extend by promo months.
                res.setMonth(res.getMonth() + MONTHS_PROMO);
            } else {
                // Otherwise, apply the default duration and mark the promo as ended.
                res.setDate(res.getDate() + DAYS_DEFAULT);
                ifPromoEnded = true;
            }

            return res;
        }


        // MAIN

        /**
         * Runs the process of creating a new user record inside a transaction.
         * Ensures the user has a unique UUID and assigns an appropriate subscription date.
         *
         * @param {Object} [params={}] - Optional parameters.
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx] - External transaction (if provided).
         * @returns {Promise<{user: Svelters_Back_Store_RDb_Schema_User.Dto}>} - The newly created user record.
         */
        this.run = async function ({trx: trxOuter} = {}) {
            return await trxWrapper.execute(trxOuter, async (trx) => {
                logger.info(`Initializing record for new user.`);
                const dto = repoUser.createDto();
                dto.date_created = new Date();
                dto.date_subscription = await getSubscriptionEnd(trx);
                dto.uuid = await generateUniqueUUID(trx);
                const {primaryKey: key} = await repoUser.createOne({trx, dto});
                const userId = key[A_USER.ID];
                logger.info(`Record for user #${userId} has been created. Subscription until: ${dto.date_subscription}`);
                // Retrieve the newly created user record.
                const {record: user} = await repoUser.readOne({trx, key});
                return {user};
            });
        };

    }
}
