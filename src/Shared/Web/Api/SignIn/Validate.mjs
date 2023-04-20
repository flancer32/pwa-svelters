/**
 * Validate authentication results (signature).
 */
// MODULE'S VARS
const NS = 'Svelters_Shared_Web_Api_SignIn_Validate';

// MODULE'S CLASSES
/**
 * @memberOf Svelters_Shared_Web_Api_SignIn_Validate
 */
class Request {
    static namespace = NS;
    /** @type {string} */
    authenticatorData;
    /** @type {string} */
    clientDataJSON;
    /** @type {string} */
    signature;
}

/**
 * @memberOf Svelters_Shared_Web_Api_SignIn_Validate
 */
class Response {
    static namespace = NS;
    /** @type {boolean} */
    success;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Svelters_Shared_Web_Api_SignIn_Validate {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castBoolean|function} */
        const castBoolean = spec['TeqFw_Core_Shared_Util_Cast.castBoolean'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS

        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.authenticatorData = castString(data?.authenticatorData);
            res.clientDataJSON = castString(data?.clientDataJSON);
            res.signature = castString(data?.signature);
            return res;
        };

        /**
         * @param {*} data
         * @returns {Svelters_Shared_Web_Api_SignIn_Validate.Response}
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
