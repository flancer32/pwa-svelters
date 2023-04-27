/**
 * Create invite to register new device for user.
 */
// MODULE'S VARS
const NS = 'Svelters_Shared_Web_Api_User_Device_Invite_Create';

// MODULE'S CLASSES
/**
 * @memberOf Svelters_Shared_Web_Api_User_Device_Invite_Create
 */
class Request {
    static namespace = NS;
    /** @type {string} */
    email;
}

/**
 * @memberOf Svelters_Shared_Web_Api_User_Device_Invite_Create
 */
class Response {
    static namespace = NS;
    /** @type {string} */
    code;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Svelters_Shared_Web_Api_User_Device_Invite_Create {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS

        /**
         * @param {Svelters_Shared_Web_Api_User_Device_Invite_Create.Request} [data]
         * @return {Svelters_Shared_Web_Api_User_Device_Invite_Create.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.email = castString(data?.email);
            return res;
        };

        /**
         * @param {Svelters_Shared_Web_Api_User_Device_Invite_Create.Response} [data]
         * @returns {Svelters_Shared_Web_Api_User_Device_Invite_Create.Response}
         */
        this.createRes = function (data) {
            // create new DTO
            const res = new Response();
            // cast known attributes
            res.code = castString(data?.code);
            return res;
        };
    }

}
