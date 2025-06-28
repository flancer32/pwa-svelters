/**
 * Implementation of the user management interface for the application.
 *
 * This class provides an empty implementation of the user management interface.
 *
 * @implements Fl64_OAuth2_Social_Back_Api_App_UserManager
 * TODO: rename to Adapter
 */
export default class Svelters_Back_Di_Replace_Social_UserManager {
    /**
     * @param {Svelters_Back_Defaults} DEF
     * @param {Fl32_Cms_Back_Config} cfgCms
     * @param {Svelters_Back_Act_User_Create} actCreate
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            Fl32_Cms_Back_Config$: cfgCms,
            Svelters_Back_Act_User_Create$: actCreate,
        }
    ) {
        //VARS
        let URL;

        // FUNCS
        function getRedirectUrl() {
            if (!URL) {
                const domain = cfgCms.getBaseUrl();
                URL = `${domain}/${DEF.SHARED.SPACE}/${DEF.SHARED.ROUTE_REGISTERED}.html`;
            }
            return URL;
        }

        // MAIN
        /**
         * Creates a new user in the application's database.
         * @param {object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx] - The transaction context.
         * @returns {Promise<{id: number|null, redirectUrl:string}>} - The unique identifier of the created user & redirect URL.
         */
        this.createUser = async function ({trx: trxOuter}) {
            const {user} = await actCreate.run({trx: trxOuter});
            const id = user?.id;
            const redirectUrl = getRedirectUrl();
            return {id, redirectUrl};
        };

    }
}
