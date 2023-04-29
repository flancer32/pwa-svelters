/**
 * Model to handle events related to user device (smartphone).
 * @namespace Svelters_Front_Mod_User_Device
 */
export default class Svelters_Front_Mod_User_Device {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Svelters_Front_Util_Codec.binToB64Url|function} */
        const binToB64Url = spec['Svelters_Front_Util_Codec.binToB64Url'];
        /** @type {TeqFw_Web_Api_Front_Web_Connect} */
        const connApi = spec['TeqFw_Web_Api_Front_Web_Connect$'];
        /** @type {Svelters_Shared_Web_Api_User_Device_Invite_Create} */
        const apiInviteCreate = spec['Svelters_Shared_Web_Api_User_Device_Invite_Create$'];
        /** @type {Svelters_Shared_Web_Api_User_Device_Invite_Use} */
        const apiInviteUse = spec['Svelters_Shared_Web_Api_User_Device_Invite_Use$'];
        /** @type {Svelters_Shared_Web_Api_User_Device_Attest} */
        const apiAttest = spec['Svelters_Shared_Web_Api_User_Device_Attest$'];

        // MAIN
        logger.setNamespace(this.constructor.name);

        // FUNCS

        // INSTANCE METHODS
        /**
         * Attest new device (smartphone, tablet, ...) and save publicKey in RDb.
         * @param {PublicKeyCredential|Credential} attestation
         * @returns {Promise<Svelters_Shared_Web_Api_User_Device_Attest.Response>}
         */
        this.attest = async function (attestation) {
            try {
                // noinspection JSValidateTypes
                /** @type {AuthenticatorAttestationResponse} */
                const response = attestation.response;
                const attestationObj = response.attestationObject;
                const clientData = response.clientDataJSON;
                //
                const req = apiAttest.createReq();
                req.attestationId = attestation.id;
                req.attestationObj = binToB64Url(attestationObj);
                req.clientData = binToB64Url(clientData);
                // noinspection JSValidateTypes
                return await connApi.send(req, apiAttest);
            } catch (e) {
                // timeout or error
                logger.error(`Cannot use invitation to register new device for a user. Error: ${e?.message}`);
            }
            return null;
        };

        /**
         * Register new `email` on backend and get an invitation to connect a device to the user.
         * @param {string} email
         * @returns {Promise<Svelters_Shared_Web_Api_User_Device_Invite_Create.Response>}
         */
        this.inviteCreate = async function (email) {
            try {
                const req = apiInviteCreate.createReq();
                req.email = email;
                // noinspection JSValidateTypes
                return await connApi.send(req, apiInviteCreate);
            } catch (e) {
                // timeout or error
                logger.error(`Cannot create invite to register new device for a user. Error: ${e?.message}`);
            }
            return null;
        };
        /**
         * Exchange invitation code to user attestation data (challenge, userUuid, ...).
         * @param {string} code invitation code
         * @returns {Promise<Svelters_Shared_Web_Api_User_Device_Invite_Use.Response>}
         */
        this.inviteUse = async function (code) {
            try {
                const req = apiInviteUse.createReq();
                req.code = code;
                // noinspection JSValidateTypes
                return await connApi.send(req, apiInviteUse);
            } catch (e) {
                // timeout or error
                logger.error(`Cannot use invitation to register new device for a user. Error: ${e?.message}`);
            }
            return null;
        };
    }
}
