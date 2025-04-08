/**
 * Implementation of the template plugin adapter interface for the application.
 *
 * @implements Fl64_Tmpl_Back_Api_Adapter
 */
export default class Svelters_Back_Di_Replace_Tmpl_Adapter {
    /**
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Back_Config} config
     * @param {Fl64_Tmpl_Back_Helper} helpTmpl
     * @param {Fl64_Tmpl_Back_Dto_Context} dtoContext
     * @param {Fl64_Web_Session_Back_Manager} session
     * @param {Svelters_Back_Helper_Web} helpWeb
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Back_Config$: config,
            Fl64_Tmpl_Back_Helper$: helpTmpl,
            Fl64_Tmpl_Back_Dto_Context$: dtoContext,
            Fl64_Web_Session_Back_Manager$: session,
            Svelters_Back_Helper_Web$: helpWeb,
        }
    ) {
        // VARS
        const includes = {
            'blockAnon': 'includes/blockAnon.html',
            'uiBtnGptChat': 'includes/ui/btnGptChat.html',
            'htmlHead': 'includes/htmlHead.html',
            'pageHeader': 'includes/pageHeader.html',
            'pageFooter': 'includes/pageFooter.html',
        };
        /** @type {Object.<string, Object.<string, string>>} */
        const cache = {};

        // FUNCS
        async function loadPartials(localeUser) {
            if (cache?.[localeUser]) {return cache[localeUser];}
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
            // cache the loaded partials in production mode
            /** @type {TeqFw_Core_Back_Plugin_Dto_Config_Local.Dto} */
            const cfg = config.getLocal(DEF.MOD_CORE.SHARED.NAME);
            if (!cfg.devMode) {cache[localeUser] = res;}
            return res;
        }

        // MAIN
        this.getLocales = async function ({req}) {
            const localeUser = helpWeb.getLocale(req);
            return {localeUser, localeApp: DEF.SHARED.LOCALE};
        };

        this.getWebContext = async function ({req, trx}) {
            const res = dtoContext.create();
            const {localeApp, localeUser} = await this.getLocales({req});
            res.locale.app = localeApp;
            res.locale.user = localeUser;
            res.partials = await loadPartials(localeUser);
            const {dto} = await session.getFromRequest({trx, req});
            res.view = {
                isAuthenticated: !!dto?.user_ref,
            };
            return res;
        };

    }
}
