/**
 * Handler for rendering web pages using Mustache templates.
 */
export default class Svelters_Back_Web_Handler_A_Home {
    /**
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Web_Back_Help_Respond} respond - Error response helper
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper
     * @param {Fl64_Web_Session_Back_Manager} session
     * @param {Fl64_Tmpl_Back_Service_Render} tmplRender
     * @param {Svelters_Back_Store_RDb_Schema_User} rdbUser
     * @param {Svelters_Back_Web_Handler_A_Z_Helper} zHelper
     * @param {typeof Fl64_Tmpl_Back_Enum_Type} TYPE
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            TeqFw_Web_Back_Help_Respond$: respond,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Fl64_Web_Session_Back_Manager$: session,
            Fl64_Tmpl_Back_Service_Render$: tmplRender,
            Svelters_Back_Store_RDb_Schema_User$: rdbUser,
            Svelters_Back_Web_Handler_A_Z_Helper$: zHelper,
            Fl64_Tmpl_Back_Enum_Type$: TYPE,
        }
    ) {
        // FUNCS

        /**
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @returns {Promise<number>}
         */
        async function getUsersCount(trx) {
            const table = trx.getTableName(rdbUser);
            /** @type {Knex.QueryBuilder} */
            const query = trx.createQuery();
            query.table(table);
            query.count('*');
            const [{count}] = await query;
            return 100 - Number.parseInt(count);
        }

        // MAIN
        /**
         * Handles incoming HTTP requests.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object
         *
         * @return {Promise<void>}
         */
        this.run = async function (req, res) {
            return await trxWrapper.execute(null, async (trx) => {
                const localeApp = DEF.SHARED.LOCALE;
                const localeUser = zHelper.getLocale(req);
                const name = 'home.html';
                const partials = await zHelper.loadPartials(localeUser);
                const type = TYPE.WEB;
                const {dto} = await session.getFromRequest({trx, req});
                const view = {
                    betaUsersLeft: await getUsersCount(trx),
                    isAuthenticated: !!dto?.user_ref,
                };
                const {content: body} = await tmplRender.perform({name, type, localeUser, localeApp, view, partials});
                respond.code200_Ok({res, body});
            });

        };

    }
}
