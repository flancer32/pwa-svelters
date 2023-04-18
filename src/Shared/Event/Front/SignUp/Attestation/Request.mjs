/**
 * Save new attestation with `publicKey` on backend.
 */
// MODULE'S VARS
const NS = 'Svelters_Shared_Event_Front_SignUp_Attestation_Request';

// MODULE'S CLASSES
/**
 * @memberOf Svelters_Shared_Event_Front_SignUp_Attestation_Request
 */
class Dto {
    static namespace = NS;
    /**
     * Base64url encoded value.
     * @type {string}
     */
    attestationId;
    /** @type {string} */
    attestationObj;
    /** @type {string} */
    clientData;
    /** @type {string} */
    userName;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Svelters_Shared_Event_Front_SignUp_Attestation_Request {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {Svelters_Shared_Event_Front_SignUp_Attestation_Request.Dto} [data]
         * @return {Svelters_Shared_Event_Front_SignUp_Attestation_Request.Dto}
         */
        this.createDto = function (data) {
            // create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // cast known attributes
            res.attestationId = castString(data?.attestationId);
            res.attestationObj = castString(data?.attestationObj);
            res.clientData = castString(data?.clientData);
            res.userName = castString(data?.userName);
            return res;
        }
    }
}
