/**
 * DTO to save authentication data in the store.
 */
// MODULE'S VARS
const NS = 'Svelters_Back_Listen_Trans_Z_Dto';

// MODULE'S CLASSES
/**
 * @memberOf Svelters_Back_Listen_Trans_Z_Dto
 */
class Dto {
    static namespace = NS;
    /** @type {string} */
    attestationId;
    /**
     * Base64url encoded binary.
     * @type {string}
     */
    challenge;
    /** @type {CryptoKey} */
    publicKey;
    /** @type {string} */
    userName;
    /** @type {string} */
    userUuid;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Svelters_Back_Listen_Trans_Z_Dto {
    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        /**
         * @param {Svelters_Back_Listen_Trans_Z_Dto.Dto} [data]
         * @return {Svelters_Back_Listen_Trans_Z_Dto.Dto}
         */
        this.createDto = function (data) {
            // create new DTO
            const res = new Dto();
            // cast known attributes
            res.attestationId = castString(data?.attestationId);
            res.challenge = castString(data?.challenge);
            res.publicKey = data?.publicKey; // TODO: use binary or base64? JSON is not binary format!
            res.userName = castString(data?.userName);
            res.userUuid = castString(data?.userUuid);
            return res;
        }
    }
}
