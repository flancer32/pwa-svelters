/**
 * Register new identity (email or phone) on backend.
 */
// MODULE'S VARS
const NS = 'Svelters_Shared_Web_Api_User_Sign_Up_Register';

// MODULE'S CLASSES
/**
 * @memberOf Svelters_Shared_Web_Api_User_Sign_Up_Register
 */
class Request {
    static namespace = NS;
    /** @type {string} */
    email;
}

/**
 * @memberOf Svelters_Shared_Web_Api_User_Sign_Up_Register
 */
class Response {
    static namespace = NS;
    /** @type {boolean} */
    success;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Svelters_Shared_Web_Api_User_Sign_Up_Register {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castBoolean|function} */
        const castBoolean = spec['TeqFw_Core_Shared_Util_Cast.castBoolean'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS

        /**
         * @param {Svelters_Shared_Web_Api_User_Sign_Up_Register.Request} [data]
         * @return {Svelters_Shared_Web_Api_User_Sign_Up_Register.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.email = castString(data?.email);
            return res;
        };

        /**
         * @param {Svelters_Shared_Web_Api_User_Sign_Up_Register.Response} [data]
         * @returns {Svelters_Shared_Web_Api_User_Sign_Up_Register.Response}
         */
        this.createRes = function (data) {
            // create new DTO
            const res = new Response();
            // cast known attributes
            res.success = castBoolean(data?.success);
            return res;
        };
    }

}
