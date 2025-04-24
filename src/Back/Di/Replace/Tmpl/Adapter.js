/**
 * Implementation of the template plugin adapter interface for the application.
 *
 * @implements Fl64_Tmpl_Back_Api_Adapter
 */
export default class Svelters_Back_Di_Replace_Tmpl_Adapter {
    /**
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Back_Config} config
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper
     * @param {Fl64_Tmpl_Back_Helper} helpTmpl
     * @param {Fl64_Tmpl_Back_Dto_Context} dtoContext
     * @param {Fl64_Web_Session_Back_Manager} session
     * @param {Svelters_Back_Store_RDb_Repo_User_Profile} repoProfile
     * @param {Svelters_Back_Helper_Web} helpWeb
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Back_Config$: config,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Fl64_Tmpl_Back_Helper$: helpTmpl,
            Fl64_Tmpl_Back_Dto_Context$: dtoContext,
            Fl64_Web_Session_Back_Manager$: session,
            Svelters_Back_Store_RDb_Repo_User_Profile$: repoProfile,
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
            if (!cfg?.devMode) {cache[localeUser] = res;}
            return res;
        }

        // MAIN

        this.getEmailContext = async function ({pkg, tmpl, userId, trx: trxOuter, req}) {
            const res = dtoContext.create();
            res.locale.app = DEF.SHARED.LOCALE;
            res.locale.user = DEF.SHARED.LOCALE;
            res.partials = {};
            res.view = {};
            // get the user locale from HTTP request of from the user profile
            if (req) res.locale.user = helpWeb.getLocale(req);
            if (userId) {
                await trxWrapper.execute(trxOuter, async (trx) => {
                    const {record: foundProfile} = await repoProfile.readOne({trx, key: userId});
                    if (foundProfile) res.locale.user = foundProfile.locale;
                });
            }
            return res;
        };

        this.getWebContext = async function ({req, trx}) {
            const res = dtoContext.create();
            const localeUser = helpWeb.getLocale(req);
            res.locale.app = DEF.SHARED.LOCALE;
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
