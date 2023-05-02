/**
 * Validate user authentication with WebAuthn API.
 */
// MODULE'S VARS
const NS = 'Svelters_Shared_Web_Api_User_Sign_In_Validate';

// MODULE'S CLASSES
/**
 * @memberOf Svelters_Shared_Web_Api_User_Sign_In_Validate
 */
class Request {
    static namespace = NS;
    /**
     * @type {string}
     * @deprecated
     */
    authenticatorData;
    /**
     * @type {string}
     * @deprecated
     */
    clientDataJSON;
    /**
     * @type {string}
     * @deprecated
     */
    signature;
    /** @type {Svelters_Shared_Dto_WebAuthn_Assert.Dto} */
    assert;
}

/**
 * @memberOf Svelters_Shared_Web_Api_User_Sign_In_Validate
 */
class Response {
    static namespace = NS;
    /** @type {boolean} */
    success;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Svelters_Shared_Web_Api_User_Sign_In_Validate {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castBoolean|function} */
        const castBoolean = spec['TeqFw_Core_Shared_Util_Cast.castBoolean'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];
        /** @type {Svelters_Shared_Dto_WebAuthn_Assert} */
        const dtoAssert = spec['Svelters_Shared_Dto_WebAuthn_Assert$'];

        // INSTANCE METHODS

        /**
         * @param {Svelters_Shared_Web_Api_User_Sign_In_Validate.Request} [data]
         * @return {Svelters_Shared_Web_Api_User_Sign_In_Validate.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.authenticatorData = castString(data?.authenticatorData);
            res.clientDataJSON = castString(data?.clientDataJSON);
            res.signature = castString(data?.signature);
            res.assert = dtoAssert.createDto(data?.assert);
            return res;
        };

        /**
         * @param {Svelters_Shared_Web_Api_User_Sign_In_Validate.Response} [data]
         * @returns {Svelters_Shared_Web_Api_User_Sign_In_Validate.Response}
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
