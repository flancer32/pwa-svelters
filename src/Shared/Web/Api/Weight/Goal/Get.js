/**
 * API Endpoint: Retrieve user's goal weight history.
 *
 * Accepts a date range and returns a list of goal weight entries
 * within that period, along with processing metadata.
 *
 * @implements Svelters_Shared_Api_Endpoint
 */
export default class Svelters_Shared_Web_Api_Weight_Goal_Get {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast - Utility for type conversions.
     * @param {Svelters_Shared_Helper_Cast} castApp - Application-specific casting helpers.
     * @param {Svelters_Shared_Dto_Web_Api_Response_Meta} dtoMeta - Factory for response metadata.
     * @param {Svelters_Shared_Dto_Weight} dtoItem - Factory for individual goal weight entries.
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
            Svelters_Shared_Helper_Cast$: castApp,
            Svelters_Shared_Dto_Web_Api_Response_Meta$: dtoMeta,
            Svelters_Shared_Dto_Weight$: dtoItem,
        }
    ) {
        // INSTANCE METHODS

        /**
         * Create a request DTO from raw input.
         *
         * @param {Svelters_Shared_Web_Api_Weight_Goal_Get.Request} [data]
         * @return {Svelters_Shared_Web_Api_Weight_Goal_Get.Request}
         */
        this.createReq = function (data) {
            const res = new Request();
            res.dateFrom = castApp.dateString(data?.dateFrom);
            res.dateTo = castApp.dateString(data?.dateTo);
            return res;
        };

        /**
         * Create a response DTO from raw input.
         *
         * @param {Svelters_Shared_Web_Api_Weight_Goal_Get.Response} [data]
         * @returns {Svelters_Shared_Web_Api_Weight_Goal_Get.Response}
         */
        this.createRes = function (data) {
            const res = new Response();
            res.items = cast.arrayOfObj(data?.items, dtoItem.create);
            res.meta = dtoMeta.create(data?.meta);
            return res;
        };

        /**
         * Get available result codes for this API endpoint.
         *
         * @returns {typeof Svelters_Shared_Web_Api_Weight_Goal_Get.ResultCode}
         */
        this.getResultCodes = () => ResultCode;
    }
}

/**
 * @memberOf Svelters_Shared_Web_Api_Weight_Goal_Get
 */
class Request {
    /**
     * Start of the date range (inclusive). Format: YYYY-MM-DD.
     * @type {string}
     */
    dateFrom;

    /**
     * End of the date range (inclusive). Format: YYYY-MM-DD.
     * @type {string}
     */
    dateTo;
}

/**
 * @memberOf Svelters_Shared_Web_Api_Weight_Goal_Get
 */
class Response {
    /**
     * List of goal weight entries for the given date range.
     * @type {Svelters_Shared_Dto_Weight.Dto[]}
     */
    items;

    /**
     * Metadata about the result of the request processing.
     * @type {Svelters_Shared_Dto_Web_Api_Response_Meta.Dto}
     */
    meta;
}

/**
 * @memberOf Svelters_Shared_Web_Api_Weight_Goal_Get
 */
const ResultCode = {
    /**
     * Goal weight entries were successfully retrieved.
     */
    SUCCESS: 'SUCCESS',

    /**
     * An unknown error occurred during request processing.
     */
    UNKNOWN: 'UNKNOWN',
};
Object.freeze(ResultCode);