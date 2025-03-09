import https from 'https';
import querystring from 'querystring';
import {constants as H2} from 'node:http2';

// VARS
const {
    HTTP2_HEADER_ACCEPT_LANGUAGE,
} = H2;

/**
 * Helper class for performing web requests in this app.
 */
export default class Svelters_Back_Helper_Web {
    /**
     * Constructor for the web helper.
     *
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger
        }
    ) {

        // FUNCS
        /**
         * Makes an HTTP request and returns structured response data.
         * @param {Object} params - Request parameters.
         * @param {string} params.hostname - The hostname of the server.
         * @param {string} params.path - The path of the resource.
         * @param {string} params.method - The HTTP method (e.g., 'GET', 'POST').
         * @param {Object} [params.body] - The request body (for POST requests).
         * @param {Object} params.headers - Headers to include in the request.
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
         * Performs a GET request.
         * @param {Object} params - Parameters for the GET request.
         * @param {string} params.hostname - The hostname of the server.
         * @param {string} params.path - The path of the resource.
         * @param {Object} [params.headers] - Headers to include in the request.
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
         * Performs a POST request.
         * @param {Object} params - Parameters for the POST request.
         * @param {string} params.hostname - The hostname of the server.
         * @param {string} params.path - The path of the resource.
         * @param {Object} params.payload - The data to send in the request body.
         * @param {Object} params.headers - Headers to include in the request.
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
