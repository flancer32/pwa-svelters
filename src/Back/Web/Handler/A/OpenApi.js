/**
 * Handler for rendering web pages using Mustache templates.
 */
export default class Svelters_Back_Web_Handler_A_OpenApi {
    /**
     * @param {typeof import('node:fs')} fs
     * @param {typeof import('node:path')} path
     * @param {TeqFw_Core_Back_Config} config
     * @param {Fl32_Web_Back_Helper_Respond} respond
     * @param {Fl32_Cms_Back_Config} cfgCms
     */
    constructor(
        {
            'node:fs': fs,
            'node:path': path,
            TeqFw_Core_Back_Config$: config,
            Fl32_Web_Back_Helper_Respond$: respond,
            Fl32_Cms_Back_Config$: cfgCms,
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
                const host = cfgCms.getBaseUrl();
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
         * @return {Promise<boolean>}
         */
        this.run = async function (req, res) {
            const body = getOpenApiSpec();
            respond.code200_Ok({res, body});
            return true;
        };

    }
}
