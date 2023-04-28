/**
 * Use invitation to register new device for a user.
 * This invitation should be verified and attestation challenge should be got from the back.
 */
// MODULE'S VARS
const NS = 'Svelters_Shared_Web_Api_User_Device_Invite_Use';

// MODULE'S CLASSES
/**
 * @memberOf Svelters_Shared_Web_Api_User_Device_Invite_Use
 */
class Request {
    static namespace = NS;
    /** @type {string} */
    code;
}

/**
 * @memberOf Svelters_Shared_Web_Api_User_Device_Invite_Use
 */
class Response {
    static namespace = NS;
    /**
     * base64url encoded binary data (32 bytes).
     * @type {string}
     */
    challenge;
    /**
     * Relying party name ('Svelters PWA').
     * @type {string}
     */
    rpName;
    /**
     * User name (email, phone, ...) as identifier.
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
export default class Svelters_Shared_Web_Api_User_Device_Invite_Use {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS

        /**
         * @param {Svelters_Shared_Web_Api_User_Device_Invite_Use.Request} [data]
         * @return {Svelters_Shared_Web_Api_User_Device_Invite_Use.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.code = castString(data?.code);
            return res;
        };

        /**
         * @param {Svelters_Shared_Web_Api_User_Device_Invite_Use.Response} [data]
         * @returns {Svelters_Shared_Web_Api_User_Device_Invite_Use.Response}
         */
        this.createRes = function (data) {
            // create new DTO
            const res = new Response();
            // cast known attributes
            res.challenge = castString(data?.challenge);
            res.rpName = castString(data?.rpName);
            res.userName = castString(data?.userName);
            res.userUuid = castString(data?.userUuid);
            return res;
        };
    }

}
