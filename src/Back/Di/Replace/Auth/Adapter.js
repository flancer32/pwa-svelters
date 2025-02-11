import {randomUUID} from 'node:crypto';
/**
 * Implementation of the user management interface for the application.
 *
 * This class provides an empty implementation of the user management interface.
 *
 * @implements Fl64_Auth_Otp_Back_Api_Adapter
 */
export default class Svelters_Back_Di_Replace_Auth_Adapter {
    /**
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger - The logger instance.
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper - Database transaction wrapper
     * @param {Svelters_Back_Store_RDb_Repo_User} repoUser - User repository
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Svelters_Back_Store_RDb_Repo_User$: repoUser,

        }
    ) {
        // VARS
        const A_USER = repoUser.getSchema().getAttributes();
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
        this.canRegisterEmail = async function ({trx: trxOuter, email}) {
            let allowed = true;
            let reason = null;
            // always allowed, plugin should validate email by itself
            return {allowed, reason};
        };

        /**
         * Creates a new user in the application's database.
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx] - The transaction context.
         * @param {string} [params.email]
         * @returns {Promise<{id: number|null}>} - The unique identifier of the created user.
         */
        this.createUser = async function ({trx: trxOuter, email}) {
            let id = null;
            await trxWrapper.execute(trxOuter, async (trx) => {
                const dto = repoUser.getSchema().createDto();
                dto.date_created = new Date();
                dto.uuid = await generateUniqueUUID(trx);
                const {primaryKey} = await repoUser.createOne({trx, dto});
                id = primaryKey[A_USER.ID];
            });
            return {id};
        };

        this.getLocales = function ({req}) {
            // TODO: we have one only locale for the moment
            return {localeUser: DEF.SHARED.LOCALE, localeApp: DEF.SHARED.LOCALE};
        };

        this.getTmplDataEmailAuthenticate = function ({trx, userId}) {
            // TODO: we have no variables for the moment
            return {vars: {}};
        };

        this.getTmplDataEmailRegister = function ({trx, userId}) {
            // TODO: we have no variables for the moment
            return {vars: {}};
        };

    }
}
