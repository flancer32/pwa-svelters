/**
 * Close the session for the current user.
 */
// MODULE'S VARS
const NS = 'Svelters_Shared_Web_Api_User_Session_Close';

// MODULE'S CLASSES
/**
 * @memberOf Svelters_Shared_Web_Api_User_Session_Close
 */
class Request {
    static namespace = NS;
}

/**
 * @memberOf Svelters_Shared_Web_Api_User_Session_Close
 */
class Response {
    static namespace = NS;
    /** @type {boolean} */
    success;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Svelters_Shared_Web_Api_User_Session_Close {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castBoolean|function} */
        const castBoolean = spec['TeqFw_Core_Shared_Util_Cast.castBoolean'];

        // INSTANCE METHODS

        /**
         * @param {Svelters_Shared_Web_Api_User_Session_Close.Request} [data]
         * @return {Svelters_Shared_Web_Api_User_Session_Close.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            return res;
        };

        /**
         * @param {Svelters_Shared_Web_Api_User_Session_Close.Response} [data]
         * @returns {Svelters_Shared_Web_Api_User_Session_Close.Response}
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
