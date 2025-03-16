/**
 * Implementation of the user management interface for the application.
 *
 * This class provides an empty implementation of the user management interface.
 *
 * @implements Fl64_OAuth2_Back_Api_Adapter
 */
export default class Svelters_Back_Di_Replace_OAuth2_Adapter {
    /**
     * @param {typeof import('node:http2')} http2
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Back_Config} config
     * @param {TeqFw_Core_Shared_Api_Logger} logger - The logger instance.
     * @param {TeqFw_Web_Back_Help_Respond} respond
     * @param {Fl64_Web_Session_Back_Manager} session
     */
    constructor(
        {
            'node:http2': http2,
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Back_Config$: config,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Back_Help_Respond$: respond,
            Fl64_Web_Session_Back_Manager$: session,
        }
    ) {
        // VARS
        const {
            HTTP2_HEADER_LOCATION,
        } = http2.constants;
        let URL_BASE;
        let LOGIN_BASE;

        // FUNCS
        /**
         * Merge domain name and `url`.
         * @param {string} url
         * @returns {string}
         */
        function composeUrl(url) {
            if (!URL_BASE) {
                const web = config.getLocal(DEF.MOD_WEB.SHARED.NAME);
                URL_BASE = web.urlBase;
            }
            return `https://${URL_BASE}${url}`;
        }

        function getLoginUrl() {
            if (!LOGIN_BASE) {
                const space = DEF.SHARED.SPACE;
                LOGIN_BASE = composeUrl(`/${space}/${DEF.SHARED.ROUTE_LOGIN}`);
            }
            return LOGIN_BASE;
        }

        // MAIN
        this.forwardToAuthentication = function ({req, res}) {
            const redirectUrl = composeUrl(req.url);
            session.storeRedirectUrl({redirectUrl})
                .then(({headers: cookie = {}}) => {
                    const headers = {
                        [HTTP2_HEADER_LOCATION]: getLoginUrl(),
                        ...cookie
                    };
                    respond.code302_Found({res, headers});
                });
        };

        this.getLocales = function ({req}) {
            // TODO: we have one only locale for the moment
            return {localeUser: DEF.SHARED.LOCALE, localeApp: DEF.SHARED.LOCALE};
        };

        this.getAuthStatus = async function ({req}) {
            const {dto} = await session.getFromRequest({req});
            const isAuthenticated = (typeof dto?.id === 'number');
            return {isAuthenticated, userId: dto?.user_ref};
        };

    }
}
