/**
 * Handler for rendering web pages using Mustache templates.
 */
export default class Svelters_Back_Web_Handler_A_Account_A_Delete {
    /**
     * @param {typeof import('node:http2')} http2
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Web_Back_Help_Respond} respond - Error response helper
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper
     * @param {Fl64_Web_Session_Back_Manager} session
     * @param {Fl64_Tmpl_Back_Service_Render_Web} srvRender
     * @param {Fl64_Auth_Otp_Back_Store_Mem_XsrfToken} memXsrfToken
     * @param {Svelters_Shared_Web_End_Account_Delete} endpoint
     * @param {Svelters_Back_Act_Account_Delete_Init} actInit
     * @param {Svelters_Back_Web_Handler_A_Z_Helper} zHelper
     */
    constructor(
        {
            'node:http2': http2,
            Svelters_Back_Defaults$: DEF,
            TeqFw_Web_Back_Help_Respond$: respond,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Fl64_Web_Session_Back_Manager$: session,
            Fl64_Tmpl_Back_Service_Render_Web$: srvRender,
            Fl64_Auth_Otp_Back_Store_Mem_XsrfToken$: memXsrfToken,
            Svelters_Shared_Web_End_Account_Delete$: endpoint,
            Svelters_Back_Act_Account_Delete_Init$: actInit,
            Svelters_Back_Web_Handler_A_Z_Helper$: zHelper,
        }
    ) {
        // VARS
        const {
            HTTP2_HEADER_CONTENT_TYPE,
            HTTP2_METHOD_GET,
            HTTP2_METHOD_POST,
        } = http2.constants;
        const RESULT = endpoint.getResultCodes();

        // FUNCS
        /**
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object
         * @returns {Promise<void>}
         */
        async function doGet(req, res) {
            return await trxWrapper.execute(null, async (trx) => {
                const {dto} = await session.getFromRequest({trx, req});
                const isAuthenticated = !!dto?.user_ref;
                const view = {isAuthenticated};
                if (isAuthenticated) {
                    view.profile = await zHelper.readProfileUi({trx, userId: dto.user_ref});
                    view.xsrfToken = memXsrfToken.create();
                }
                const {content: body} = await srvRender.perform({
                    name: 'account/delete.html',
                    localePkg: DEF.SHARED.LOCALE,
                    view,
                    req,
                    trx,
                });
                respond.code200_Ok({res, body});
            });
        }

        /**
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object
         * @returns {Promise<void>}
         */
        async function doPost(req, res) {
            return await trxWrapper.execute(null, async (trx) => {
                const response = endpoint.createRes();
                response.meta.code = RESULT.UNKNOWN;
                response.meta.ok = false;

                const {dto} = await session.getFromRequest({trx, req});
                const isAuthenticated = !!dto?.user_ref;
                if (isAuthenticated) {
                    // validate XSRF token
                    /** @type {Svelters_Shared_Web_End_Account_Delete.Request} */
                    const payload = await zHelper.parsePostedData(req);
                    const xsrfToken = payload.xsrfToken;
                    const foundToken = memXsrfToken.get({key: xsrfToken});
                    if (foundToken) {
                        await actInit.run({trx, userId: dto.user_ref});
                        // memXsrfToken.delete({key: xsrfToken});
                        response.meta.code = RESULT.SUCCESS;
                        respond.code200_Ok({
                            res,
                            headers: {[HTTP2_HEADER_CONTENT_TYPE]: 'application/json'},
                            body: JSON.stringify(response),
                        });
                    } else {
                        response.meta.code = RESULT.XSRF_TOKEN_INVALID;
                        respond.code403_Forbidden({res, body: JSON.stringify(response)});
                    }
                } else {
                    respond.code401_Unauthorized({res});
                }
            });
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
            if (req.method === HTTP2_METHOD_GET) {
                await doGet(req, res);
            } else if (req.method === HTTP2_METHOD_POST) {
                await doPost(req, res);
            }

        };

    }
}
