/**
 * Get challenge for user authentication from backend.
 */
// MODULE'S VARS
const NS = 'Svelters_Shared_Web_Api_SignIn_Challenge';

// MODULE'S CLASSES
/**
 * @memberOf Svelters_Shared_Web_Api_SignIn_Challenge
 */
class Request {
    static namespace = NS;
    /** @type {string} */
    userName;
}

/**
 * @memberOf Svelters_Shared_Web_Api_SignIn_Challenge
 */
class Response {
    static namespace = NS;
    /** @type {string} */
    attestationId;
    /**
     * Base64 url encoded challenge.
     * @type {string}
     */
    challenge;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Svelters_Shared_Web_Api_SignIn_Challenge {
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
         * @returns {Svelters_Shared_Web_Api_SignIn_Challenge.Response}
         */
        this.createRes = function (data) {
            // create new DTO
            const res = new Response();
            // cast known attributes
            res.attestationId = castString(data?.attestationId);
            res.challenge = castString(data?.challenge);
            return res;
        };
    }

}
