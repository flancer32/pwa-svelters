/**
 * Handler for rendering web pages using Mustache templates.
 */
export default class Svelters_Back_Web_Handler_A_Page {
    /**
     * @param {Svelters_Back_Defaults} DEF
     * @param {Fl32_Web_Back_Helper_Respond} respond - Error response helper
     * @param {Fl64_Web_Session_Back_Manager} session
     * @param {Fl64_Tmpl_Back_Service_Render_Web} srvRender
     * @param {Svelters_Back_Web_Handler_A_Z_Helper} zHelper
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            Fl32_Web_Back_Helper_Respond$: respond,
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
         * @param {string} relativePath
         *
         * @return {Promise<boolean>}
         */
        this.run = async function (req, res, relativePath) {
            const {dto} = await session.getFromRequest({req});
            const view = {
                betaUsersLeft: await zHelper.getUsersCount(),
                isAuthenticated: !!dto?.user_ref,
            };
            const {content: body} = await srvRender.perform({
                name: relativePath,
                localePkg: DEF.SHARED.LOCALE,
                view,
                req,
            });
            if (body) {
                respond.code200_Ok({res, body});
                return true;
            }
        };

    }
}
