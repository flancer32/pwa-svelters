/**
 * Get password salt.
 */
// MODULE'S VARS
const NS = 'Svelters_Shared_Web_Api_User_Sign_In_GetSalt';

// MODULE'S CLASSES
/**
 * @memberOf Svelters_Shared_Web_Api_User_Sign_In_GetSalt
 */
class Request {
    static namespace = NS;
    /** @type {string} */
    email;
}

/**
 * @memberOf Svelters_Shared_Web_Api_User_Sign_In_GetSalt
 */
class Response {
    static namespace = NS;
    /**
     * HEX string of password salt.
     * @type {string}
     */
    salt;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Svelters_Shared_Web_Api_User_Sign_In_GetSalt {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS

        /**
         * @param {Svelters_Shared_Web_Api_User_Sign_In_GetSalt.Request} [data]
         * @return {Svelters_Shared_Web_Api_User_Sign_In_GetSalt.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.email = castString(data?.email);
            return res;
        };

        /**
         * @param {Svelters_Shared_Web_Api_User_Sign_In_GetSalt.Response} [data]
         * @returns {Svelters_Shared_Web_Api_User_Sign_In_GetSalt.Response}
         */
        this.createRes = function (data) {
            // create new DTO
            const res = new Response();
            // cast known attributes
            res.salt = castString(data?.salt);
            return res;
        };
    }

}
