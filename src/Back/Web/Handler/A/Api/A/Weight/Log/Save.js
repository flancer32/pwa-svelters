/**
 * Handles saving or updating the user's weight log for a specific date.
 * Validates input data, checks authorization, and interacts with the weight log repository.
 * Route: `/app/api/weight/log/save`
 */
export default class Svelters_Back_Web_Handler_A_Api_A_Weight_Log_Save {
    /**
     * @param {typeof import('node:http2')} http2
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {TeqFw_Web_Back_Help_Respond} respond
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper
     * @param {Svelters_Shared_Helper_Cast} helpCast
     * @param {Svelters_Back_Store_RDb_Repo_Weight_Log} repoWeightLog
     * @param {Svelters_Back_Web_Handler_A_Z_Helper} zHelper
     * @param {Svelters_Shared_Web_Api_Weight_Log_Save} endpointSave
     * @param {Fl64_OAuth2_Back_Manager} oauth2
     */
    constructor(
        {
            'node:http2': http2,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Back_Help_Respond$: respond,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Svelters_Shared_Helper_Cast$: helpCast,
            Svelters_Back_Store_RDb_Repo_Weight_Log$: repoWeightLog,
            Svelters_Back_Web_Handler_A_Z_Helper$: zHelper,
            Svelters_Shared_Web_Api_Weight_Log_Save$: endpointSave,
            Fl64_OAuth2_Back_Manager$: oauth2,
        }
    ) {
        // VARS
        const {
            HTTP2_HEADER_CONTENT_TYPE,
        } = http2.constants;
        const A_WEIGHT = repoWeightLog.getSchema().getAttributes();
        const RESULT = endpointSave.getResultCodes();

        // MAIN

        /**
         * Processes HTTP requests to save or update the user's weight entry.
         * Validates the request payload, checks authorization, and either updates an existing record
         * or creates a new one for the specified date.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object
         *
         * @returns {Promise<void>}
         */
        this.run = async function (req, res) {
            // VARS
            const response = endpointSave.createRes();
            response.meta.code = RESULT.UNKNOWN;
            response.meta.ok = false;

            /** @type {Svelters_Shared_Web_Api_Weight_Log_Save.Request} */
            const payload = await zHelper.parsePostedData(req);
            const dtoWeight = payload.weight;
            await trxWrapper.execute(null, async (trx) => {
                // Get authorization info
                const {isAuthorized, userId} = await oauth2.authorize({req, trx});
                if (isAuthorized) {
                    logger.info(`Received a request to save a weight log for user #${userId}:`
                        + ` ${JSON.stringify(payload)}`);
                    const grams = Math.round(dtoWeight.value * 1000); // Store weight as integer in grams

                    const key = {
                        [A_WEIGHT.DATE]: helpCast.dateString(dtoWeight.date),
                        [A_WEIGHT.USER_REF]: userId,
                    };
                    const {record: updates} = await repoWeightLog.readOne({trx, key});
                    if (updates) {
                        updates.note = dtoWeight.note;
                        updates.value = grams;
                        await repoWeightLog.updateOne({trx, updates});
                        logger.info(`Existing weight log is updated for user #${userId}, date '${updates.date}'.`);
                        response.meta.code = RESULT.SUCCESS_UPDATED;
                    } else {
                        const dto = repoWeightLog.createDto();
                        dto.user_ref = userId;
                        dto.date = helpCast.dateString(dtoWeight.date);
                        dto.note = dtoWeight.note;
                        dto.value = grams;
                        await repoWeightLog.createOne({trx, dto});
                        logger.info(`New weight log is created for user #${userId}, date '${dto.date}'.`);
                        response.meta.code = RESULT.SUCCESS_INSERTED;
                    }
                    response.meta.ok = true;

                    respond.code200_Ok({
                        res,
                        headers: {[HTTP2_HEADER_CONTENT_TYPE]: 'application/json'},
                        body: JSON.stringify(response)
                    });
                } else {
                    respond.code401_Unauthorized({res});
                }
            });
        };

    }
}
