import {constants as H2} from 'node:http2';
// VARS
const {
    HTTP2_HEADER_ACCEPT_LANGUAGE,
} = H2;

export default class Svelters_Back_Web_Handler_A_Z_Helper {
    /**
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger instance
     * @param {Fl64_Tmpl_Back_Act_FindTemplate} actFind
     * @param {Fl64_Tmpl_Back_Act_LoadTemplate} actLoad
     * @param {typeof Fl64_Tmpl_Back_Enum_Type} TYPE
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl64_Tmpl_Back_Act_FindTemplate$: actFind,
            Fl64_Tmpl_Back_Act_LoadTemplate$: actLoad,
            'Fl64_Tmpl_Back_Enum_Type.default': TYPE,
        }
    ) {
        // VARS
        const includes = {
            'htmlHead': 'includes/htmlHead.html',
            'pageHeader': 'includes/pageHeader.html',
            'pageFooter': 'includes/pageFooter.html',
        };
        /** @type {Object<string, Object<string, string>>} */
        const cache = {};

        // MAIN

        /**
         * Extracts the locale from the HTTP request or falls back to a default locale.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request.
         * @returns {string} - Extracted or default locale.
         */
        this.getLocale = function (req) {
            let res = DEF.SHARED.LOCALE;

            // Check locale in cookies
            const cookies = req.headers.cookie || '';
            const cookieMatch = cookies.match(/locale=([^;]+)/);
            if (cookieMatch) {
                const cookieLocale = cookieMatch[1];
                if (DEF.SHARED.LOCALE_AVAILABLE.includes(cookieLocale)) res = cookieLocale;
            } else {
                // Check locale in Accept-Language header
                const acceptLanguage = req.headers[HTTP2_HEADER_ACCEPT_LANGUAGE];
                if (acceptLanguage) {
                    const locales = acceptLanguage
                        .split(',')
                        .map((lang) => lang.split(';')[0].trim().split('-')[0]); // Extract base locale (e.g., 'lv' from 'lv-LV')
                    const validLocale = locales.find((locale) => DEF.SHARED.LOCALE_AVAILABLE.includes(locale));
                    if (validLocale) res = validLocale;
                }
            }
            return res;
        };


        /**
         * @return {Promise<Object<string, string>>}
         */
        this.loadPartials = async function (localeUser) {
            if (!cache?.[localeUser]) {
                cache[localeUser] = {};
                const keys = Object.keys(includes);
                for (const key of keys) {
                    const localeApp = DEF.SHARED.LOCALE;
                    const name = includes[key];
                    const type = TYPE.WEB;
                    const {path} = await actFind.run({type, name, localeUser, localeApp});
                    const {content} = await actLoad.run({path});
                    cache[localeUser][key] = content;
                    logger.info(`Template '${name}' is loaded from '${path}' for locale '${localeUser}'.`);
                }
            }
            return cache[localeUser];
        };

    }
}
