/**
 * @memberOf Svelters_Shared_Web_Api_Calorie_Log_Get
 */
class Request {
    /**
     * The start date of the period (inclusive). Format: YYYY-MM-DD.
     * @type {string}
     */
    dateFrom;
    /**
     * The end date of the period (inclusive). Format: YYYY-MM-DD.
     * @type {string}
     */
    dateTo;
}


/**
 * @memberOf Svelters_Shared_Web_Api_Calorie_Log_Get
 */
class Response {
    /**
     * Calorie logs for the requested period that are in draft records.
     * @type {Svelters_Shared_Dto_Calorie_Log.Dto[]}
     */
    draftLogs;

    /**
     * Calorie logs for the requested period that are finalized.
     * @type {Svelters_Shared_Dto_Calorie_Log.Dto[]}
     */
    finalLogs;

    /**
     * Standard structure for transmitting information to GPT-chat about the request processing results.
     * @type {Svelters_Shared_Dto_Web_Api_Response_Meta.Dto}
     */
    meta;
}

/**
 * @memberOf Svelters_Shared_Web_Api_Calorie_Log_Get
 */
const ResultCode = {
    /**
     * All available log records are got..
     */
    SUCCESS: 'SUCCESS',
    /**
     * Initial error code. Should not appear in results during normal operation.
     */
    UNKNOWN: 'UNKNOWN',
};
Object.freeze(ResultCode);

/**
 * @implements Svelters_Shared_Api_Endpoint
 */
export default class Svelters_Shared_Web_Api_Calorie_Log_Get {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast - Utility for type conversions.
     * @param {Svelters_Shared_Helper_Cast} castApp
     * @param {Svelters_Shared_Dto_Web_Api_Response_Meta} dtoMeta
     * @param {Svelters_Shared_Dto_Calorie_Log} dtoLog
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
            Svelters_Shared_Helper_Cast$: castApp,
            Svelters_Shared_Dto_Web_Api_Response_Meta$: dtoMeta,
            Svelters_Shared_Dto_Calorie_Log$: dtoLog,
        }
    ) {
        // INSTANCE METHODS

        /**
         * @param {Svelters_Shared_Web_Api_Calorie_Log_Get.Request} [data]
         * @return {Svelters_Shared_Web_Api_Calorie_Log_Get.Request}
         */
        this.createReq = function (data) {
            const res = new Request();
            // Create DTO properties even without initial data.
            res.dateFrom = castApp.dateString(data?.dateFrom);
            res.dateTo = castApp.dateString(data?.dateTo);
            return res;
        };

        /**
         * @param {Svelters_Shared_Web_Api_Calorie_Log_Get.Response} [data]
         * @returns {Svelters_Shared_Web_Api_Calorie_Log_Get.Response}
         */
        this.createRes = function (data) {
            const res = new Response();
            // Create DTO properties even without initial data.
            res.draftLogs = cast.arrayOfObj(data?.draftLogs, dtoLog.create);
            res.finalLogs = cast.arrayOfObj(data?.finalLogs, dtoLog.create);
            res.meta = dtoMeta.create(data?.meta);
            return res;
        };

        /**
         * @returns {typeof Svelters_Shared_Web_Api_Calorie_Log_Get.ResultCode}
         */
        this.getResultCodes = () => ResultCode;
    }

}
