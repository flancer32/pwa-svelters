/**
 * Initialize the session and fetch user data from the backend using the session ID stored in cookies.
 */
// MODULE'S VARS
const NS = 'Svelters_Shared_Web_Api_User_Session_Init';

// MODULE'S CLASSES
/**
 * @memberOf Svelters_Shared_Web_Api_User_Session_Init
 */
class Request {
    static namespace = NS;
}

/**
 * @memberOf Svelters_Shared_Web_Api_User_Session_Init
 */
class Response {
    static namespace = NS;
    /** @type {Svelters_Shared_Dto_User.Dto} */
    user;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class Svelters_Shared_Web_Api_User_Session_Init {
    constructor(spec) {
        // DEPS
        /** @type {Svelters_Shared_Dto_User} */
        const dtoUser = spec['Svelters_Shared_Dto_User$'];

        // INSTANCE METHODS

        /**
         * @param {Svelters_Shared_Web_Api_User_Session_Init.Request} [data]
         * @return {Svelters_Shared_Web_Api_User_Session_Init.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            return res;
        };

        /**
         * @param {Svelters_Shared_Web_Api_User_Session_Init.Response} [data]
         * @returns {Svelters_Shared_Web_Api_User_Session_Init.Response}
         */
        this.createRes = function (data) {
            // create new DTO
            const res = new Response();
            // cast known attributes
            res.user = dtoUser.createDto(data?.user);
            return res;
        };
    }

}
