/**
 * HTTP request handler for account-related routes.
 *
 * Designed for server-side use within the backend.
 * Dispatches incoming requests based on the URL structure and default route settings.
 */
export default class Svelters_Back_Web_Handler_A_Account {
    /**
     * @param {Svelters_Back_Defaults} DEF
     * @param {Svelters_Back_Web_Handler_A_Account_A_Delete} aDelete
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            Svelters_Back_Web_Handler_A_Account_A_Delete$: aDelete,
        }
    ) {
        /**
         * Handles incoming HTTP requests.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object
         *
         * @return {Promise<void>}
         */
        this.run = async function (req, res) {
            const url = new URL(req.url, `https://${req.headers.host}`);
            const parts = url.pathname.split('/'); // /app/account/...
            if (parts[2] === DEF.SHARED.ROUTE_ACCOUNT) {
                if (parts[3] === DEF.SHARED.ROUTE_ACCOUNT_DELETE) {
                    await aDelete.run(req, res);
                }
            }
        };

    }
}
