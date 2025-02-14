import {constants as H2} from 'node:http2';

// VARS
const {
    HTTP2_HEADER_CONTENT_TYPE,
} = H2;

/**
 * TODO: add JSDoc
 */
export default class Svelters_Back_Web_Handler_A_Api_A_Calorie_Log_Draft_Save {
    /**
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger instance
     * @param {TeqFw_Web_Back_App_Server_Respond} respond - Error response helper
     * @param {Fl64_Web_Session_Back_Manager} mgrSession - Session manager
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper - Database transaction wrapper
     * @param {Svelters_Back_Store_RDb_Repo_Calorie_Log_Draft} repoDraft
     * @param {Svelters_Back_Web_Handler_A_Z_Helper} zHelper
     * @param {Svelters_Shared_Web_Api_Calorie_Log_Draft_Save} endpointDraftSave
     * @param {Fl64_Web_Session_Back_Manager} session
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Back_App_Server_Respond$: respond,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Svelters_Back_Store_RDb_Repo_Calorie_Log_Draft$: repoDraft,
            Svelters_Back_Web_Handler_A_Z_Helper$: zHelper,
            Svelters_Shared_Web_Api_Calorie_Log_Draft_Save$: endpointDraftSave,
            Fl64_Web_Session_Back_Manager$: session,
        }
    ) {
        // VARS
        const A_DRAFT = repoDraft.getSchema().getAttributes();

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
            // VARS
            // FUNCS
            // MAIN
            const response = endpointDraftSave.createRes();
            response.success = false;
            /** @type {Svelters_Shared_Web_Api_Calorie_Log_Draft_Save.Request} */
            const body = await zHelper.parsePostedData(req);
            const date = body.date;
            const USER_REF = 2;
            try {
                await trxWrapper.execute(null, async (trx) => {
                    // get user ID by session
                    const boo = await session.getFromRequest({trx, req});
                    // lookup for the data for the date
                    const key = {[A_DRAFT.USER_REF]: USER_REF, [A_DRAFT.DATE]: date};
                    const {record: found} = await repoDraft.readOne({trx, key});
                    if (!found) {
                        const dto = repoDraft.createDto();
                        dto.date = new Date(`${date}T00:00:00.000Z`);
                        dto.date_created = new Date();
                        dto.date_updated = new Date();
                        dto.items = JSON.stringify(body.items);
                        dto.user_ref = USER_REF;
                        const {primaryKey} = await repoDraft.createOne({trx, dto});
                        logger.info(`New calorie draft log is created for user #${USER_REF}, date '${date}'.`);
                        if (primaryKey) response.success = true;
                    } else {
                        found.items = JSON.stringify(body.items);
                        found.date_updated = new Date();
                        const {updatedCount} = await repoDraft.updateOne({trx, updates: found});
                        if (updatedCount === 1) {
                            logger.info(`Existing calorie draft log is updated for user #${USER_REF}, date '${date}'.`);
                            response.success = true;
                        }
                    }

                });
                respond.status200(res, JSON.stringify(response), {[HTTP2_HEADER_CONTENT_TYPE]: 'application/json'});
            } catch (e) {
                logger.exception(e);
                respond.status500(res, e);
            }
        };

    }
}
