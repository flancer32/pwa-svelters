/**
 * Handles requests for the authentication and authorization processes using one-time passwords (OTP).
 */
import {constants as H2} from 'node:http2';

const {
    HTTP2_METHOD_GET,
    HTTP2_METHOD_POST,
} = H2;

/**
 * Dispatcher for handling authentication-related HTTP requests.
 */
export default class Svelters_Back_Web_Handler {
    /**
     * Initializes the handler with required dependencies.
     *
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {TeqFw_Web_Back_Help_Respond} respond
     * @param {Svelters_Back_Web_Handler_A_Api} aApi
     * @param {Svelters_Back_Web_Handler_A_Home} aHome
     * @param {Svelters_Back_Web_Handler_A_Login} aLogin
     * @param {Svelters_Back_Web_Handler_A_Page} aPage
     * @param {Svelters_Back_Web_Handler_A_Register} aRegister
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Back_Help_Respond$: respond,
            Svelters_Back_Web_Handler_A_Api$: aApi,
            Svelters_Back_Web_Handler_A_Home$: aHome,
            Svelters_Back_Web_Handler_A_Login$: aLogin,
            Svelters_Back_Web_Handler_A_Page$: aPage,
            Svelters_Back_Web_Handler_A_Register$: aRegister,
        }
    ) {
        /**
         * Handles incoming HTTP requests and delegates processing to specific handlers.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         */
        async function process(req, res) {
            try {
                const fullPath = req.url.split('?')[0];
                const baseIndex = fullPath.indexOf(DEF.SHARED.SPACE);
                const relativePath = fullPath.slice(baseIndex + DEF.SHARED.SPACE.length + 1);
                const endpoint = relativePath.split('/')[0];

                switch (endpoint) {
                    case DEF.SHARED.ROUTE_API:
                        await aApi.run(req, res);
                        break;
                    case '':
                        await aHome.run(req, res);
                        break;
                    case DEF.SHARED.ROUTE_LOGIN:
                        await aLogin.run(req, res);
                        break;
                    case DEF.SHARED.ROUTE_REGISTER:
                        await aRegister.run(req, res);
                        break;
                    default:
                        await aPage.run(req, res, relativePath);
                }
            } catch (error) {
                logger.exception(error);
                respond.code500_InternalServerError({res, body: error.message});
            }
        }

        /**
         * Provides the function to process requests.
         * @returns {Function}
         */
        this.getProcessor = () => process;

        /**
         * Placeholder for initialization logic.
         */
        this.init = async function () { };

        /**
         * Checks if the request can be handled by this instance.
         *
         * @param {Object} params
         * @param {string} params.method
         * @param {TeqFw_Web_Back_Dto_Address} params.address
         * @returns {boolean}
         */
        this.canProcess = function ({method, address} = {}) {
            return (
                ((method === HTTP2_METHOD_GET) || (method === HTTP2_METHOD_POST))
                && (
                    (address?.space === DEF.SHARED.SPACE)
                    || ((address?.space === undefined) && (address.route === '/'))
                )
            );
        };
    }
}
