/**
 * Register new identity (email or phone) on backend.
 */
// MODULE'S VARS
const NS = 'Svelters_Shared_Web_Api_User_Sign_Up_Register';

// MODULE'S CLASSES
/**
 * @memberOf Svelters_Shared_Web_Api_User_Sign_Up_Register
 */
class Request {
    static namespace = NS;
    /** @type {number} */
    age;
    /** @type {string} */
    email;
    /** @type {number} */
    height;
    /** @type {string} */
    name;
    /**
     * 'true' if the front end supports the WebAuthn API and we should verify the user's identity.
     * @type {boolean}
     */
    useWebAuthn;
}

/**
 * @memberOf Svelters_Shared_Web_Api_User_Sign_Up_Register
 */
class Response {
    static namespace = NS;
    /**
     * base64url encoded binary data (32 bytes) to attest the user.
     * @type {string}
     */
    challenge;
    /** @type {string} */
    uuid;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Svelters_Shared_Web_Api_User_Sign_Up_Register {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castBoolean|function} */
        const castBoolean = spec['TeqFw_Core_Shared_Util_Cast.castBoolean'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS

        /**
         * @param {Svelters_Shared_Web_Api_User_Sign_Up_Register.Request} [data]
         * @return {Svelters_Shared_Web_Api_User_Sign_Up_Register.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.age = castInt(data?.age);
            res.email = castString(data?.email);
            res.height = castInt(data?.height);
            res.name = castString(data?.name);
            res.useWebAuthn = castBoolean(data?.useWebAuthn);
            return res;
        };

        /**
         * @param {Svelters_Shared_Web_Api_User_Sign_Up_Register.Response} [data]
         * @returns {Svelters_Shared_Web_Api_User_Sign_Up_Register.Response}
         */
        this.createRes = function (data) {
            // create new DTO
            const res = new Response();
            // cast known attributes
            res.challenge = castString(data?.challenge);
            res.uuid = castString(data?.uuid);
            return res;
        };
    }

}
