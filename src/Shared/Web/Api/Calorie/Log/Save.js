/**
 * @memberOf Svelters_Shared_Web_Api_Calorie_Log_Save
 */
class Request {
    /** @type {string} */
    date;
    /** @type {Svelters_Shared_Dto_Calorie_Log_Item.Dto[]} */
    items;
}

/**
 * @memberOf Svelters_Shared_Web_Api_Calorie_Log_Save
 */
class Response {
    /**
     * @type {string}
     * @see Svelters_Shared_Web_Api_Calorie_Log_Save.ResultCode
     */
    code;
    /** @type {string} */
    message;
    /** @type {boolean} */
    success;
}

/**
 * @memberOf Svelters_Shared_Web_Api_Calorie_Log_Save
 */
const ResultCode = {
    WRONG_TOTALS: 'WRONG_TOTALS',
};
Object.freeze(ResultCode);

/**
 * @implements Svelters_Shared_Api_Endpoint
 */
export default class Svelters_Shared_Web_Api_Calorie_Log_Save {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast - Utility for type conversions.
     * @param {Svelters_Shared_Dto_Calorie_Log_Item} dtoItem
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
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
            if (data) {
                res.code = cast.enum(data.code, ResultCode);
                res.message = cast.string(data.message);
                res.success = cast.boolean(data.success);
            }
            return res;
        };

        /**
         * @returns {typeof Svelters_Shared_Web_Api_Calorie_Log_Save.ResultCode}
         */
        this.getResultCodes = () => ResultCode;
    }

}
