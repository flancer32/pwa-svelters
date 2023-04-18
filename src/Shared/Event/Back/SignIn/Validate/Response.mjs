/**
 * Validate authentication results (signature) on backend.
 */
// MODULE'S VARS
const NS = 'Svelters_Shared_Event_Back_SignIn_Validate_Response';

// MODULE'S CLASSES
/**
 * @memberOf Svelters_Shared_Event_Back_SignIn_Validate_Response
 */
class Dto {
    static namespace = NS;
    /** @type {boolean} */
    success;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Svelters_Shared_Event_Back_SignIn_Validate_Response {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castBoolean|function} */
        const castBoolean = spec['TeqFw_Core_Shared_Util_Cast.castBoolean'];

        // INSTANCE METHODS
        /**
         * @param {Svelters_Shared_Event_Back_SignIn_Validate_Response.Dto} [data]
         * @return {Svelters_Shared_Event_Back_SignIn_Validate_Response.Dto}
         */
        this.createDto = function (data) {
            // create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // cast known attributes
            res.success = castBoolean(data?.success);
            return res;
        }
    }
}
