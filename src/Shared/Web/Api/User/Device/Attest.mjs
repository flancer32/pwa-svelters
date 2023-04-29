/**
 * Attest new device (smartphone, tablet, ...) and save publicKey in RDb.
 */
// MODULE'S VARS
const NS = 'Svelters_Shared_Web_Api_User_Device_Attest';

// MODULE'S CLASSES
/**
 * @memberOf Svelters_Shared_Web_Api_User_Device_Attest
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
}

/**
 * @memberOf Svelters_Shared_Web_Api_User_Device_Attest
 */
class Response {
    static namespace = NS;
    /**
     * Base64url encoded value.
     * @type {string}
     */
    attestationId;
    /** @type {number} */
    publicKeyBid;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Svelters_Shared_Web_Api_User_Device_Attest {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS

        /**
         * @param {Svelters_Shared_Web_Api_User_Device_Attest.Request} [data]
         * @return {Svelters_Shared_Web_Api_User_Device_Attest.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.attestationId = castString(data?.attestationId);
            res.attestationObj = castString(data?.attestationObj);
            res.clientData = castString(data?.clientData);
            return res;
        };

        /**
         * @param {Svelters_Shared_Web_Api_User_Device_Attest.Response} [data]
         * @returns {Svelters_Shared_Web_Api_User_Device_Attest.Response}
         */
        this.createRes = function (data) {
            // create new DTO
            const res = new Response();
            // cast known attributes
            res.attestationId = castString(data?.attestationId);
            res.publicKeyBid = castInt(data?.publicKeyBid);
            return res;
        };
    }

}
