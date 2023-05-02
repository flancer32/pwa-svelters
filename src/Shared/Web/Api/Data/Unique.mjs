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
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castBoolean|function} */
        const castBoolean = spec['TeqFw_Core_Shared_Util_Cast.castBoolean'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castEnum|function} */
        const castEnum = spec['TeqFw_Core_Shared_Util_Cast.castEnum'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];
        /** @type {typeof Svelters_Shared_Enum_Data_Type_Unique} */
        const TYPE = spec['Svelters_Shared_Enum_Data_Type_Unique$'];

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
