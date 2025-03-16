/**
 * TODO: add JSDoc
 */
export default class Svelters_Back_Web_Handler_A_Register {
    /**
     * @param {typeof import('node:crypto')} crypto
     * @param {typeof import('node:http2')} http2
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger instance
     * @param {TeqFw_Web_Back_Help_Respond} respond - Error response helper
     * @param {Fl64_Web_Session_Back_Manager} session - Session manager
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper - Database transaction wrapper
     * @param {Fl64_Tmpl_Back_Service_Render} tmplRender
     * @param {Fl64_Auth_Otp_Back_Store_Mem_XsrfToken} memXsrfToken
     * @param {Fl64_OAuth2_Social_Back_Mod_Provider} modProvider - Module for interacting with OAuth2 providers
     * @param {Fl64_OAuth2_Social_Back_Plugin_Registry_Provider} regProviders
     * @param {Fl64_OAuth2_Social_Back_Store_Mem_State} memState
     * @param {Svelters_Back_Web_Handler_A_Z_Helper} zHelper
     * @param {typeof Fl64_Tmpl_Back_Enum_Type} TMPL
     * @param {typeof Fl64_OAuth2_Social_Shared_Enum_Provider_Code} PROVIDER
     */
    constructor(
        {
            'node:crypto': crypto,
            'node:http2': http2,
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Back_Help_Respond$: respond,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Fl64_Web_Session_Back_Manager$: session,
            Fl64_Tmpl_Back_Service_Render$: tmplRender,
            Fl64_Auth_Otp_Back_Store_Mem_XsrfToken$: memXsrfToken,
            Fl64_OAuth2_Social_Back_Mod_Provider$: modProvider,
            Fl64_OAuth2_Social_Back_Plugin_Registry_Provider$: regProviders,
            Fl64_OAuth2_Social_Back_Store_Mem_State$: memState,
            Svelters_Back_Web_Handler_A_Z_Helper$: zHelper,
            'Fl64_Tmpl_Back_Enum_Type.default': TMPL,
            'Fl64_OAuth2_Social_Shared_Enum_Provider_Code.default': PROVIDER,
        }
    ) {
        // VARS
        const {
            HTTP2_HEADER_CONTENT_TYPE,
            HTTP2_METHOD_GET,
        } = http2.constants;
        const {randomUUID} = crypto;

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
            // FUNCS
            /**
             * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request
             * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object
             * @returns {Promise<void>}
             */
            async function doGet(req, res) {
                /* Prepare data for page rendering. */
                const view = {};
                await trxWrapper.execute(null, async (trx) => {
                    // generate XSRF token for OTP section
                    const xsrfToken = randomUUID();
                    memXsrfToken.set({key: xsrfToken});
                    view.xsrfToken = xsrfToken;
                    // load providers for OAuth section
                    const state = randomUUID();
                    memState.set({key: state, data: true});
                    const found = await modProvider.list({trx});
                    const github = found.find(provider => provider.code === PROVIDER.GITHUB);
                    const google = found.find(provider => provider.code === PROVIDER.GOOGLE);
                    const x = found.find(provider => provider.code === PROVIDER.X);
                    if (github)
                        view.urlGithub = regProviders.get(github.code)
                            .getAuthorizationUrl({clientId: github.clientId, state,});
                    if (google)
                        view.urlGoogle = regProviders.get(google.code)
                            .getAuthorizationUrl({clientId: google.clientId, state,});
                    if (x)
                        view.urlX = regProviders.get(x.code)
                            .getAuthorizationUrl({clientId: x.clientId, state,});


                });

                // load template and render the page
                const localeApp = DEF.SHARED.LOCALE;
                const localeUser = zHelper.getLocale(req);
                const name = 'register.html';
                const partials = await zHelper.loadPartials(localeUser);
                const type = TMPL.WEB;
                const {content: body} = await tmplRender.perform({name, type, localeUser, localeApp, view, partials});
                respond.code200_Ok({
                    res, body, headers: {
                        [HTTP2_HEADER_CONTENT_TYPE]: 'text/html'
                    }
                });
            }

            // MAIN
            if (req.method === HTTP2_METHOD_GET) {
                await doGet(req, res);
            }
        };

    }
}
