/**
 * CLI command to run TeqCMS web server.
 * @namespace Svelters_Back_Cli_Cms
 */

// MAIN
/**
 * Factory function for a CLI command that validates OpenAPI specs.
 *
 * @param {typeof import('node:path')} path - Node.js path module
 * @param {Svelters_Back_Defaults} DEF - Global application defaults
 * @param {TeqFw_Core_Back_Config} config - Application configuration service
 * @param {TeqFw_Core_Back_Api_Dto_Command.Factory} fCommand - Factory for CLI command DTOs
 * @param {Fl32_Cms_Back_Cli_Command} cmsCmd
 * @param {Fl32_Web_Back_Dispatcher} dispatcher
 * @param {Fl32_Web_Back_Handler_Static} handStatic
 * @param {Fl64_Auth_Otp_Back_Web_Handler} handOtp
 * @param {Fl64_OAuth2_Back_Web_Handler} handOAuth2
 * @param {Fl64_OAuth2_Social_Back_Web_Handler} handOAuth2Social
 * @param {Fl64_Paypal_Back_Web_Handler} handPayPal
 * @param {Fl64_Web_Session_Back_Web_Handler} handSession
 * @param {Svelters_Back_Web_Handler} handAll
 * @param {Svelters_Back_Web_Handler_404} hand404
 * @param {Svelters_Back_Web_Handler_App} handApp
 * @param {Fl32_Web_Back_Dto_Handler_Source} dtoSource
 *
 * @returns {TeqFw_Core_Back_Api_Dto_Command}
 */
export default function Factory(
    {
        'node:path': path,
        Svelters_Back_Defaults$: DEF,
        TeqFw_Core_Back_Config$: config,
        'TeqFw_Core_Back_Api_Dto_Command.Factory$': fCommand,
        Fl32_Cms_Back_Cli_Command$: cmsCmd,
        Fl32_Web_Back_Dispatcher$: dispatcher,
        Fl32_Web_Back_Handler_Static$: handStatic,
        Fl64_Auth_Otp_Back_Web_Handler$: handOtp,
        Fl64_OAuth2_Back_Web_Handler$: handOAuth2,
        Fl64_OAuth2_Social_Back_Web_Handler$: handOAuth2Social,
        Fl64_Paypal_Back_Web_Handler$: handPayPal,
        Fl64_Web_Session_Back_Web_Handler$: handSession,
        Svelters_Back_Web_Handler$: handAll,
        Svelters_Back_Web_Handler_404$: hand404,
        Svelters_Back_Web_Handler_App$: handApp,
        Fl32_Web_Back_Dto_Handler_Source$: dtoSource,
    }
) {
    // VARS
    const {join} = path;

    // FUNCS
    /**
     * Action executed when the CLI command is invoked.
     *
     * @param {object} opts - Options provided by the CLI environment
     * @returns {Promise<void>}
     */
    async function action(opts) {
        // FUNCS
        /**
         * Initializes the static file handler with multiple source configurations and
         * registers it with the dispatcher.
         *
         * Configures sources for serving static files from various locations, including:
         * - Project `src` directory
         * - Project `web` directory (with default `index.html`)
         * - `node_modules` (for specific packages)
         * - Auth OTP module sources and web assets
         * - TeqFW core, DI, and web modules
         *
         * Each configuration defines the root directory, URL prefix, and allowed subdirectories.
         * After initializing the handler with all sources, it is added to the dispatcher.
         *
         * @returns {Promise<void>}
         */
        async function initHandlerStatic() {
            // FUNCS

            /**
             * @returns {Fl32_Web_Back_Dto_Handler_Source.Dto}
             */
            function cfgNodeModules() {
                // init web handlers and set up the Dispatcher
                const dto = dtoSource.create();
                dto.root = join(config.getPathToRoot(), 'node_modules');
                dto.prefix = '/npm/';
                dto.allow = {
                    '@teqfw/di': ['.']
                };
                return dto;
            }

            /**
             * @returns {Fl32_Web_Back_Dto_Handler_Source.Dto}
             */
            function cfgSrc() {
                // init web handlers and set up the Dispatcher
                const dto = dtoSource.create();
                dto.root = join(config.getPathToRoot(), 'src');
                dto.prefix = '/src/@flancer32/pwa-svelters/';
                dto.allow = {'Front': ['.'], 'Shared': ['.']};
                return dto;
            }

            /**
             * @returns {Fl32_Web_Back_Dto_Handler_Source.Dto}
             */
            function cfgOtpSrc() {
                // init web handlers and set up the Dispatcher
                const dto = dtoSource.create();
                dto.root = join(config.getPathToRoot(), 'node_modules', '@flancer64', 'teq-agave-auth-otp', 'src');
                dto.prefix = '/src/@flancer64/teq-agave-auth-otp/';
                dto.allow = {'Front': ['.'], 'Shared': ['.']};
                return dto;
            }

            /**
             * @returns {Fl32_Web_Back_Dto_Handler_Source.Dto}
             */
            function cfgOtpWeb() {
                // init web handlers and set up the Dispatcher
                const dto = dtoSource.create();
                dto.root = join(config.getPathToRoot(), 'node_modules', '@flancer64', 'teq-agave-auth-otp', 'web');
                dto.prefix = '/web/@flancer64/teq-agave-auth-otp/';
                dto.allow = {'.': ['.']};
                return dto;
            }

            /**
             * @returns {Fl32_Web_Back_Dto_Handler_Source.Dto}
             */
            function cfgStatic() {
                // init web handlers and set up the Dispatcher
                const dto = dtoSource.create();
                dto.root = join(config.getPathToRoot(), 'web');
                dto.prefix = '/';
                dto.allow = {'.': ['.']};
                dto.defaults = ['index.html'];
                return dto;
            }

            /**
             * @returns {Fl32_Web_Back_Dto_Handler_Source.Dto}
             */
            function cfgTeqFwCore() {
                // init web handlers and set up the Dispatcher
                const dto = dtoSource.create();
                dto.root = join(config.getPathToRoot(), 'node_modules', '@teqfw', 'core', 'src');
                dto.prefix = '/src/@teqfw/core/';
                dto.allow = {'Front': ['.'], 'Shared': ['.']};
                return dto;
            }

            /**
             * @returns {Fl32_Web_Back_Dto_Handler_Source.Dto}
             */
            function cfgTeqFwDi() {
                // init web handlers and set up the Dispatcher
                const dto = dtoSource.create();
                dto.root = join(config.getPathToRoot(), 'node_modules', '@teqfw', 'di', 'src');
                dto.prefix = '/src/@teqfw/di/';
                dto.allow = {'.': ['.']};
                return dto;
            }

            /**
             * @returns {Fl32_Web_Back_Dto_Handler_Source.Dto}
             */
            function cfgTeqFwWeb() {
                // init web handlers and set up the Dispatcher
                const dto = dtoSource.create();
                dto.root = join(config.getPathToRoot(), 'node_modules', '@teqfw', 'web', 'src');
                dto.prefix = '/src/@teqfw/web/';
                dto.allow = {'Front': ['.'], 'Shared': ['.']};
                return dto;
            }

            // MAIN
            const sources = [];
            sources.push(cfgSrc());
            sources.push(cfgStatic());
            sources.push(cfgNodeModules());
            sources.push(cfgOtpSrc());
            sources.push(cfgOtpWeb());
            sources.push(cfgTeqFwCore());
            sources.push(cfgTeqFwDi());
            sources.push(cfgTeqFwWeb());
            await handStatic.init({sources});
            dispatcher.addHandler(handStatic);
        }

        // MAIN
        await initHandlerStatic();
        dispatcher.addHandler(hand404);
        dispatcher.addHandler(handAll);
        dispatcher.addHandler(handApp);
        dispatcher.addHandler(handOAuth2);
        dispatcher.addHandler(handOAuth2Social);
        dispatcher.addHandler(handOtp);
        dispatcher.addHandler(handPayPal);
        dispatcher.addHandler(handSession);
        // try to start the CMS web server
        const args = ['node', 'app.js', 'web'];
        await cmsCmd.run(config.getPathToRoot(), args);
    }

    // MAIN
    const res = fCommand.create();
    res.realm = DEF.CLI_PREFIX;
    res.name = 'cms';
    res.desc = 'start TeqCMS as a web server';
    res.action = action;

    return res;
}
