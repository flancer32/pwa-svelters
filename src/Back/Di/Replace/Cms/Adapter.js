/**
 * CMS backend adapter for web rendering in Svelters project.
 *
 * Resolves localized template path and prepares rendering context including view data and partials.
 *
 * @implements Fl32_Cms_Back_Api_Adapter
 */
export default class Svelters_Back_Di_Replace_Cms_Adapter {
    /**
     * @param {typeof import('node:path')} path
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {TeqFw_Core_Back_Config} config
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper - Database transaction wrapper
     * @param {Fl32_Cms_Back_Config} cfgCms
     * @param {Fl64_Tmpl_Back_Helper} helpTmpl
     * @param {Fl64_Tmpl_Back_Dto_Context} dtoContex
     * @param {Fl32_Tmpl_Back_Dto_Target} dtoTmplTarget
     * @param {Fl32_Cms_Back_Helper_File} helpFile
     * @param {Fl64_Web_Session_Back_Manager} session
     * @param {Svelters_Back_Helper_Web} helpWeb
     */
    constructor(
        {
            'node:path': path,
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Core_Back_Config$: config,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Fl32_Cms_Back_Config$: cfgCms,
            Fl64_Tmpl_Back_Helper$: helpTmpl,
            Fl64_Tmpl_Back_Dto_Context$: dtoContext,
            Fl32_Tmpl_Back_Dto_Target$: dtoTmplTarget,
            Fl32_Cms_Back_Helper_File$: helpFile,
            Fl64_Web_Session_Back_Manager$: session,
            Svelters_Back_Helper_Web$: helpWeb,
        }
    ) {
        // VARS
        const includes = {
            'blockAnon': 'includes/blockAnon.html',
            'htmlHead': 'includes/htmlHead.html',
            'lang': 'includes/lang.html',
            'pageFooter': 'includes/pageFooter.html',
            'pageHeader': 'includes/pageHeader.html',
            'uiBtnAppSignUp': 'includes/ui/btnAppSignUp.html',
            'uiBtnGptChat': 'includes/ui/btnGptChat.html',
            'uiBtnGptChatWhite': 'includes/ui/btnGptChatWhite.html',
        };
        const cache = {};

        // FUNCS
        async function loadPartials(localeUser) {
            if (cache?.[localeUser]) return cache[localeUser];
            const res = {};
            const context = dtoContext.create();
            context.locale.app = DEF.SHARED.LOCALE;
            context.locale.user = localeUser;
            const keys = Object.keys(includes);
            for (const key of keys) {
                const name = includes[key];
                const {content} = await helpTmpl.loadTmplWeb({name, locale: context.locale});
                res[key] = content;
            }
            const cfg = config.getLocal(DEF.MOD_CORE.SHARED.NAME);
            if (!cfg?.devMode) cache[localeUser] = res;
            return res;
        }

        // MAIN
        /**
         * @param {object} params - Database transaction context.
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx] - Database transaction context.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} params.req - Incoming HTTP request.
         * @returns {Promise<{target: Fl32_Tmpl_Back_Dto_Target.Dto, data: {allowedLocales: string[], alternateUrls: {}, canonicalUrl: string, ip: (string|string), isAuthenticated: boolean, lang: (*|string), locale: string, ua: (*|string)}, options}>}
         */
        this.getRenderData = async function ({trx: trxOuter, req}) {
            let target, data, options;
            return await trxWrapper.execute(trxOuter, async (trx) => {
                try {
                    const allowedLocales = cfgCms.getLocaleAllowed();
                    const localeBaseWeb = cfgCms.getLocaleBaseWeb();
                    const {cleanPath, locale} = helpWeb.extractRoutingInfo(req);
                    const baseDir = path.join(cfgCms.getRootPath(), 'tmpl', 'web', localeBaseWeb);
                    const tmplPath = await helpFile.resolveTemplateName({baseDir, cleanPath});
                    if (tmplPath) {
                        target = dtoTmplTarget.create({
                            type: 'web',
                            name: tmplPath,
                            locales: {user: locale, app: localeBaseWeb},
                        });

                        const rawBaseUrl = cfgCms.getBaseUrl();
                        const baseUrl = (rawBaseUrl || `//${req.headers.host || 'localhost'}`).replace(/\/+$/, '');
                        const canonicalUrl = `${baseUrl}/${localeBaseWeb}/${tmplPath}`;
                        const alternateUrls = {};
                        for (const loc of allowedLocales) {
                            alternateUrls[loc] = `${baseUrl}/${loc}/${tmplPath}`;
                        }

                        const {dto} = await session.getFromRequest({trx, req});

                        data = {
                            allowedLocales,
                            alternateUrls,
                            canonicalUrl,
                            ip: req.socket?.remoteAddress || '',
                            isAuthenticated: !!dto?.user_ref,
                            lang: req.headers['accept-language'] || '',
                            locale,
                            ua: req.headers['user-agent'] || '',
                            ...dto,
                        };

                        options = await loadPartials(locale);
                    }
                } catch (e) {
                    logger.exception(e);
                    target = data = options = undefined;
                }
                return {target, data, options};
            });

        };
        /**
         * @param {object} args - Parameters object.
         * @param {import('node:http').IncomingMessage | import('node:http2').Http2ServerRequest} args.req - The HTTP(S) request object.
         * @returns {Promise<Fl32_Cms_Back_Api_Adapter.RenderData>} Rendering context for the template engine.
         */
        this.get404Data = async function ({req}) {
            let data, options;
            const tmplPath = '404.html';
            try {
                const allowedLocales = cfgCms.getLocaleAllowed();
                const localeBaseWeb = cfgCms.getLocaleBaseWeb();
                const locale = helpWeb.getLocale(req);
                const rawBaseUrl = cfgCms.getBaseUrl();
                const baseUrl = (rawBaseUrl || `//${req.headers.host || 'localhost'}`).replace(/\/+$/, '');
                const canonicalUrl = `${baseUrl}/${localeBaseWeb}/${tmplPath}`;
                const alternateUrls = {};
                for (const loc of allowedLocales) {
                    alternateUrls[loc] = `${baseUrl}/${loc}/${tmplPath}`;
                }

                const {dto} = await session.getFromRequest({req});

                data = {
                    allowedLocales,
                    alternateUrls,
                    canonicalUrl,
                    ip: req.socket?.remoteAddress || '',
                    isAuthenticated: !!dto?.user_ref,
                    lang: req.headers['accept-language'] || '',
                    locale,
                    ua: req.headers['user-agent'] || '',
                };

                options = await loadPartials(locale);
            } catch (e) {
                logger.exception(e);
                data = options = undefined;
            }
            return {data, options};
        };
    }
}
