/**
 * Save new attestation with `publicKey` on backend.
 */
// MODULE'S VARS
const NS = 'Svelters_Shared_Web_Api_SignUp_Attestation';

// MODULE'S CLASSES
/**
 * @memberOf Svelters_Shared_Web_Api_SignUp_Attestation
 */
class Request {
    static namespace = NS;
    /**
     * Base64url encoded value.
     * @type {string}
     */
    attestationId;
    /** @type {string} */
    attestationObj;
    /** @type {string} */
    clientData;
    /** @type {string} */
    userName;
}

/**
 * @memberOf Svelters_Shared_Web_Api_SignUp_Attestation
 */
class Response {
    static namespace = NS;
    /** @type {boolean} */
    success;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Svelters_Shared_Web_Api_SignUp_Attestation {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castBoolean|function} */
        const castBoolean = spec['TeqFw_Core_Shared_Util_Cast.castBoolean'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS

        /**
         * @param {Svelters_Shared_Web_Api_SignUp_Attestation.Request} data
         * @return {Svelters_Shared_Web_Api_SignUp_Attestation.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.attestationId = castString(data?.attestationId);
            res.attestationObj = castString(data?.attestationObj);
            res.clientData = castString(data?.clientData);
            res.userName = castString(data?.userName);
            return res;
        };

        /**
         * @param {*} data
         * @returns {Svelters_Shared_Web_Api_SignUp_Attestation.Response}
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
