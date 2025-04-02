/**
 * Route: `/app/api/calorie/log/get`
 */
export default class Svelters_Back_Web_Handler_A_Api_A_Calorie_Log_Get {
    /**
     * @param {typeof import('node:http2')} http2
     * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger instance
     * @param {TeqFw_Web_Back_Help_Respond} respond - Error response helper
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper - Database transaction wrapper
     * @param {TeqFw_Db_Shared_Dto_List_Selection} dbSelect
     * @param {Svelters_Shared_Web_Api_Calorie_Log_Get} endpoint
     * @param {Fl64_OAuth2_Back_Manager} oauth2
     * @param {Svelters_Back_Web_Handler_A_Z_Helper} zHelper
     * @param {Svelters_Back_Store_RDb_Repo_Calorie_Log_Draft} repoDraft
     * @param {Svelters_Back_Store_RDb_Repo_Calorie_Log_Final} repoFinal
     * @param {Svelters_Back_Store_RDb_Repo_Calorie_Log_Final_Item} repoFinalItem
     * @param {Svelters_Shared_Dto_Calorie_Log} dtoLog
     * @param {Svelters_Shared_Dto_Calorie_Log_Item} dtoLogItem
     * @param {typeof Svelters_Shared_Enum_Product_Measure_Type} MEASURE
     */
    constructor(
        {
            'node:http2': http2,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Back_Help_Respond$: respond,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            TeqFw_Db_Shared_Dto_List_Selection$: dbSelect,
            Svelters_Shared_Web_Api_Calorie_Log_Get$: endpoint,
            Fl64_OAuth2_Back_Manager$: oauth2,
            Svelters_Back_Web_Handler_A_Z_Helper$: zHelper,
            Svelters_Back_Store_RDb_Repo_Calorie_Log_Draft$: repoDraft,
            Svelters_Back_Store_RDb_Repo_Calorie_Log_Final$: repoFinal,
            Svelters_Back_Store_RDb_Repo_Calorie_Log_Final_Item$: repoFinalItem,
            Svelters_Shared_Dto_Calorie_Log$: dtoLog,
            Svelters_Shared_Dto_Calorie_Log_Item$: dtoLogItem,
            Svelters_Shared_Enum_Product_Measure_Type$: MEASURE,
        }
    ) {
        // VARS
        const {
            HTTP2_HEADER_CONTENT_TYPE,
        } = http2.constants;
        const DIR = dbSelect.getDirections();
        const COND = dbSelect.getConditions();
        const FUNC = dbSelect.getFunctions();
        const A_DRAFT = repoDraft.getSchema().getAttributes();
        const A_FINAL = repoFinal.getSchema().getAttributes();
        const A_FINAL_ITEM = repoFinalItem.getSchema().getAttributes();
        const RESULT = endpoint.getResultCodes();

        // FUNCS


        /**
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} userId
         * @param {string} dateFrom
         * @param {string} dateTo
         * @returns {Promise<Svelters_Shared_Dto_Calorie_Log.Dto[]>}
         */
        async function selectDrafts(trx, userId, dateFrom, dateTo) {
            // FUNCS
            function composeSelection(userId, dateFrom, dateTo) {
                return dbSelect.createDto({
                    filter: {
                        with: COND.AND,
                        items: [
                            {
                                name: FUNC.EQ,
                                params: [{alias: A_DRAFT.USER_REF}, {value: userId},]
                            }, {
                                name: FUNC.GTE,
                                params: [{alias: A_DRAFT.DATE}, {value: dateFrom},]
                            }, {
                                name: FUNC.LTE,
                                params: [{alias: A_DRAFT.DATE}, {value: dateTo},]
                            }
                        ]
                    },
                    orderBy: [{alias: A_DRAFT.DATE, dir: DIR.ASC}],
                });
            }

            // MAIN
            const res = [];
            const selection = composeSelection(userId, dateFrom, dateTo);
            const {records} = await repoDraft.readMany({trx, selection});
            for (const record of records) {
                const log = dtoLog.create();
                log.date = record.date;
                log.dateCommitted = record.date_updated;
                log.totalCalories = 0;
                log.items = [];
                /** @type {Svelters_Shared_Dto_Calorie_Log.Dto[]} */
                const items = JSON.parse(record.items);
                for (const one of items) {
                    const item = dtoLogItem.create(one);
                    if (typeof item.totalCalories === 'number') log.totalCalories += item.totalCalories;
                    log.items.push(item);
                }
                res.push(log);
            }
            return res;
        }


        /**
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} userId
         * @param {string} dateFrom
         * @param {string} dateTo
         * @returns {Promise<Svelters_Shared_Dto_Calorie_Log.Dto[]>}
         */
        async function selectFinal(trx, userId, dateFrom, dateTo) {
            // FUNCS
            function composeSelection(userId, dateFrom, dateTo) {
                return dbSelect.createDto({
                    filter: {
                        with: COND.AND,
                        items: [
                            {
                                name: FUNC.EQ,
                                params: [{alias: A_FINAL.USER_REF}, {value: userId},]
                            }, {
                                name: FUNC.GTE,
                                params: [{alias: A_FINAL.DATE}, {value: dateFrom},]
                            }, {
                                name: FUNC.LTE,
                                params: [{alias: A_FINAL.DATE}, {value: dateTo},]
                            }
                        ]
                    },
                    orderBy: [{alias: A_FINAL.DATE, dir: DIR.ASC}],
                });
            }

            // MAIN
            const res = [];
            const selection = composeSelection(userId, dateFrom, dateTo);
            const {records} = await repoFinal.readMany({trx, selection});
            for (const record of records) {
                const log = dtoLog.create();
                log.date = record.date;
                log.dateCommitted = record.date_committed;
                log.totalCalories = record.total_calories;
                log.items = [];
                // select items
                const conditions = {[A_FINAL_ITEM.LOG_REF]: record.id};
                const {records: items} = await repoFinalItem.readMany({trx, conditions});
                for (const one of items) {
                    const item = dtoLogItem.create();
                    item.food = one.product;
                    item.quantity = one.quantity;
                    item.measure = one.measure;
                    item.unitCalories = one.unit_calories;
                    // calculate totals
                    const quantity = ((item.measure === MEASURE.GRAMS) || (item.measure === MEASURE.MILLILITERS))
                        ? (item.quantity / 100) : item.quantity;
                    item.totalCalories = Math.round(quantity * item.unitCalories);
                    //
                    log.items.push(item);
                }
                res.push(log);
            }
            return res;
        }

        // MAIN
        /**
         * Handles incoming HTTP requests to retrieve user profile data.
         * Validates authorization, loads user and profile data, and sends the response.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object
         *
         * @returns {Promise<void>}
         */
        this.run = async function (req, res) {
            // VARS
            const response = endpoint.createRes();
            response.meta.code = RESULT.UNKNOWN;
            response.meta.ok = false;
            await trxWrapper.execute(null, async (trx) => {
                // AUTHORIZATION
                const {isAuthorized, userId} = await oauth2.authorize({req, trx});
                if (isAuthorized) {
                    /** @type {Svelters_Shared_Web_Api_Calorie_Log_Get.Request} */
                    const payload = zHelper.parseGetParams(req);
                    const dateFrom = payload.dateFrom;
                    const dateTo = payload.dateTo;

                    if (dateFrom && dateTo) {
                        logger.info(`Received a request to retrieve the log records for user #${userId} `
                            + `(period: ${dateFrom}) - ${dateTo}.`);

                        response.draftLogs = await selectDrafts(trx, userId, dateFrom, dateTo);
                        response.finalLogs = await selectFinal(trx, userId, dateFrom, dateTo);

                        // Send the response
                        response.meta.ok = true;
                        response.meta.code = RESULT.SUCCESS;
                        const body = JSON.stringify(response);
                        respond.code200_Ok({
                            res,
                            headers: {[HTTP2_HEADER_CONTENT_TYPE]: 'application/json'},
                            body,
                        });
                        logger.info(`Response sent: ${body}`);
                    } else {
                        respond.code400_BadRequest({res, body: 'Missed or incomplete period.'});
                    }
                } else {
                    respond.code401_Unauthorized({res});
                }
            });
        };
    }
}
