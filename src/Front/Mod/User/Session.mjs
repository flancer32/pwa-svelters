/**
 * Model to handle events related to user session (init, close).
 * @namespace Svelters_Front_Mod_User_Session
 */
export default class Svelters_Front_Mod_User_Session {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Web_Api_Front_Web_Connect} */
        const connApi = spec['TeqFw_Web_Api_Front_Web_Connect$'];
        /** @type {Svelters_Shared_Web_Api_User_Session_Close} */
        const apiClose = spec['Svelters_Shared_Web_Api_User_Session_Close$'];
        /** @type {Svelters_Shared_Web_Api_User_Session_Init} */
        const apiInit = spec['Svelters_Shared_Web_Api_User_Session_Init$'];

        // MAIN
        logger.setNamespace(this.constructor.name);
        let _store;

        // FUNCS

        // INSTANCE METHODS

        this.close = async function () {
            try {
                const req = apiClose.createReq();
                // noinspection JSValidateTypes
                /** @type {Svelters_Shared_Web_Api_User_Session_Close.Response} */
                const res = await connApi.send(req, apiClose);
                debugger
                _store = undefined;
            } catch (e) {
                // timeout or error
                logger.error(`Cannot close user session. Error: ${e?.message}`);
            }
        };

        /**
         * Initialize user session.
         * @return {Promise<void>}
         */
        this.init = async function () {
            try {
                const req = apiInit.createReq();
                // noinspection JSValidateTypes
                /** @type {Svelters_Shared_Web_Api_User_Session_Init.Response} */
                const res = await connApi.send(req, apiInit);
                if (res?.user?.uuid) _store = res?.user;
                else _store = undefined;
            } catch (e) {
                // timeout or error
                logger.error(`Cannot initialize user session. Error: ${e?.message}`);
            }
        };

        this.isValid = () => Boolean(_store);

        this.setData = (data) => _store = data;
    }
}
