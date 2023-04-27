/**
 * Model to handle events related to user device (smartphone).
 * @namespace Svelters_Front_Mod_User_Device
 */
export default class Svelters_Front_Mod_User_Device {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Web_Api_Front_Web_Connect} */
        const connApi = spec['TeqFw_Web_Api_Front_Web_Connect$'];
        /** @type {Svelters_Shared_Web_Api_User_Device_Invite_Create} */
        const apiInviteCreate = spec['Svelters_Shared_Web_Api_User_Device_Invite_Create$'];

        // MAIN
        logger.setNamespace(this.constructor.name);

        // FUNCS

        // INSTANCE METHODS
        /**
         * Register new `email` on backend.
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
    }
}
