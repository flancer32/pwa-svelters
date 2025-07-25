/**
 * Route: `/app/api/weight/log/get`
 */
export default class Svelters_Back_Web_Handler_A_Api_A_Weight_Log_Get {
    /**
     * @param {typeof import('node:http2')} http2
     * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger instance
     * @param {Fl32_Web_Back_Helper_Respond} respond - Error response helper
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
            Fl32_Web_Back_Helper_Respond$: respond,
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
        const {HTTP2_HEADER_CONTENT_TYPE} = http2.constants;
        const DIR = dbSelect.getDirections();
        const COND = dbSelect.getConditions();
        const FUNC = dbSelect.getFunctions();
        const A_WEIGHT = repoWeight.getSchema().getAttributes();
        const RESULT = endpoint.getResultCodes();

        // FUNCS

        /**
         * Create selection DTO for current weight log entries in a given date range.
         *
         * @param {number} userId
         * @param {string} dateFrom
         * @param {string} dateTo
         * @returns {TeqFw_Db_Shared_Dto_List_Selection.Dto}
         */
        function composeSelection(userId, dateFrom, dateTo) {
            return dbSelect.createDto({
                filter: {
                    with: COND.AND,
                    items: [
                        {
                            name: FUNC.EQ,
                            params: [{alias: A_WEIGHT.USER_REF}, {value: userId}],
                        },
                        {
                            name: FUNC.GTE,
                            params: [{alias: A_WEIGHT.DATE}, {value: dateFrom}],
                        },
                        {
                            name: FUNC.LTE,
                            params: [{alias: A_WEIGHT.DATE}, {value: dateTo}],
                        },
                    ],
                },
                orderBy: [{alias: A_WEIGHT.DATE, dir: DIR.ASC}],
            });
        }

        /**
         * Convert raw record to DTO.
         *
         * @param {object} record
         * @returns {Svelters_Shared_Dto_Weight.Dto}
         */
        function makeItemDto(record) {
            const dto = dtoItem.create();
            dto.date = record.date;
            dto.note = (record.note) ? record.note : undefined;
            dto.value = record.value / 1000; // grams to kilograms
            return dto;
        }

        /**
         * Read current weight entries for user in a given date range.
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} userId
         * @param {string} dateFrom
         * @param {string} dateTo
         * @returns {Promise<Svelters_Shared_Dto_Weight.Dto[]>}
         */
        async function selectItems(trx, userId, dateFrom, dateTo) {
            const selection = composeSelection(userId, dateFrom, dateTo);
            const {records} = await repoWeight.readMany({trx, selection});
            return records.map(makeItemDto);
        }

        // MAIN

        /**
         * Handles HTTP requests to retrieve the user's current weight log history.
         *
         * Validates authorization, parses query parameters, loads weight data for the specified period,
         * and returns a structured response.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object
         * @returns {Promise<boolean>}
         */
        this.run = async function (req, res) {
            const response = endpoint.createRes();
            response.meta.code = RESULT.UNKNOWN;
            response.meta.ok = false;
            return trxWrapper.execute(null, async (trx) => {
                const {isAuthorized, userId} = await oauth2.authorize({req, trx});
                if (isAuthorized) {
                    const {dateFrom, dateTo} = zHelper.parseGetParams(req);

                    if (dateFrom && dateTo) {
                        logger.info(`Received request for current weight log (user #${userId}): ${dateFrom} - ${dateTo}`);

                        response.items = await selectItems(trx, userId, dateFrom, dateTo);
                        response.meta.ok = true;
                        response.meta.code = RESULT.SUCCESS;

                        const body = JSON.stringify(response);
                        respond.code200_Ok({
                            res,
                            headers: {[HTTP2_HEADER_CONTENT_TYPE]: 'application/json'},
                            body,
                        });

                        logger.info(`Response sent with ${response.items.length} current weight entries.`);
                    } else {
                        respond.code400_BadRequest({res, body: 'Missing or incomplete date range.'});
                    }
                } else {
                    respond.code401_Unauthorized({res});
                }
                return true;
            });
        };
    }
}
