/**
 * Dispatcher for handling authentication-related HTTP requests.
 * @implements Fl32_Web_Back_Api_Handler
 */
export default class Svelters_Back_Web_Handler {
    /**
     * Initializes the handler with required dependencies.
     *
     * @param {typeof import('node:http2')} http2
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {Fl32_Web_Back_Helper_Respond} respond
     * @param {Svelters_Back_Helper_Web} helpWeb
     * @param {Fl32_Web_Back_Dto_Handler_Info} dtoInfo
     * @param {Svelters_Back_Web_Handler_A_Account} aAccount
     * @param {Svelters_Back_Web_Handler_A_Api} aApi
     * @param {Svelters_Back_Web_Handler_A_Home} aHome
     * @param {Svelters_Back_Web_Handler_A_Login} aLogin
     * @param {Svelters_Back_Web_Handler_A_OpenApi} aOpenApi
     * @param {Svelters_Back_Web_Handler_A_Page} aPage
     * @param {Svelters_Back_Web_Handler_A_Register} aRegister
     * @param {Svelters_Back_Web_Handler_A_Subscribe} aSubscribe
     * @param {typeof Fl32_Web_Back_Enum_Stage} STAGE
     */
    constructor(
        {
            'node:http2': http2,
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl32_Web_Back_Helper_Respond$: respond,
            Svelters_Back_Helper_Web$: helpWeb,
            Fl32_Web_Back_Dto_Handler_Info$: dtoInfo,
            Svelters_Back_Web_Handler_A_Account$: aAccount,
            Svelters_Back_Web_Handler_A_Api$: aApi,
            Svelters_Back_Web_Handler_A_Home$: aHome,
            Svelters_Back_Web_Handler_A_Login$: aLogin,
            Svelters_Back_Web_Handler_A_OpenApi$: aOpenApi,
            Svelters_Back_Web_Handler_A_Page$: aPage,
            Svelters_Back_Web_Handler_A_Register$: aRegister,
            Svelters_Back_Web_Handler_A_Subscribe$: aSubscribe,
            Fl32_Web_Back_Enum_Stage$: STAGE,
        }
    ) {
        // VARS
        const {
            HTTP2_METHOD_GET,
            HTTP2_METHOD_POST,
        } = http2.constants;

        const _info = dtoInfo.create();
        _info.name = this.constructor.name;
        _info.stage = STAGE.PROCESS;
        _info.before = ['Fl32_Cms_Back_Web_Handler_Template'];
        Object.freeze(_info);

        // MAIN

        /** @returns {Fl32_Web_Back_Dto_Handler_Info.Dto} */
        this.getRegistrationInfo = () => _info;

        /**
         * @param {import('http').IncomingMessage|import('http2').Http2ServerRequest} req
         * @param {import('http').ServerResponse|import('http2').Http2ServerResponse} res
         * @returns {Promise<boolean>}
         */
        this.handle = async function (req, res) {
            if (!respond.isWritable(res)) return false;

            const {cleanPath} = helpWeb.extractRoutingInfo(req);
            const endpoint = cleanPath.split('/')[1];

            switch (endpoint) {
                case DEF.ROUTE_OPENAPI:
                    return aOpenApi.run(req, res);
                case DEF.SHARED.ROUTE_ACCOUNT:
                    return aAccount.run(req, res);
                case DEF.SHARED.ROUTE_API:
                    return aApi.run(req, res);
                case DEF.SHARED.ROUTE_DASHBOARD:
                    respond.code301_MovedPermanently({
                        res,
                        headers: {
                            Location: `/${DEF.SHARED.SPACE}/${DEF.SHARED.ROUTE_ACCOUNT}/${DEF.SHARED.ROUTE_ACCOUNT_DASHBOARD}/`,
                        }
                    });
                    break;
                case DEF.SHARED.ROUTE_LOGIN:
                    return aLogin.run(req, res);
                case DEF.SHARED.ROUTE_REGISTER:
                    return aRegister.run(req, res);
                case DEF.SHARED.ROUTE_SUBSCRIBE:
                    return aSubscribe.run(req, res);
                // default:
                //     await aPage.run(req, res, relativePath);
            }
        };

    }
}
