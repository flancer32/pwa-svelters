/**
 * Validate user authentication (with password or public key).
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
     * Assertion data for public key authentication.
     * @type {Fl32_Auth_Shared_Dto_Assert.Dto}
     */
    assert;
    /** @type {string} */
    email;
    /**
     * HEX-string of the password hash.
     * @type {string}
     */
    passwordHash;
}

/**
 * @memberOf Svelters_Shared_Web_Api_User_Sign_In_Validate
 */
class Response {
    static namespace = NS;
    /** @type {boolean} */
    success;
    /** @type {Svelters_Shared_Dto_User.Dto} */
    user;
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
        /** @type {Fl32_Auth_Shared_Dto_Assert} */
        const dtoAssert = spec['Fl32_Auth_Shared_Dto_Assert$'];
        /** @type {Svelters_Shared_Dto_User} */
        const dtoUser = spec['Svelters_Shared_Dto_User$'];

        // INSTANCE METHODS

        /**
         * @param {Svelters_Shared_Web_Api_User_Sign_In_Validate.Request} [data]
         * @return {Svelters_Shared_Web_Api_User_Sign_In_Validate.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.assert = dtoAssert.createDto(data?.assert);
            res.email = castString(data?.email);
            res.passwordHash = castString(data?.passwordHash);
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
            res.user = dtoUser.createDto(data?.user);
            return res;
        };
    }

}
