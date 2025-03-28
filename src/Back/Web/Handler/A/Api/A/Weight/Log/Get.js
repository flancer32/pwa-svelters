/**
 * Route: `/app/api/weight/log/get`
 */
export default class Svelters_Back_Web_Handler_A_Api_A_Weight_Log_Get {
    /**
     * @param {typeof import('node:http2')} http2
     * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger instance
     * @param {TeqFw_Web_Back_Help_Respond} respond - Error response helper
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper - Database transaction wrapper
     * @param {TeqFw_Db_Shared_Dto_List_Selection} dbSelect
     * @param {Svelters_Shared_Web_Api_Weight_Log_Get} endpoint
     * @param {Fl64_OAuth2_Back_Manager} oauth2
     * @param {Svelters_Back_Web_Handler_A_Z_Helper} zHelper
     * @param {Svelters_Back_Store_RDb_Repo_Weight_Log} repoWeight
     * @param {Svelters_Shared_Dto_Weight} dtoItem
     */
    constructor(
        {
            'node:http2': http2,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Back_Help_Respond$: respond,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            TeqFw_Db_Shared_Dto_List_Selection$: dbSelect,
            Svelters_Shared_Web_Api_Weight_Log_Get$: endpoint,
            Fl64_OAuth2_Back_Manager$: oauth2,
            Svelters_Back_Web_Handler_A_Z_Helper$: zHelper,
            Svelters_Back_Store_RDb_Repo_Weight_Log$: repoWeight,
            Svelters_Shared_Dto_Weight$: dtoItem,
        }
    ) {
        // VARS
        const {
            HTTP2_HEADER_CONTENT_TYPE,
        } = http2.constants;
        const DIR = dbSelect.getDirections();
        const COND = dbSelect.getConditions();
        const FUNC = dbSelect.getFunctions();
        const A_WEIGHT = repoWeight.getSchema().getAttributes();
        const RESULT = endpoint.getResultCodes();

        // FUNCS


        /**
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} userId
         * @param {string} dateFrom
         * @param {string} dateTo
         * @returns {Promise<Svelters_Shared_Dto_Weight.Dto[]>}
         */
        async function selectItems(trx, userId, dateFrom, dateTo) {
            // FUNCS
            function composeSelection(userId, dateFrom, dateTo) {
                return dbSelect.createDto({
                    filter: {
                        with: COND.AND,
                        items: [
                            {
                                name: FUNC.EQ,
                                params: [{alias: A_WEIGHT.USER_REF}, {value: userId},]
                            }, {
                                name: FUNC.GTE,
                                params: [{alias: A_WEIGHT.DATE}, {value: dateFrom},]
                            }, {
                                name: FUNC.LTE,
                                params: [{alias: A_WEIGHT.DATE}, {value: dateTo},]
                            }
                        ]
                    },
                    orderBy: [{alias: A_WEIGHT.DATE, dir: DIR.ASC}],
                });
            }

            // MAIN
            const res = [];
            const selection = composeSelection(userId, dateFrom, dateTo);
            const {records} = await repoWeight.readMany({trx, selection});
            for (const record of records) {
                const log = dtoItem.create();
                log.date = record.date;
                log.note = record.note;
                log.value = record.value / 1000; // grams to kilograms
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

            try {
                await trxWrapper.execute(null, async (trx) => {
                    // AUTHORIZATION
                    const {isAuthorized, userId} = await oauth2.authorize({req, trx});
                    if (isAuthorized) {
                        /** @type {Svelters_Shared_Web_Api_Weight_Log_Get.Request} */
                        const payload = zHelper.parseGetParams(req);
                        const dateFrom = payload.dateFrom;
                        const dateTo = payload.dateTo;

                        if (dateFrom && dateTo) {
                            logger.info(`Received a request to retrieve the log records for user #${userId} `
                                + `(period: ${dateFrom}) - ${dateTo}.`);

                            response.items = await selectItems(trx, userId, dateFrom, dateTo);

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
            } catch (e) {
                logger.exception(e);
                respond.code500_InternalServerError({
                    res,
                    body: `Internal server error: ${e?.message}`,
                });
            }
        };
    }
}
