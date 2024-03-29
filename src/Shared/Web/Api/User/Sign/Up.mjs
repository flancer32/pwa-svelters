/**
 * Register new user on backend.
 */
// MODULE'S VARS
const NS = 'Svelters_Shared_Web_Api_User_Sign_Up';

// MODULE'S CLASSES
/**
 * @memberOf Svelters_Shared_Web_Api_User_Sign_Up
 */
class Request {
    static namespace = NS;
    /**
     * UTC date of birth.
     * @type {Date}
     */
    dateBirth;
    /** @type {string} */
    email;
    /** @type {number} */
    height;
    /** @type {string} */
    name;
    /**
     * Binary data as HEX string.
     * @type {string}
     */
    passwordHash;
    /**
     * Binary data as HEX string.
     * @type {string}
     */
    passwordSalt;
    /**
     * 'true' if the front end supports the WebAuthn API, and we should attest the user.
     * @type {boolean}
     */
    usePubKey;
}

/**
 * @memberOf Svelters_Shared_Web_Api_User_Sign_Up
 */
class Response {
    static namespace = NS;
    /**
     * base64url encoded binary data (32 bytes) to attest the user.
     * @type {string}
     */
    challenge;
    /**
     * App-specific data for the newly established session.
     * @type {Svelters_Shared_Dto_User.Dto}
     */
    sessionData;
    /**
     * UUID for the user to get binary userId on 'navigator.credentials.create'
     * @type {string}
     */
    userUuid;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Svelters_Shared_Web_Api_User_Sign_Up {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast.castBoolean|function} castBoolean
     * @param {TeqFw_Core_Shared_Util_Cast.castDate|function} castDate
     * @param {TeqFw_Core_Shared_Util_Cast.castInt|function} castInt
     * @param {TeqFw_Core_Shared_Util_Cast.castString|function} castString
     * @param {Svelters_Shared_Dto_User} dtoUser
     */
    constructor(
        {
            'TeqFw_Core_Shared_Util_Cast.castBoolean': castBoolean,
            'TeqFw_Core_Shared_Util_Cast.castDate': castDate,
            'TeqFw_Core_Shared_Util_Cast.castInt': castInt,
            'TeqFw_Core_Shared_Util_Cast.castString': castString,
            Svelters_Shared_Dto_User$: dtoUser,
        }) {
        // INSTANCE METHODS

        /**
         * @param {Svelters_Shared_Web_Api_User_Sign_Up.Request} [data]
         * @return {Svelters_Shared_Web_Api_User_Sign_Up.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.dateBirth = castDate(data?.dateBirth);
            res.email = castString(data?.email);
            res.height = castInt(data?.height);
            res.name = castString(data?.name);
            res.passwordHash = castString(data?.passwordHash);
            res.passwordSalt = castString(data?.passwordSalt);
            res.usePubKey = castBoolean(data?.usePubKey);
            return res;
        };

        /**
         * @param {Svelters_Shared_Web_Api_User_Sign_Up.Response} [data]
         * @returns {Svelters_Shared_Web_Api_User_Sign_Up.Response}
         */
        this.createRes = function (data) {
            // create new DTO
            const res = new Response();
            // cast known attributes
            res.challenge = castString(data?.challenge);
            res.sessionData = dtoUser.createDto(data?.sessionData);
            res.userUuid = castString(data?.userUuid);
            return res;
        };
    }

}
