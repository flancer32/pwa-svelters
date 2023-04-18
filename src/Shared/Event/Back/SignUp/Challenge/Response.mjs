/**
 * Get sign up challenge before new user registration from backend.
 */
// MODULE'S VARS
const NS = 'Svelters_Shared_Event_Back_SignUp_Challenge_Response';

// MODULE'S CLASSES
/**
 * @memberOf Svelters_Shared_Event_Back_SignUp_Challenge_Response
 */
class Dto {
    static namespace = NS;
    /**
     * base64url encoded binary data.
     * @type {string}
     */
    challenge;
    /** @type {string} */
    relyingPartyName;
    /**
     * Unique identifier for the user (login, email, phone, ...).
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
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Svelters_Shared_Event_Back_SignUp_Challenge_Response {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {Svelters_Shared_Event_Back_SignUp_Challenge_Response.Dto} [data]
         * @return {Svelters_Shared_Event_Back_SignUp_Challenge_Response.Dto}
         */
        this.createDto = function (data) {
            // create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // cast known attributes
            res.challenge = castString(data?.challenge);
            res.relyingPartyName = castString(data?.relyingPartyName);
            res.userName = castString(data?.userName);
            res.userUuid = castString(data?.userUuid);
            return res;
        }
    }
}
