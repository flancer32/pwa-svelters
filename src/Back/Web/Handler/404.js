/**
 * Handles requests for the authentication and authorization processes using one-time passwords (OTP).
 */
import {constants as H2} from 'node:http2';

const {
    HTTP2_HEADER_CONTENT_TYPE,
} = H2;

/**
 * Dispatcher for handling authentication-related HTTP requests.
 */
export default class Svelters_Back_Web_Handler_404 {
    /**
     * Initializes the handler with required dependencies.
     *
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {TeqFw_Web_Back_Help_Respond} respond
     * @param {Fl64_Tmpl_Back_Service_Render} tmplRender
     * @param {Svelters_Back_Web_Handler_A_Z_Helper} zHelper
     * @param {typeof Fl64_Tmpl_Back_Enum_Type} TYPE
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Back_Help_Respond$: respond,
            Fl64_Tmpl_Back_Service_Render$: tmplRender,
            Svelters_Back_Web_Handler_A_Z_Helper$: zHelper,
            'Fl64_Tmpl_Back_Enum_Type.default': TYPE,
        }
    ) {
        /**
         * Handles incoming HTTP requests and delegates processing to specific handlers.
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
                        const localeApp = DEF.SHARED.LOCALE;
                        const localeUser = zHelper.getLocale(req);
                        const name = '404.html';
                        const partials = await zHelper.loadPartials(localeUser);
                        const type = TYPE.WEB;
                        const view = {};
                        const {content: body} = await tmplRender.perform({
                            name,
                            type,
                            localeUser,
                            localeApp,
                            view,
                            partials
                        });
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
         * Provides the function to process requests.
         * @returns {Function}
         */
        this.getProcessor = () => process;

        /**
         * Placeholder for initialization logic.
         */
        this.init = async function () { };

        /**
         * Checks if the request can be handled by this instance.
         * @returns {boolean}
         */
        this.canProcess = function () {
            return true;
        };
    }
}
