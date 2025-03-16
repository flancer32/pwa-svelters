/**
 * Handles the saving of a calorie log draft for a user.
 * This handler validates incoming data, performs authorization,
 * checks the totals of food items, and saves or updates the draft.
 * Route: `/app/api/calorie/log/draft/save`
 */
export default class Svelters_Back_Web_Handler_A_Api_A_Calorie_Log_Save {
    /**
     * @param {typeof import('node:http2')} http2
     * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger instance
     * @param {TeqFw_Web_Back_Help_Respond} respond - Error response helper
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper - Database transaction wrapper
     * @param {Svelters_Shared_Helper_Cast} helpCast
     * @param {Svelters_Back_Store_RDb_Repo_Calorie_Log_Draft} repoDraft
     * @param {Svelters_Back_Store_RDb_Repo_User} repoUser
     * @param {Svelters_Back_Web_Handler_A_Z_Helper} zHelper
     * @param {Svelters_Shared_Web_Api_Calorie_Log_Save} endpointDraftSave
     * @param {Fl64_OAuth2_Back_Manager} oauth2
     * @param {typeof Svelters_Shared_Enum_Product_Measure_Type} MEASURE
     */
    constructor(
        {
            'node:http2': http2,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Back_Help_Respond$: respond,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Svelters_Shared_Helper_Cast$: helpCast,
            Svelters_Back_Store_RDb_Repo_Calorie_Log_Draft$: repoDraft,
            Svelters_Back_Store_RDb_Repo_User$: repoUser,
            Svelters_Back_Web_Handler_A_Z_Helper$: zHelper,
            Svelters_Shared_Web_Api_Calorie_Log_Save$: endpointDraftSave,
            Fl64_OAuth2_Back_Manager$: oauth2,
            'Svelters_Shared_Enum_Product_Measure_Type.default': MEASURE,
        }
    ) {
        // VARS
        const {
            HTTP2_HEADER_CONTENT_TYPE,
        } = http2.constants;
        const A_DRAFT = repoDraft.getSchema().getAttributes();
        const RESULT = endpointDraftSave.getResultCodes();

        // FUNCS
        /**
         * Validates the totals of food items in the calorie log draft.
         * Ensures that the total calories match the calculated value.
         *
         * @param {Svelters_Shared_Dto_Calorie_Log_Item.Dto[]} items - The list of food items.
         * @returns {boolean} - Returns true if the totals are valid, false otherwise.
         */
        function hasValidTotals(items) {
            let res = true;
            for (const item of items) {
                let quantity = item.quantity;
                let unit = item.unitCalories;
                const delta = Math.max(1, unit * 0.05); // Tolerance for rounding errors
                if ((item.measure === MEASURE.GRAMS) || (item.measure === MEASURE.MILLILITERS)) {
                    quantity = (item.quantity / 100); // Convert quantity for grams and milliliters
                }
                const val = Math.round(quantity * unit); // Calculated total calories
                if (Math.abs(val - item.totalCalories) > delta) { // Check if calculated value matches totalCalories
                    res = false;
                    logger.info(`Food item has wrong totals '${item.totalCalories}', expected '${val}' `
                        + `(delta: ${delta}): ${JSON.stringify(item)}`);
                }
            }
            return res;
        }

        // MAIN
        /**
         * Handles incoming HTTP requests to save or update a calorie log draft.
         * Validates input data, checks totals, and processes the request based on authorization.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object
         *
         * @returns {Promise<void>}
         */
        this.run = async function (req, res) {
            // VARS
            const response = endpointDraftSave.createRes();
            response.meta.code = RESULT.UNKNOWN;
            response.meta.ok = false;

            /** @type {Svelters_Shared_Web_Api_Calorie_Log_Save.Request} */
            const payload = await zHelper.parsePostedData(req);
            const date = payload.date;
            try {
                await trxWrapper.execute(null, async (trx) => {
                    // Get authorization info
                    const {isAuthorized, userId} = await oauth2.authorize({req, trx});
                    if (isAuthorized) {
                        logger.info(`Received a request to save a calories log for user #${userId}:`
                            + ` ${JSON.stringify(payload)}`);
                        // verify subscription date
                        const {record: user} = await repoUser.readOne({trx, key: userId});
                        if (user.date_subscription > new Date()) {
                            // Lookup for the data for the date
                            const key = {[A_DRAFT.USER_REF]: userId, [A_DRAFT.DATE]: date};
                            const {record: found} = await repoDraft.readOne({trx, key});

                            if (!found) {
                                // Create new DTO for the calorie log draft
                                const dto = repoDraft.createDto();
                                dto.date = new Date(`${date}T00:00:00.000Z`);
                                dto.date_created = new Date();
                                dto.date_updated = new Date();
                                dto.items = JSON.stringify(payload.items);
                                dto.user_ref = userId;
                                const {primaryKey} = await repoDraft.createOne({trx, dto});
                                logger.info(`New calorie draft log is created for user #${userId}, date '${date}'.`);
                                if (primaryKey) {
                                    response.meta.code = RESULT.SUCCESS;
                                    response.meta.ok = true;
                                }
                            } else {
                                // Update existing calorie log draft
                                found.items = JSON.stringify(payload.items);
                                found.date_updated = new Date();
                                const {updatedCount} = await repoDraft.updateOne({trx, updates: found});
                                if (updatedCount === 1) {
                                    logger.info(`Existing calorie draft log is updated for user #${userId}, date '${date}'.`);
                                    response.meta.code = RESULT.SUCCESS;
                                    response.meta.ok = true;
                                }
                            }

                            // Validate items and report back
                            const valid = hasValidTotals(payload.items);
                            if (!valid) {
                                response.meta.code = RESULT.WRONG_TOTALS;
                                response.meta.message = 'One or more food items have wrong totals.';
                            }

                            // Send the response
                            respond.code200_Ok({
                                res,
                                headers: {[HTTP2_HEADER_CONTENT_TYPE]: 'application/json'},
                                body: JSON.stringify(response)
                            });
                        } else {
                            const date = helpCast.dateString(user.date_subscription);
                            response.meta.code = RESULT.SUBSCRIPTION_EXPIRED;
                            response.meta.message
                                = `The user's subscription expired on ${date}, so the log couldn't be saved.`;
                            // Send the response
                            const body = JSON.stringify(response);
                            respond.code402_PaymentRequired({
                                res,
                                headers: {[HTTP2_HEADER_CONTENT_TYPE]: 'application/json'},
                                body,
                            });
                            logger.info(`Response sent: ${body}`);
                        }
                    } else {
                        respond.code401_Unauthorized({res});
                    }
                });
            } catch (e) {
                logger.exception(e);
                respond.code500_InternalServerError({res, body: e?.message});
            }
        };

    }
}
