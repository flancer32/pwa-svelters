import {constants as H2} from 'node:http2';
import {randomUUID} from 'node:crypto';

// VARS
const {
    HTTP2_HEADER_CONTENT_TYPE,
    HTTP2_METHOD_GET,
    HTTP2_METHOD_POST,
} = H2;

/**
 * TODO: add JSDoc
 */
export default class Svelters_Back_Web_Handler_A_Api_A_Calorie_Log {
    /**
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger instance
     * @param {TeqFw_Web_Back_App_Server_Respond} respond - Error response helper
     * @param {Fl64_Web_Session_Back_Manager} mgrSession - Session manager
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper - Database transaction wrapper
     * @param {Fl64_Tmpl_Back_Service_Render} tmplRender
     * @param {Fl64_Auth_Otp_Back_Store_Mem_XsrfToken} memXsrfToken
     * @param {Fl64_OAuth2_Social_Back_Mod_Provider} modProvider - Module for interacting with OAuth2 providers
     * @param {Fl64_OAuth2_Social_Back_Plugin_Registry_Provider} regProviders
     * @param {Fl64_OAuth2_Social_Back_Store_Mem_State} memState
     * @param {Svelters_Back_Store_RDb_Repo_Calorie_Log} repoCalorieLog
     * @param {Svelters_Back_Web_Handler_A_Z_Helper} zHelper
     * @param {typeof Fl64_Tmpl_Back_Enum_Type} TMPL
     * @param {typeof Fl64_OAuth2_Social_Shared_Enum_Provider_Code} PROVIDER
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Back_App_Server_Respond$: respond,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Fl64_Web_Session_Back_Manager$: mgrSession,
            Fl64_Tmpl_Back_Service_Render$: tmplRender,
            Fl64_Auth_Otp_Back_Store_Mem_XsrfToken$: memXsrfToken,
            Fl64_OAuth2_Social_Back_Mod_Provider$: modProvider,
            Fl64_OAuth2_Social_Back_Plugin_Registry_Provider$: regProviders,
            Fl64_OAuth2_Social_Back_Store_Mem_State$: memState,
            Svelters_Back_Store_RDb_Repo_Calorie_Log$: repoCalorieLog,
            Svelters_Back_Web_Handler_A_Z_Helper$: zHelper,
            'Fl64_Tmpl_Back_Enum_Type.default': TMPL,
            'Fl64_OAuth2_Social_Shared_Enum_Provider_Code.default': PROVIDER,
        }
    ) {
        // VARS

        // MAIN
        /**
         * Handles incoming HTTP requests.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object
         * @param {string} operation
         *
         * @return {Promise<void>}
         */
        this.run = async function (req, res, operation) {
            // FUNCS
            /**
             * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request
             * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object
             * @param {Object} body
             * @returns {Promise<void>}
             */
            async function create(req, res, body) {
                await trxWrapper.execute(null, async (trx) => {
                    const dto = repoCalorieLog.createDto();
                    dto.date = '2025-02-11';
                    dto.measure = body.measure;
                    dto.product = body.product;
                    dto.quantity = body.quantity;
                    dto.unit_calories = body.unit_calories;
                    dto.user_ref = 1;
                    const {primaryKey} = await repoCalorieLog.createOne({trx, dto});
                    logger.info(`New calorie log is created: ${JSON.stringify(primaryKey)}.`);
                });
            }

            // MAIN
            const body = await zHelper.parsePostedData(req);
            if (operation === 'create') await create(req, res, body);
        };

    }
}
