/**
 * Handler for rendering web pages using Mustache templates.
 */
export default class Svelters_Back_Web_Handler_A_Home {
    /**
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Web_Back_Help_Respond} respond - Error response helper
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper
     * @param {Fl64_Web_Session_Back_Manager} session
     * @param {Fl64_Tmpl_Back_Service_Render_Web} srvRender
     * @param {Svelters_Back_Web_Handler_A_Z_Helper} zHelper
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            TeqFw_Web_Back_Help_Respond$: respond,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Fl64_Web_Session_Back_Manager$: session,
            Fl64_Tmpl_Back_Service_Render_Web$: srvRender,
            Svelters_Back_Web_Handler_A_Z_Helper$: zHelper,
        }
    ) {
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
                const {dto} = await session.getFromRequest({trx, req});
                const view = {
                    betaUsersLeft: await zHelper.getUsersCount({trx}),
                    isAuthenticated: !!dto?.user_ref,
                };
                const {content: body} = await srvRender.perform({
                    name: 'home.html',
                    localePkg: DEF.SHARED.LOCALE,
                    view,
                    req,
                    trx,
                });
                respond.code200_Ok({res, body});
            });

        };

    }
}
