/**
 * Get challenge for user authentication from backend.
 */
// MODULE'S VARS
const NS = 'Svelters_Shared_Event_Back_SignIn_Challenge_Response';

// MODULE'S CLASSES
/**
 * @memberOf Svelters_Shared_Event_Back_SignIn_Challenge_Response
 */
class Dto {
    static namespace = NS;
    /** @type {string} */
    attestationId;
    /**
     * Base64 url encoded challenge.
     * @type {string}
     */
    challenge;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Svelters_Shared_Event_Back_SignIn_Challenge_Response {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {Svelters_Shared_Event_Back_SignIn_Challenge_Response.Dto} [data]
         * @return {Svelters_Shared_Event_Back_SignIn_Challenge_Response.Dto}
         */
        this.createDto = function (data) {
            // create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // cast known attributes
            res.attestationId = castString(data?.attestationId);
            res.challenge = castString(data?.challenge);
            return res;
        }
    }
}
