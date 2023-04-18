/**
 * Get sign up challenge before new user registration from backend.
 */
// MODULE'S VARS
const NS = 'Svelters_Shared_Event_Front_SignUp_Challenge_Request';

// MODULE'S CLASSES
/**
 * @memberOf Svelters_Shared_Event_Front_SignUp_Challenge_Request
 */
class Dto {
    static namespace = NS;
    /** @type {string} */
    userName;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Svelters_Shared_Event_Front_SignUp_Challenge_Request {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {Svelters_Shared_Event_Front_SignUp_Challenge_Request.Dto} [data]
         * @return {Svelters_Shared_Event_Front_SignUp_Challenge_Request.Dto}
         */
        this.createDto = function (data) {
            // create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // cast known attributes
            res.userName = castString(data?.userName);
            return res;
        }
    }
}
