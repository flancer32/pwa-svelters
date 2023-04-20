/**
 * Model to handle events related to users registration and authentication (SSE based).
 * @namespace Svelters_Front_Mod_Authn
 */
export default class Svelters_Front_Mod_Authn {
    constructor(spec) {
        // DEPS
        /** @type {Svelters_Front_Defaults} */
        const DEF = spec['Svelters_Front_Defaults$'];
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Svelters_Front_Util_Codec.binToB64Url|function} */
        const binToB64Url = spec['Svelters_Front_Util_Codec.binToB64Url'];
        // /** @type {TeqFw_Web_Event_Front_Act_Trans_Call.act|function} */
        // const callTrans = spec['TeqFw_Web_Event_Front_Act_Trans_Call$'];
        /** @type {Svelters_Shared_Event_Front_SignUp_Attestation_Request} */
        const esfReqUpAtt = spec['Svelters_Shared_Event_Front_SignUp_Attestation_Request$'];
        /** @type {Svelters_Shared_Event_Back_SignUp_Attestation_Response} */
        const esbResUpAtt = spec['Svelters_Shared_Event_Back_SignUp_Attestation_Response$'];
        /** @type {Svelters_Shared_Event_Front_SignIn_Challenge_Request} */
        const esfReqInChallenge = spec['Svelters_Shared_Event_Front_SignIn_Challenge_Request$'];
        /** @type {Svelters_Shared_Event_Back_SignIn_Challenge_Response} */
        const esbResInChallenge = spec['Svelters_Shared_Event_Back_SignIn_Challenge_Response$'];
        /** @type {Svelters_Shared_Event_Front_SignIn_Validate_Request} */
        const esfReqInValid = spec['Svelters_Shared_Event_Front_SignIn_Validate_Request$'];
        /** @type {Svelters_Shared_Event_Back_SignIn_Validate_Response} */
        const esbResInValid = spec['Svelters_Shared_Event_Back_SignIn_Validate_Response$'];
        /** @type {Svelters_Shared_Event_Front_SignUp_Challenge_Request} */
        const esfReqUpChallenge = spec['Svelters_Shared_Event_Front_SignUp_Challenge_Request$'];
        /** @type {Svelters_Shared_Event_Back_SignUp_Challenge_Response} */
        const esbResUpChallenge = spec['Svelters_Shared_Event_Back_SignUp_Challenge_Response$'];

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
                const req = esfReqUpAtt.createDto();
                req.attestationId = attestation.id;
                req.attestationObj = binToB64Url(attestationObj);
                req.clientData = binToB64Url(clientData);
                req.userName = userName;
                //
                return await callTrans(req, esbResUpAtt, {timeout: DEF.TIMEOUT_RESPONSE});
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
                const req = esfReqInChallenge.createDto();
                req.userName = userName;
                return await callTrans(req, esbResInChallenge, {timeout: DEF.TIMEOUT_RESPONSE});
            } catch (e) {
                // timeout or error
                logger.error(`Cannot get a challenge for an existing user's authentication from the backend. Error: ${e?.message}`);
            }
            return null;
        };

        /**
         * Get challenge for new user registration from backend.
         * @param {string} userName
         * @returns {Promise<Svelters_Shared_Event_Back_SignUp_Challenge_Response.Dto>}
         */
        this.challengeUp = async function (userName) {
            try {
                const req = esfReqUpChallenge.createDto();
                req.userName = userName;
                return await callTrans(req, esbResUpChallenge, {timeout: DEF.TIMEOUT_RESPONSE});
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
                const req = esfReqInValid.createDto();
                req.authenticatorData = binToB64Url(resp.authenticatorData);
                req.clientDataJSON = binToB64Url(resp.clientDataJSON);
                req.signature = binToB64Url(resp.signature);
                return await callTrans(req, esbResInValid, {timeout: DEF.TIMEOUT_RESPONSE});
            } catch (e) {
                // timeout or error
                logger.error(`Cannot validate authentication signature on backend. Error: ${e?.message}`);
            }
            return null;
        };

    }
}
