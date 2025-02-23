import {constants as H2} from 'node:http2';

// VARS
const {
    HTTP2_METHOD_GET,
} = H2;

/**
 * Handler for rendering web pages using Mustache templates.
 */
export default class Svelters_Back_Web_Handler_A_Page {
    /**
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger instance
     * @param {TeqFw_Web_Back_Help_Respond} respond - Error response helper
     * @param {Fl64_Web_Session_Back_Manager} mgrSession - Session manager
     * @param {Fl64_Tmpl_Back_Service_Render} tmplRender
     * @param {Svelters_Back_Web_Handler_A_Z_Helper} zHelper
     * @param {typeof Fl64_Tmpl_Back_Enum_Type} TYPE
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Back_Help_Respond$: respond,
            Fl64_Web_Session_Back_Manager$: mgrSession,
            Fl64_Tmpl_Back_Service_Render$: tmplRender,
            Svelters_Back_Web_Handler_A_Z_Helper$: zHelper,
            'Fl64_Tmpl_Back_Enum_Type.default': TYPE,
        }
    ) {
        // VARS

        // MAIN
        /**
         * Handles incoming HTTP requests.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object
         * @param {string} relativePath
         *
         * @return {Promise<void>}
         */
        this.run = async function (req, res, relativePath) {
            const localeApp = DEF.SHARED.LOCALE;
            const localeUser = zHelper.getLocale(req);
            const name = relativePath;
            const partials = await zHelper.loadPartials(localeUser);
            const type = TYPE.WEB;
            const view = {};
            const {content: body} = await tmplRender.perform({name, type, localeUser, localeApp, view, partials});
            if (body) {
                respond.code200_Ok({res, body});
            }
        };

    }
}
