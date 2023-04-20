/**
 * Generate sign up challenge.
 */
// MODULE'S VARS
const NS = 'TeqFw_Web_Api_Shared_Api_Endpoint';

// MODULE'S CLASSES
/**
 * @memberOf Svelters_Shared_Web_Api_SignUp_Challenge
 */
class Request {
    static namespace = NS;
    /** @type {string} */
    userName;
}

/**
 * @memberOf Svelters_Shared_Web_Api_SignUp_Challenge
 */
class Response {
    static namespace = NS;
    /**
     * base64url encoded binary data.
     * @type {string}
     */
    challenge;
    /** @type {string} */
    relyingPartyName;
    /**
     * Unique identifier for the user (login, email, phone, ...).
     * @type {string}
     */
    userName;
    /**
     * UUID for the user.
     * @type {string}
     */
    userUuid;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Svelters_Shared_Web_Api_SignUp_Challenge {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS

        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.userName = castString(data?.userName);
            return res;
        };

        /**
         * @param {*} data
         * @returns {Svelters_Shared_Web_Api_SignUp_Challenge.Response}
         */
        this.createRes = function (data) {
            // create new DTO
            const res = new Response();
            // cast known attributes
            res.challenge = castString(data?.challenge);
            res.relyingPartyName = castString(data?.relyingPartyName);
            res.userName = castString(data?.userName);
            res.userUuid = castString(data?.userUuid);
            return res;
        };
    }

}
