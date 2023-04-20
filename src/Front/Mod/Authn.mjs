/**
 * Model to handle events related to users registration and authentication.
 * @namespace Svelters_Front_Mod_Authn
 */
export default class Svelters_Front_Mod_Authn {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Svelters_Front_Util_Codec.binToB64Url|function} */
        const binToB64Url = spec['Svelters_Front_Util_Codec.binToB64Url'];
        /** @type {TeqFw_Web_Api_Front_Web_Connect} */
        const connApi = spec['TeqFw_Web_Api_Front_Web_Connect$'];
        /** @type {Svelters_Shared_Web_Api_SignIn_Challenge} */
        const apiInChallenge = spec['Svelters_Shared_Web_Api_SignIn_Challenge$'];
        /** @type {Svelters_Shared_Web_Api_SignIn_Validate} */
        const apiInValidate = spec['Svelters_Shared_Web_Api_SignIn_Validate$'];
        /** @type {Svelters_Shared_Web_Api_SignUp_Attestation} */
        const apiUpAttestation = spec['Svelters_Shared_Web_Api_SignUp_Attestation$'];
        /** @type {Svelters_Shared_Web_Api_SignUp_Challenge} */
        const apiUpChallenge = spec['Svelters_Shared_Web_Api_SignUp_Challenge$'];

        // MAIN
        logger.setNamespace(this.constructor.name);

        // FUNCS

        // INSTANCE METHODS
        /**
         * Save new attestation with `publicKey` on backend.
         * @param {string} userName
         * @param {PublicKeyCredential} attestation
         * @returns {Promise<Svelters_Shared_Event_Back_SignUp_Attestation_Response.Dto>}
         */
        this.attestation = async function (userName, attestation) {
            try {
                // noinspection JSValidateTypes
                /** @type {AuthenticatorAttestationResponse} */
                const response = attestation.response;
                const attestationObj = response.attestationObject;
                const clientData = response.clientDataJSON;
                const req = apiUpAttestation.createReq();
                req.attestationId = attestation.id;
                req.attestationObj = binToB64Url(attestationObj);
                req.clientData = binToB64Url(clientData);
                req.userName = userName;
                // noinspection JSValidateTypes
                return await connApi.send(req, apiUpAttestation);
            } catch (e) {
                // timeout or error
                logger.error(`Cannot register attestation for a new user on the backend. Error: ${e?.message}`);
            }
            return null;
        };

        /**
         * Get challenge for user authentication from backend.
         * @param {string} userName
         * @returns {Promise<Svelters_Shared_Event_Back_SignIn_Challenge_Response.Dto>}
         */
        this.challengeIn = async function (userName) {
            try {
                const req = apiInChallenge.createReq();
                req.userName = userName;
                // noinspection JSValidateTypes
                return await connApi.send(req, apiInChallenge);
            } catch (e) {
                // timeout or error
                logger.error(`Cannot get a challenge for an existing user's authentication from the backend. Error: ${e?.message}`);
            }
            return null;
        };

        /**
         * Get challenge for new user registration from backend.
         * @param {string} userName
         * @returns {Promise<Svelters_Shared_Web_Api_SignUp_Challenge.Response>}
         */
        this.challengeUp = async function (userName) {
            try {
                const req = apiUpChallenge.createReq();
                req.userName = userName;
                // noinspection JSValidateTypes
                return await connApi.send(req, apiUpChallenge);
            } catch (e) {
                // timeout or error
                logger.error(`Cannot retrieve challenge for a new user from the backend. Error: ${e?.message}`);
            }
            return null;
        };

        /**
         * Validate authentication results (signature) on backend.
         * @param {string} userName
         * @param {AuthenticatorAssertionResponse} resp
         * @returns {Promise<Svelters_Shared_Event_Back_SignIn_Validate_Response.Dto>}
         */
        this.validate = async function (userName, resp) {
            try {
                const req = apiInValidate.createReq();
                req.authenticatorData = binToB64Url(resp.authenticatorData);
                req.clientDataJSON = binToB64Url(resp.clientDataJSON);
                req.signature = binToB64Url(resp.signature);
                // noinspection JSValidateTypes
                return await connApi.send(req, apiInValidate);
            } catch (e) {
                // timeout or error
                logger.error(`Cannot validate authentication signature on backend. Error: ${e?.message}`);
            }
            return null;
        };

    }
}
