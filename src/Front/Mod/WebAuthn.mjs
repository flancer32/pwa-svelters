/**
 * A model to handle events related to user authentication with the WebAuthn API.
 * @namespace Svelters_Front_Mod_WebAuthn
 */
export default class Svelters_Front_Mod_WebAuthn {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Svelters_Front_Util_Codec.binToB64Url|function} */
        const binToB64Url = spec['Svelters_Front_Util_Codec.binToB64Url'];
        /** @type {TeqFw_Web_Api_Front_Web_Connect} */
        const connApi = spec['TeqFw_Web_Api_Front_Web_Connect$'];
        /** @type {Svelters_Shared_Dto_WebAuthn_Attest} */
        const dtoCred = spec['Svelters_Shared_Dto_WebAuthn_Attest$'];
        /** @type {Svelters_Shared_Web_Api_WebAuthn_Attest} */
        const apiAttest = spec['Svelters_Shared_Web_Api_WebAuthn_Attest$'];
        /** @type {Svelters_Shared_Web_Api_WebAuthn_SignIn_Challenge} */
        const apiSignInChl = spec['Svelters_Shared_Web_Api_WebAuthn_SignIn_Challenge$'];

        // MAIN
        logger.setNamespace(this.constructor.name);

        // FUNCS

        // INSTANCE METHODS
        /**
         * Validate the new attestation on the backend and save the user's public key if it is validated.
         *
         * @param {PublicKeyCredential} attestation
         * @returns {Promise<Svelters_Shared_Web_Api_WebAuthn_Attest.Response>}
         */
        this.attest = async function (attestation) {
            try {
                // parse input data
                // noinspection JSValidateTypes
                /** @type {AuthenticatorAttestationResponse} */
                const response = attestation.response;
                const attestationObj = response.attestationObject;
                const clientData = response.clientDataJSON;
                // prepare API request
                const cred = dtoCred.createDto();
                cred.attestationId = attestation.id;
                cred.attestationObj = binToB64Url(attestationObj);
                cred.clientData = binToB64Url(clientData);
                const req = apiAttest.createReq();
                req.cred = cred;
                // noinspection JSValidateTypes
                return await connApi.send(req, apiAttest);
            } catch (e) {
                // timeout or error
                logger.error(`Cannot register attestation for a new user on the backend. Error: ${e?.message}`);
            }
            return null;
        };

        this.signInChallenge = async function (attestationId) {
            try {
                // parse input data
                const req = apiSignInChl.createReq();
                req.attestationId = attestationId;
                // noinspection JSValidateTypes
                return await connApi.send(req, apiSignInChl);
            } catch (e) {
                // timeout or error
                logger.error(`Cannot create a new sign in challenge on the backend. Error: ${e?.message}`);
            }
            return null;
        };

    }
}
