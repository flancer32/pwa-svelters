/**
 * Helper class for performing web requests in this app.
 */
export default class Svelters_Back_Helper_Web {
    /**
     * Constructor for the web helper.
     *
     * @param {typeof import('node:http2')} http2
     * @param {typeof import('node:https')} https
     * @param {typeof import('querystring')} querystring
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {Fl32_Cms_Back_Config} cfgCms
     */
    constructor(
        {
            'node:http2': http2,
            'node:https': https,
            'node:querystring': querystring,
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl32_Cms_Back_Config$: cfgCms,
        }
    ) {
        // VARS
        const {
            HTTP2_HEADER_ACCEPT_LANGUAGE,
        } = http2.constants;
        const COOKIE = DEF.SHARED.COOKIE_LOCALE;

        // FUNCS
        /**
         * Makes an HTTP request and returns structured response data.
         * @param {object} params - Request parameters.
         * @param {string} params.hostname - The hostname of the server.
         * @param {string} params.path - The path of the resource.
         * @param {string} params.method - The HTTP method (e.g., 'GET', 'POST').
         * @param {object} [params.body] - The request body (for POST requests).
         * @param {object} params.headers - Headers to include in the request.
         * @param {number} params.timeout - Timeout in milliseconds.
         * @returns {Promise<{body: string, headers: Object, statusCode: number}>} - Structured response.
         */
        function makeRequest({hostname, path, method, body = null, headers, timeout}) {
            return new Promise((resolve, reject) => {
                const options = {
                    hostname,
                    path,
                    method,
                    headers,
                };

                logger.info(`Sending ${method} request to ${hostname}${path}`);

                const req = https.request(options, (res) => {
                    let data = '';

                    // Collect response data
                    res.on('data', (chunk) => {
                        data += chunk;
                    });

                    // Handle end of response
                    res.on('end', () => {
                        resolve({
                            body: data,
                            headers: res.headers,
                            statusCode: res.statusCode
                        });
                    });
                });

                // Handle request errors
                req.on('error', (error) => {
                    logger.error(`Request failed: ${error.message}`);
                    reject(new Error(`Request failed: ${error.message}`));
                });

                // Handle timeout
                req.setTimeout(timeout, () => {
                    req.destroy(new Error('Request timed out'));
                });

                // Send the request body for POST
                if (body) {
                    req.write(body);
                }

                req.end();
            });
        }

        // MAIN

        /**
         * Extracts locale and clean path from an HTTP request.
         *
         * Removes optional locale prefix and SPACE segment from the URL path.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request.
         * @returns {{locale: string, cleanPath: string}} - Locale and clean template path.
         */
        this.extractRoutingInfo = function (req) {
            const locale = this.getLocale(req);
            const allowed = cfgCms.getLocaleAllowed();
            const space = DEF.SHARED.SPACE.toLowerCase();

            const path = (req.url || '').split('?')[0]; // remove query string
            const segments = path.split('/').filter(Boolean); // remove empty strings

            let i = 0;

            // Skip locale prefix if present
            if (allowed.includes(segments[i]?.toLowerCase())) i++;

            // Skip SPACE segment if present
            if (segments[i]?.toLowerCase() === space) i++;

            // Collect the rest as clean path
            const cleanPath = '/' + segments.slice(i).join('/');

            return {locale, cleanPath};
        };


        /**
         * Performs a GET request.
         * @param {object} params - Parameters for the GET request.
         * @param {string} params.hostname - The hostname of the server.
         * @param {string} params.path - The path of the resource.
         * @param {object} [params.headers] - Headers to include in the request.
         * @param {number} [params.timeout=5000] - Timeout in milliseconds.
         * @returns {Promise<{body: string, headers: Object, statusCode: number}>} - Structured response.
         */
        this.get = async function ({hostname, path, headers, timeout = 5000}) {
            return makeRequest({
                hostname,
                path,
                method: 'GET',
                headers,
                timeout,
            });
        };

        /**
         * Extracts the locale based on URL prefix, cookies, or Accept-Language header.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request.
         * @returns {string} - Extracted or default locale.
         */
        this.getLocale = function (req) {
            let res = cfgCms.getLocaleBaseWeb();
            const allowed = cfgCms.getLocaleAllowed();
            // Check locale in URL path prefix (e.g., '/ru/', '/en/')
            const url = req.url || '';
            const pathSegments = url.split('/');
            const firstSegment = pathSegments[1]?.toLowerCase();
            if (allowed.includes(firstSegment)) {
                res = firstSegment;
                return res;
            }

            // Check locale in cookies
            const cookies = req.headers.cookie || '';
            const matcher = new RegExp(`${COOKIE}=([^;]+)`);
            const cookieMatch = cookies.match(matcher);
            if (cookieMatch) {
                const cookieLocale = cookieMatch[1];
                if (allowed.includes(cookieLocale)) {
                    res = cookieLocale;
                    return res;
                }
            }

            // Check locale in Accept-Language header
            const acceptLanguage = req.headers[HTTP2_HEADER_ACCEPT_LANGUAGE];
            if (acceptLanguage) {
                const locales = acceptLanguage
                    .split(',')
                    .map((lang) => lang.split(';')[0].trim().split('-')[0].toLowerCase());
                const validLocale = locales.find((locale) => allowed.includes(locale));
                if (validLocale) {
                    res = validLocale;
                    return res;
                }
            }

            // Fallback to default
            return res;
        };

        /**
         * Performs a POST request.
         * @param {object} params - Parameters for the POST request.
         * @param {string} params.hostname - The hostname of the server.
         * @param {string} params.path - The path of the resource.
         * @param {object} params.payload - The data to send in the request body.
         * @param {object} params.headers - Headers to include in the request.
         * @param {number} [params.timeout=5000] - Timeout in milliseconds.
         * @returns {Promise<{body: string, headers: Object, statusCode: number}>} - Structured response.
         */
        this.post = async function ({hostname, path, payload, headers, timeout = 10000}) {
            let body;
            if (headers['Content-Type'] === 'application/json') body = JSON.stringify(payload);
            else if (headers['Content-Type'] === 'application/x-www-form-urlencoded') body = querystring.stringify(payload);
            else body = payload;

            return makeRequest({
                hostname,
                path,
                method: 'POST',
                body,
                headers: {
                    ...headers,
                    'Content-Length': Buffer.byteLength(body),
                },
                timeout,
            });
        };


    }
}
