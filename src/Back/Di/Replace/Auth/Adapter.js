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
     * @param {Svelters_Back_Act_User_Create} actCreate
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            Svelters_Back_Act_User_Create$: actCreate,

        }
    ) {
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
            const {user} = await actCreate.run({trx: trxOuter});
            const id = user?.id;
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
