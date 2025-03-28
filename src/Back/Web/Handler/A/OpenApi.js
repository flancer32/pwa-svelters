/**
 * Handler for rendering web pages using Mustache templates.
 */
export default class Svelters_Back_Web_Handler_A_OpenApi {
    /**
     * @param {typeof import('node:fs')} fs
     * @param {typeof import('node:path')} path
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Back_Config} config
     * @param {TeqFw_Web_Back_Help_Respond} respond
     */
    constructor(
        {
            'node:fs': fs,
            'node:path': path,
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Back_Config$: config,
            TeqFw_Web_Back_Help_Respond$: respond,
        }
    ) {
        // VARS
        const {readFileSync} = fs;
        const {join} = path;

        /**
         * Cached OpenAPI specification with replaced variables.
         * The value is initialized on the first call to `getOpenApiSpec()`.
         *
         * @type {string}
         */
        let SPEC;

        // MAIN

        /**
         * Load and return the OpenAPI specification as a string with placeholders resolved.
         *
         * Replaces all `{{HOST}}` occurrences in the raw template with the current base URL from configuration.
         * Caches the result on first call.
         *
         * @returns {string} OpenAPI specification with resolved values
         */
        function getOpenApiSpec() {
            if (!SPEC) {
                /** @type {TeqFw_Web_Back_Plugin_Dto_Config_Local.Dto} */
                const cfgWeg = config.getLocal(DEF.MOD_WEB.SHARED.NAME);
                const host = cfgWeg.urlBase;
                const root = config.getPathToRoot();
                const path = join(root, 'etc', 'openapi.json');
                const tmpl = readFileSync(path, 'utf8');
                SPEC = tmpl.replace(/\{\{HOST\}\}/g, host);
            }
            return SPEC;
        }


        /**
         * Handles incoming HTTP requests.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object
         *
         * @return {Promise<void>}
         */
        this.run = async function (req, res) {
            const body = getOpenApiSpec();
            respond.code200_Ok({res, body});
        };

    }
}
