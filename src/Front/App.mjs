/**
 * Web application.
 *
 * Initialization:
 * - Init UUID for front & back.
 * - Init processes and bind it to events.
 * - Open reverse events stream.
 * - Init Vue (add router, Quasar UI),
 *
 * Then create and mount root vue component to given DOM element.
 */
// MODULE'S VARS
const NS = 'Svelters_Front_App';

// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Front_Api_IApp
 */
export default class Svelters_Front_App {
    /**
     * @param {TeqFw_Di_Container} container
     * @param {function} createApp
     * @param {function} createRouter
     * @param {function} createWebHashHistory
     * @param {Svelters_Front_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Core_Shared_Logger_Base} loggerBase
     * @param {Fl32_Log_Front_Logger_Transport} modLogTrn -  as interface
     * @param {TeqFw_Ui_Quasar_Front_Lib} quasar
     * @param {TeqFw_Web_Front_Mod_Config} modCfg
     * @param {TeqFw_I18n_Front_Mod_I18n} modI18n
     * @param {Fl32_Auth_Front_Mod_Session} modSess
     * @param {Svelters_Front_Ui_Layout_Main.vueCompTmpl} LayoutMain
     */
    constructor(
        {
            container,
            'TeqFw_Vue_Front_Ext_Vue.createApp': createApp,
            'TeqFw_Vue_Front_Ext_Router.createRouter': createRouter,
            'TeqFw_Vue_Front_Ext_Router.createWebHashHistory': createWebHashHistory,
            Svelters_Front_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Core_Shared_Logger_Base$: loggerBase,
            TeqFw_Core_Shared_Api_Logger_Transport$: modLogTrn,
            TeqFw_Ui_Quasar_Front_Lib: quasar,
            TeqFw_Web_Front_Mod_Config$: modCfg,
            TeqFw_I18n_Front_Mod_I18n$: modI18n,
            Fl32_Auth_Front_Mod_Session$: modSess,
            Svelters_Front_Ui_Layout_Main$: LayoutMain,
        }) {
        // VARS
        let _isInitialized = false; // application is initialized and can be mounted
        let _print; // function to printout logs to UI or console
        let _root; // root vue component for the application

        // MAIN
        logger.setNamespace(this.constructor.name);

        // INSTANCE METHODS

        this.init = async function (fnPrintout) {
            // FUNCS

            /**
             * Create printout function to log application startup events (to page or to console).
             * @param {function(string)} fn
             * @return {function(string)}
             */
            function createPrintout(fn) {
                return (typeof fn === 'function') ? fn : (msg) => console.log(msg);
            }

            /**
             * Setup working languages and fallback language and add translation function to the Vue.
             *
             * @param {Object} app
             * @return {Promise<void>}
             * @memberOf Svelters_Front_App.init
             */
            async function initI18n(app) {
                await modI18n.init(['en'], 'en');
                const i18n = modI18n.getI18n();
                // add translation function to Vue
                const appProps = app.config.globalProperties;
                // noinspection JSPrimitiveTypeWrapperUsage
                appProps.$t = function (key, options) {
                    // add package name if namespace is omitted in the key
                    // noinspection JSUnresolvedVariable
                    const ns = this.$options.teq?.package;
                    if (ns && key.indexOf(':') <= 0) key = `${ns}:${key}`;
                    return i18n.t(key, options);
                };
            }

            function initLogger() {
                // logger
                /** @type {TeqFw_Web_Shared_Dto_Config_Front.Dto} */
                const cfg = modCfg.get();
                const domain = cfg?.custom?.[DEF.SHARED.CFG_WEB_LOGS_AGG];
                if (domain) {
                    modLogTrn.enableLogs(domain);
                    loggerBase.setTransport(modLogTrn);
                }
            }

            function initQuasarUi(app, quasar) {
                app.use(quasar, {config: {}});
                // noinspection JSUnresolvedVariable
                quasar.iconSet.set(quasar.iconSet.svgMaterialIcons);
                quasar.lang.set(quasar.lang.en);
            }

            function initRouter(app, DEF, container) {
                /** @type {{addRoute}} */
                const router = createRouter({
                    history: createWebHashHistory(), routes: [],
                });
                // setup application routes (load es6-module on demand with DI-container)
                router.addRoute({
                    path: DEF.ROUTE_AUTH_IN,
                    component: () => container.get('Svelters_Front_Ui_Route_Auth_In$'),
                    meta: {anonymous: true},
                });
                router.addRoute({
                    path: DEF.ROUTE_AUTH_OUT,
                    component: () => container.get('Svelters_Front_Ui_Route_Auth_Out$'),
                    meta: {anonymous: true},
                });
                router.addRoute({
                    path: DEF.ROUTE_AUTH_UP,
                    component: () => container.get('Svelters_Front_Ui_Route_Auth_Up$'),
                    meta: {anonymous: true},
                });
                router.addRoute({
                    path: DEF.ROUTE_CFG,
                    component: () => container.get('Svelters_Front_Ui_Route_Cfg$'),
                });
                router.addRoute({
                    path: DEF.ROUTE_FRIEND,
                    component: () => container.get('Svelters_Front_Ui_Route_Friend$'),
                });
                router.addRoute({
                    path: DEF.ROUTE_GROUP,
                    component: () => container.get('Svelters_Front_Ui_Route_Group$'),
                });
                router.addRoute({
                    path: DEF.ROUTE_HOME,
                    component: () => container.get('Svelters_Front_Ui_Route_Home$'),
                    meta: {anonymous: false},
                });
                router.addRoute({
                    path: DEF.ROUTE_MY,
                    component: () => container.get('Svelters_Front_Ui_Route_My$'),
                });
                //
                router.addRoute({
                    path: DEF.ROUTE_NOT_FOUND,
                    component: () => container.get('Svelters_Front_Ui_Route_NotFound$'),
                    meta: {anonymous: true},
                });
                // validate authentication for none anonymous routes
                router.beforeEach((to) => {
                    // instead of having to check every route record with
                    // to.matched.some(record => record.meta.requiresAuth)
                    if (!to.meta.anonymous && !modSess.isValid()) {
                        // this route requires auth
                        return {
                            path: DEF.ROUTE_AUTH_IN,
                            // save the location we were at to come back later
                            query: {[DEF.AUTH_REDIRECT]: to.fullPath},
                        };
                    }
                });
                //
                app.use(router);
                return router;
            }

            // MAIN
            let res = true;
            _print = createPrintout(fnPrintout);
            _print(`TeqFW App is initializing...`);
            // create root vue component
            _root = createApp({
                teq: {package: DEF.SHARED.NAME},
                name: NS,
                data() {
                    return {
                        canDisplay: false
                    };
                },
                template: '<router-view v-if="canDisplay"/><div class="launchpad" v-if="!canDisplay">App is starting...</div>',
                async mounted() {
                    // logger.info(`Started with route: '${JSON.stringify(this.$router.currentRoute.value)}'`);
                    this.canDisplay = true;
                }
            });
            // ... and add global available components
            _root.component('LayoutMain', LayoutMain);

            // other initialization
            await modCfg.init({}); // this app has no separate 'doors' (entry points)
            _print(`Application config is loaded.`);
            try {
                await modSess.init();
                _print(`User session is initialized.`);
                initLogger();
                _print(`Logger transport is initialized.`);
                initQuasarUi(_root, quasar);
                _print(`Quasar UI is initialized.`);
                initRouter(_root, DEF, container);
                await initI18n(_root);
                _print(`Vue app is created and initialized.`);
                _isInitialized = true;
            } catch (e) {
                _print(e?.message);
                res = false;
            }
            return res;
        };

        /**
         * Mount root vue component of the application to DOM element.
         *
         * @see https://v3.vuejs.org/api/application-api.html#mount
         *
         * @param {Element|string} elRoot
         */
        this.mount = function (elRoot) {
            if (_isInitialized) {
                _root.mount(elRoot);
            } else {
                // TODO: inform user
                // const elOut = document.querySelector(elRoot);
            }
        };

        this.reinstall = function (elRoot) {
            _print(`
It is required to reinstall app. Please clean up all data in DevTools 
(F12 / Application / Storage / Clear site data).
Then reload this page.
`);
        };
    }
}
