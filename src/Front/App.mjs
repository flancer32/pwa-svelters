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
    constructor(spec) {
        // EXTRACT DEPS
        /** @type {function} */
        const createApp = spec['TeqFw_Vue_Front_Ext_Vue.createApp'];
        const {createRouter, createWebHashHistory} = spec['TeqFw_Vue_Front_Ext_Router'];
        /** @type {Svelters_Front_Defaults} */
        const DEF = spec['Svelters_Front_Defaults$'];
        /** @type {TeqFw_Di_Shared_Container} */
        const container = spec['TeqFw_Di_Shared_Container$'];
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Ui_Quasar_Front_Lib} */
        const quasar = spec['TeqFw_Ui_Quasar_Front_Lib'];
        // /** @type {TeqFw_Web_Event_Front_Web_Connect_Stream_Open.act|function} */
        // const connReverseOpen = spec['TeqFw_Web_Event_Front_Web_Connect_Stream_Open$'];
        /** @type {TeqFw_Web_Front_Mod_Config} */
        const modCfg = spec['TeqFw_Web_Front_Mod_Config$'];
        /** @type {TeqFw_I18n_Front_Mod_I18n} */
        const modI18n = spec['TeqFw_I18n_Front_Mod_I18n$'];
        // /** @type {TeqFw_Web_Event_Front_Mod_Identity_Front} */
        // const modIdFront = spec['TeqFw_Web_Event_Front_Mod_Identity_Front$'];
        /** @type {Svelters_Front_Ui_Layout_Navigator.vueCompTmpl} */
        const Navigator = spec['Svelters_Front_Ui_Layout_Navigator$'];

        // VARS
        let _isInitialized = false; // application is initialized and can be mounted
        let _print; // function to printout logs to UI or console
        let _root; // root vue component for the application

        // MAIN
        logger.setNamespace(this.constructor.namespace);

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
             * Create processes that start on events.
             * Some processes (authentication) should be subscribed to events before Reverse Stream can be opened.
             * TODO: this should be done using 'teqfw.json' descriptor
             * @param {TeqFw_Di_Shared_Container} container
             */
            async function initEventListeners(container) {
                await container.get('Svelters_Front_Listen_Connect_Manager$');
            }

            /**
             * Setup working languages and fallback language and add translation function to the Vue.
             *
             * @param {Object} app
             * @return {Promise<void>}
             * @memberOf Ra_Mob_Front_App.init
             */
            async function initI18n(app) {
                await modI18n.init(['ru', 'en'], 'en');
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
                    path: DEF.ROUTE_HOME,
                    component: () => container.get('Svelters_Front_Ui_Route_Home$'),
                    meta: {anonymous: true},
                });
                router.addRoute({
                    path: DEF.ROUTE_USER_DEVICE_REGISTER,
                    component: () => container.get('Svelters_Front_Ui_Route_User_Device_Register$'),
                    meta: {anonymous: true},
                });
                router.addRoute({
                    path: DEF.ROUTE_USER_SIGN_UP,
                    component: () => container.get('Svelters_Front_Ui_Route_User_Sign_Up$'),
                    meta: {anonymous: true},
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
            _root.component('Navigator', Navigator);
            // _root.component('layoutDesk', layoutDesk);
            // _root.component('uiSpinner', uiSpinner);
            // other initialization
            await modCfg.init({}); // this app has no separate 'doors' (entry points)
            _print(`Application config is loaded.`);
            // await modIdFront.init();
            // _print(`Front UUID: ${modIdFront.getFrontUuid()}.`);
            try {
                // await initEventListeners(container);
                // _print(`Event listeners are created.`);
                // await connReverseOpen();
                _print(`Stream for backend events is opened.`);
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
                const elLauncher = document.getElementById('launcher');
                elLauncher.remove();
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
