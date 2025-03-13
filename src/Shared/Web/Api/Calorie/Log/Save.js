/**
 * Save a draft of a calorie log.
 *
 * This endpoint allows users to save a draft of their calorie log for a specific date,
 * including a list of consumed items.
 *
 * @implements Svelters_Shared_Api_Endpoint
 */
export default class Svelters_Shared_Web_Api_Calorie_Log_Save {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast - Utility for type conversions.
     * @param {Svelters_Shared_Dto_Web_Api_Response_Meta} dtoMeta
     * @param {Svelters_Shared_Dto_Calorie_Log_Item} dtoItem
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
            Svelters_Shared_Dto_Web_Api_Response_Meta$: dtoMeta,
            Svelters_Shared_Dto_Calorie_Log_Item$: dtoItem,
        }
    ) {
        // INSTANCE METHODS

        /**
         * @param {Svelters_Shared_Web_Api_Calorie_Log_Save.Request} [data]
         * @return {Svelters_Shared_Web_Api_Calorie_Log_Save.Request}
         */
        this.createReq = function (data) {
            const res = new Request();
            if (data) {
                res.date = cast.string(data.date);
                res.items = cast.arrayOfObj(data.items, dtoItem.create);
            }
            return res;
        };

        /**
         * @param {Svelters_Shared_Web_Api_Calorie_Log_Save.Response} [data]
         * @returns {Svelters_Shared_Web_Api_Calorie_Log_Save.Response}
         */
        this.createRes = function (data) {
            const res = new Response();
            // Create DTO properties even without initial data.
            res.meta = dtoMeta.create(data?.meta);
            return res;
        };

        /**
         * @returns {typeof Svelters_Shared_Web_Api_Calorie_Log_Save.ResultCode}
         */
        this.getResultCodes = () => ResultCode;
    }
}

/**
 * @memberOf Svelters_Shared_Web_Api_Calorie_Log_Save
 */
class Request {
    /**
     * The date of the calorie log in YYYY-MM-DD format.
     * @type {string}
     */
    date;

    /**
     * List of calorie log items.
     * @type {Svelters_Shared_Dto_Calorie_Log_Item.Dto[]}
     */
    items;
}

/**
 * @memberOf Svelters_Shared_Web_Api_Calorie_Log_Save
 */
class Response {
    /**
     * Standard structure for transmitting information to GPT-chat about the request processing results.
     * @type {Svelters_Shared_Dto_Web_Api_Response_Meta.Dto}
     */
    meta;
}

/**
 * @memberOf Svelters_Shared_Web_Api_Calorie_Log_Save
 */
const ResultCode = {
    /**
     * User's subscription has expired, preventing log save.
     */
    SUBSCRIPTION_EXPIRED: 'SUBSCRIPTION_EXPIRED',
    /**
     * The operation was successful, and the calorie log was saved correctly.
     */
    SUCCESS: 'SUCCESS',

    /**
     * An unknown error occurred during the request processing.
     * This may indicate a server-side issue or an unexpected condition.
     */
    UNKNOWN: 'UNKNOWN',

    /**
     * The provided total calorie values do not match the expected results.
     * This could be due to incorrect calculations or discrepancies in the submitted data.
     */
    WRONG_TOTALS: 'WRONG_TOTALS',
};
Object.freeze(ResultCode);


