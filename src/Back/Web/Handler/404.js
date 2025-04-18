/**
 * Handles requests when no other handler can process the request (404 - Not Found).
 */
export default class Svelters_Back_Web_Handler_404 {
    /**
     * Initializes the handler with required dependencies.
     *
     * @param {typeof import('node:http2')} http2
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {TeqFw_Web_Back_Help_Respond} respond
     * @param {Fl64_Web_Session_Back_Manager} session
     * @param {Fl64_Tmpl_Back_Service_Render_Web} srvRender
     */
    constructor(
        {
            'node:http2': http2,
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Back_Help_Respond$: respond,
            Fl64_Web_Session_Back_Manager$: session,
            Fl64_Tmpl_Back_Service_Render_Web$: srvRender,
        }
    ) {
        // VARS
        const {
            HTTP2_HEADER_CONTENT_TYPE,
        } = http2.constants;

        // FUNCS
        /**
         * Processes HTTP requests and renders a 404 page if no other handler can process it.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         */
        async function process(req, res) {
            try {
                if (!res.headersSent) {
                    const shares = req[DEF.MOD_WEB.HNDL_SHARE];
                    const statusCode = shares[DEF.MOD_WEB.SHARE_RES_STATUS];
                    const file = shares[DEF.MOD_WEB.SHARE_RES_FILE];
                    const body = shares[DEF.MOD_WEB.SHARE_RES_BODY];
                    if (!statusCode && !file && !body) {
                        const {dto} = await session.getFromRequest({req});
                        const view = {
                            isAuthenticated: !!dto?.user_ref,
                        };
                        const fullPath = req.url.split('?')[0];
                        const baseIndex = fullPath.indexOf(DEF.SHARED.SPACE);
                        const relativePath = fullPath.slice(baseIndex + DEF.SHARED.SPACE.length + 1);
                        let body;
                        const {content: bodyPage} = await srvRender.perform({
                            name: relativePath + '.html',
                            localePkg: DEF.SHARED.LOCALE,
                            view,
                            req,
                        });
                        if (bodyPage) {
                            body = bodyPage;
                        } else {
                            const {content: body404} = await srvRender.perform({
                                name: '404.html',
                                localePkg: DEF.SHARED.LOCALE,
                                view,
                                req,
                            });
                            body = body404;
                        }
                        respond.code404_NotFound({
                            res, body, headers: {
                                [HTTP2_HEADER_CONTENT_TYPE]: 'text/html; charset=utf-8',
                            }
                        });
                    }
                }
            } catch (error) {
                logger.exception(error);
                respond.code500_InternalServerError({res, body: error.message});
            }
        }

        /**
         * Provides the function to process 404 requests.
         * @returns {Function}
         */
        this.getProcessor = () => process;

        /**
         * Placeholder for any additional initialization logic (if needed).
         */
        this.init = async function () { };

        /**
         * Checks if this handler can process the current request (always returns true for 404).
         * @returns {boolean}
         */
        this.canProcess = function () {
            return true;
        };
    }
}
