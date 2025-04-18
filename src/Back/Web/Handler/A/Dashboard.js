/**
 * Handler for rendering dashboard.
 */
export default class Svelters_Back_Web_Handler_A_Dashboard {
    /**
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Web_Back_Help_Respond} respond - Error response helper
     * @param {Fl64_Web_Session_Back_Manager} session
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper
     * @param {Fl64_Tmpl_Back_Service_Render_Web} srvRender
     * @param {Svelters_Shared_Helper_Cast} helpCast
     * @param {Svelters_Back_Web_Handler_A_Z_Helper} zHelper
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            TeqFw_Web_Back_Help_Respond$: respond,
            Fl64_Web_Session_Back_Manager$: session,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Fl64_Tmpl_Back_Service_Render_Web$: srvRender,
            Svelters_Shared_Helper_Cast$: helpCast,
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
                const isAuthenticated = !!dto?.user_ref;
                const profile = (isAuthenticated)
                    ? await zHelper.readProfileUi({trx, userId: dto.user_ref}) : null;
                const canSubscribe = zHelper.calcUserCanSubscribe({
                    dateSubscriptionEnd: profile?.dateSubscriptionEnd
                });
                const view = {
                    canSubscribe,
                    isAuthenticated,
                    profile,
                };
                const {content: body} = await srvRender.perform({
                    name: 'dashboard.html',
                    localePkg: DEF.SHARED.LOCALE,
                    view,
                    req,
                    trx,
                });
                if (body) {
                    respond.code200_Ok({res, body});
                }
            });
        };

    }
}
