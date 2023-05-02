/**
 * Create a new challenge for user sign-in.
 */
// MODULE'S VARS
const NS = 'Svelters_Shared_Web_Api_WebAuthn_SignIn_Challenge';

// MODULE'S CLASSES
/**
 * @memberOf Svelters_Shared_Web_Api_WebAuthn_SignIn_Challenge
 */
class Request {
    static namespace = NS;
    /** @type {string} */
    attestationId;
}

/**
 * @memberOf Svelters_Shared_Web_Api_WebAuthn_SignIn_Challenge
 */
class Response {
    static namespace = NS;
    /**
     * Base64url encoded value.
     * @type {string}
     */
    attestationId;
    /**
     * base64url encoded binary data (32 bytes).
     * @type {string}
     */
    challenge;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Svelters_Shared_Web_Api_WebAuthn_SignIn_Challenge {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS

        /**
         * @param {Svelters_Shared_Web_Api_WebAuthn_SignIn_Challenge.Request} [data]
         * @return {Svelters_Shared_Web_Api_WebAuthn_SignIn_Challenge.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.attestationId = castString(data?.attestationId);
            return res;
        };

        /**
         * @param {Svelters_Shared_Web_Api_WebAuthn_SignIn_Challenge.Response} [data]
         * @returns {Svelters_Shared_Web_Api_WebAuthn_SignIn_Challenge.Response}
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
