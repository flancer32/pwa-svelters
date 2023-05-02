/**
 * DTO to represent public key credentials for attestation process.
 */
// MODULE'S VARS
const NS = 'Svelters_Shared_Dto_WebAuthn_Attest';

/**
 * @memberOf Svelters_Shared_Dto_WebAuthn_Attest
 * @type {Object}
 */
export const ATTR = {
    ATTESTATION_ID: 'attestationId',
    ATTESTATION_OBJ: 'attestationObj',
    CLIENT_DATA: 'clientData',
};
Object.freeze(ATTR);

// MODULE'S CLASSES
/**
 * @memberOf Svelters_Shared_Dto_WebAuthn_Attest
 */
class Dto {
    static namespace = NS;
    /**
     * Base64url encoded binary value for `PublicKeyCredential.rawId`.
     * @type {string}
     */
    attestationId;
    /**
     * Base64url encoded binary value for `AuthenticatorAttestationResponse.attestationObject`.
     * @type {string}
     */
    attestationObj;
    /**
     * Base64url encoded binary value for `AuthenticatorResponse.clientDataJSON`.
     * @type {string}
     */
    clientData;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Svelters_Shared_Dto_WebAuthn_Attest {
    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        /**
         * @param {Svelters_Shared_Dto_WebAuthn_Attest.Dto} [data]
         * @return {Svelters_Shared_Dto_WebAuthn_Attest.Dto}
         */
        this.createDto = function (data) {
            // create new DTO
            const res = new Dto();
            // cast known attributes
            res.attestationId = castString(data?.attestationId);
            res.attestationObj = castString(data?.attestationObj);
            res.clientData = castString(data?.clientData);
            return res;
        };
    }
}
