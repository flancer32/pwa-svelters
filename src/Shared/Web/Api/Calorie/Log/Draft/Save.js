/**
 * @memberOf Svelters_Shared_Web_Api_Calorie_Log_Draft_Save
 */
class Request {
    /** @type {string} */
    date;
    /** @type {Svelters_Shared_Dto_Calorie_Log_Item[]} */
    items;
}

/**
 * @memberOf Svelters_Shared_Web_Api_Calorie_Log_Draft_Save
 */
class Response {
    /** @type {boolean} */
    success;
    /** @type {string} */
    message;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Svelters_Shared_Web_Api_Calorie_Log_Draft_Save {
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
         * @param {Svelters_Shared_Web_Api_Calorie_Log_Draft_Save.Request} [data]
         * @return {Svelters_Shared_Web_Api_Calorie_Log_Draft_Save.Request}
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
         * @param {Svelters_Shared_Web_Api_Calorie_Log_Draft_Save.Response} [data]
         * @returns {Svelters_Shared_Web_Api_Calorie_Log_Draft_Save.Response}
         */
        this.createRes = function (data) {
            const res = new Response();
            if (data) {
                res.success = cast.boolean(data.success);
                res.message = cast.string(data.message);
            }
            return res;
        };
    }

}
