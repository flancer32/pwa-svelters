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
     * @param {Fl32_Web_Back_Helper_Respond} respond
     * @param {Fl32_Cms_Back_Config} cfgCms
     * @param {Fl64_Web_Session_Back_Manager} session
     */
    constructor(
        {
            'node:http2': http2,
            Svelters_Back_Defaults$: DEF,
            Fl32_Web_Back_Helper_Respond$: respond,
            Fl32_Cms_Back_Config$: cfgCms,
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
            if (!URL_BASE) URL_BASE = cfgCms.getBaseUrl();
            return `${URL_BASE}${url}`;
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
            throw new Error(`We don't use this method yet.`);
        };

        this.getAuthStatus = async function ({req}) {
            const {dto} = await session.getFromRequest({req});
            const isAuthenticated = (typeof dto?.id === 'number');
            return {isAuthenticated, userId: dto?.user_ref};
        };

    }
}
