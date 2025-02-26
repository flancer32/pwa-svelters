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
export default class Svelters_Back_Web_Handler_A_Api {
    /**
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger instance
     * @param {TeqFw_Web_Back_Help_Respond} respond - Error response helper
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper - Database transaction wrapper
     * @param {Fl64_Web_Session_Back_Manager} mgrSession - Session manager
     * @param {Svelters_Back_Web_Handler_A_Api_A_Calorie_Log_Draft_Save} aCalorieLogDraftSave
     * @param {Svelters_Back_Web_Handler_A_Api_A_Profile_Get} aProfileGet
     * @param {Svelters_Back_Web_Handler_A_Api_A_Profile_Update} aProfileUpdate
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Back_Help_Respond$: respond,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Fl64_Web_Session_Back_Manager$: mgrSession,
            Svelters_Back_Web_Handler_A_Api_A_Calorie_Log_Draft_Save$: aCalorieLogDraftSave,
            Svelters_Back_Web_Handler_A_Api_A_Profile_Get$: aProfileGet,
            Svelters_Back_Web_Handler_A_Api_A_Profile_Update$: aProfileUpdate,
        }
    ) {
        // VARS

        // MAIN
        /**
         * Handles incoming HTTP requests.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object
         *
         * @return {Promise<void>}
         */
        this.run = async function (req, res) {
            // FUNCS
            // MAIN
            const url = new URL(req.url, `https://${req.headers.host}`);
            const parts = url.pathname.split('/'); // /app/api/...
            if (
                ((req.method === HTTP2_METHOD_POST) || (req.method === HTTP2_METHOD_GET))
                && (parts[2] === DEF.SHARED.ROUTE_API)
            ) {
                if ((parts[3] === 'calorie') && (parts[4] === 'log')) {
                    // /app/api/calorie/log/draft/...
                    if (parts[5] === 'draft') {
                        if (parts[6] === 'save') await aCalorieLogDraftSave.run(req, res);
                    }
                } else if (parts[3] === 'profile') {
                    // /app/api/profile/...
                    if (parts[4] === 'get') await aProfileGet.run(req, res);
                    else if (parts[4] === 'update') await aProfileUpdate.run(req, res);
                }
            }
        };

    }
}
