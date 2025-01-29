/**
 * Validate uniqueness for given type of data on backend.
 */
// MODULE'S VARS
const NS = 'Svelters_Shared_Web_Api_Data_Unique';

// MODULE'S CLASSES
/**
 * @memberOf Svelters_Shared_Web_Api_Data_Unique
 */
class Request {
    static namespace = NS;
    /** @type {string} */
    value;
    /** @type {string} see Svelters_Shared_Enum_Data_Type_Unique */
    type;
}

/**
 * @memberOf Svelters_Shared_Web_Api_Data_Unique
 */
class Response {
    static namespace = NS;
    /** @type {boolean} */
    isUnique;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Svelters_Shared_Web_Api_Data_Unique {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast.castBoolean|function} castBoolean
     * @param {TeqFw_Core_Shared_Util_Cast.castEnum|function} castEnum
     * @param {TeqFw_Core_Shared_Util_Cast.castString|function} castString
     * @param {typeof Svelters_Shared_Enum_Data_Type_Unique} TYPE
     */
    constructor(
        {
            'TeqFw_Core_Shared_Util_Cast.castBoolean': castBoolean,
            'TeqFw_Core_Shared_Util_Cast.castEnum': castEnum,
            'TeqFw_Core_Shared_Util_Cast.castString': castString,
            Svelters_Shared_Enum_Data_Type_Unique$: TYPE,
        }) {
        // INSTANCE METHODS

        /**
         * @param {Svelters_Shared_Web_Api_Data_Unique.Request} [data]
         * @return {Svelters_Shared_Web_Api_Data_Unique.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.value = castString(data?.value);
            res.type = castEnum(data?.type, TYPE);
            return res;
        };

        /**
         * @param {Svelters_Shared_Web_Api_Data_Unique.Response} [data]
         * @returns {Svelters_Shared_Web_Api_Data_Unique.Response}
         */
        this.createRes = function (data) {
            // create new DTO
            const res = new Response();
            // cast known attributes
            res.isUnique = castBoolean(data?.isUnique);
            return res;
        };
    }

}
