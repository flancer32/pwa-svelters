export default class Svelters_Back_Web_Handler_A_Z_Helper {
    /**
     * @param {typeof import('node:http2')} http2
     * @param {typeof import('node:url')} url
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger instance
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper
     * @param {Svelters_Back_Store_RDb_Schema_User} rdbUser
     * @param {Svelters_Shared_Helper_Cast} helpCast
     * @param {Fl64_Tmpl_Back_Act_FindTemplate} actFind
     * @param {Fl64_Tmpl_Back_Act_LoadTemplate} actLoad
     * @param {Svelters_Back_Act_User_Profile_Read} actProfileRead
     * @param {typeof Fl64_Tmpl_Back_Enum_Type} TYPE
     */
    constructor(
        {
            'node:http2': http2,
            'node:url': url,
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Svelters_Back_Store_RDb_Schema_User$: rdbUser,
            Svelters_Shared_Helper_Cast$: helpCast,
            Fl64_Tmpl_Back_Act_FindTemplate$: actFind,
            Fl64_Tmpl_Back_Act_LoadTemplate$: actLoad,
            Svelters_Back_Act_User_Profile_Read$: actProfileRead,
            Fl64_Tmpl_Back_Enum_Type$: TYPE,
        }
    ) {
        // VARS
        const {
            HTTP2_HEADER_ACCEPT_LANGUAGE,
            HTTP2_HEADER_CONTENT_TYPE,
            HTTP2_METHOD_POST,
        } = http2.constants;
        const {URLSearchParams} = url;
        const MONTHS_RENEW = DEF.SUBSCRIPTION_MONTHS_RENEW;
        const includes = {
            'blockAnon': 'includes/blockAnon.html',
            'uiBtnGptChat': 'includes/ui/btnGptChat.html',
            'htmlHead': 'includes/htmlHead.html',
            'pageHeader': 'includes/pageHeader.html',
            'pageFooter': 'includes/pageFooter.html',
        };
        /** @type {Object.<string, Object.<string, string>>} */
        const cache = {};

        // MAIN

        /**
         *
         * @param {Date|string} dateSubscriptionEnd
         * @returns {boolean}
         */
        this.calcUserCanSubscribe = function ({dateSubscriptionEnd}) {
            if (dateSubscriptionEnd) {
                const renew = new Date();
                const end = new Date(dateSubscriptionEnd);
                renew.setMonth(renew.getMonth() + MONTHS_RENEW);
                return (renew > end);
            } else
                return false;
        };

        this.castDate = helpCast.dateString;

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
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @returns {Promise<number>}
         */
        this.getUsersCount = async function ({trx: trxOuter} = {}) {
            return await trxWrapper.execute(trxOuter, async (trx) => {
                const table = trx.getTableName(rdbUser);
                /** @type {Knex.QueryBuilder} */
                const query = trx.createQuery();
                query.table(table);
                query.count('*');
                const [{count}] = await query;
                return 100 - Number.parseInt(count);
            });
        };

        /**
         * @return {Promise<Object<string, string>>}
         * @deprecated
         * @see Fl64_Tmpl_Back_Service_Render_Web.perform
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

        /**
         * Parses the GET parameters from the URL query string.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request.
         * @return {*} Parsed GET parameters as an object.
         */
        this.parseGetParams = function (req) {
            const url = new URL(req.url, `http://${req.headers.host}`);
            return Object.fromEntries(url.searchParams.entries());
        };

        /**
         * Parses the request body, supporting both JSON and x-www-form-urlencoded formats.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request.
         * @return {Promise<*>} Parsed request body as an object.
         */
        this.parsePostedData = async function (req) {
            let body = {};
            if (req.method === HTTP2_METHOD_POST) {
                const shares = req[DEF.MOD_WEB.HNDL_SHARE];

                // Check if the request body is already available in shared memory
                if (shares?.[DEF.MOD_WEB.SHARE_REQ_BODY_JSON]) {
                    body = shares[DEF.MOD_WEB.SHARE_REQ_BODY_JSON];
                } else {
                    const buffers = [];
                    for await (const chunk of req) {
                        buffers.push(chunk);
                    }
                    const rawBody = Buffer.concat(buffers).toString();

                    // Detect content type and parse accordingly
                    const contentType = req.headers[HTTP2_HEADER_CONTENT_TYPE] || '';

                    if (contentType.includes('application/json')) {
                        body = JSON.parse(rawBody);
                    } else if (contentType.includes('application/x-www-form-urlencoded')) {
                        body = Object.fromEntries(new URLSearchParams(rawBody));
                    }
                }
            }
            return body;
        };

        /**
         * The action is wrapped as a function with complex input and simple output arguments.
         *
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {number} params.userId
         * @returns {Promise<Svelters_Shared_Dto_User_Profile.Dto>}
         */
        this.readProfile = async function ({trx, userId}) {
            const {profile} = await actProfileRead.run({trx, userId});
            return profile;
        };

    }
}
