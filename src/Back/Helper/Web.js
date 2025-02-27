import https from 'https';
import querystring from 'querystring';

/**
 * Helper class for performing web requests in this app.
 */
export default class Svelters_Back_Helper_Web {
    /**
     * Constructor for the web helper.
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     */
    constructor(
        {
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
    }
}
