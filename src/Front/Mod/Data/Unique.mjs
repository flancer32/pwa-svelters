/**
 * Model to validate the uniqueness of some data.

 * @namespace Svelters_Front_Mod_Data_Unique
 */
export default class Svelters_Front_Mod_Data_Unique {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Web_Api_Front_Web_Connect} */
        const connApi = spec['TeqFw_Web_Api_Front_Web_Connect$'];
        /** @type {Svelters_Shared_Web_Api_Data_Unique} */
        const apiUnique = spec['Svelters_Shared_Web_Api_Data_Unique$'];
        /** @type {typeof Svelters_Shared_Enum_Data_Type_Unique} */
        const TYPE = spec['Svelters_Shared_Enum_Data_Type_Unique$'];

        // MAIN
        logger.setNamespace(this.constructor.name);

        // INSTANCE METHODS

        /**
         * @param {string} data
         * @returns {Promise<boolean>}
         */
        this.email = async function (data) {
            try {
                const req = apiUnique.createReq();
                req.value = data;
                req.type = TYPE.EMAIL;
                // noinspection JSValidateTypes
                /** @type {Svelters_Shared_Web_Api_Data_Unique.Response} */
                const res = await connApi.send(req, apiUnique);
                return res.isUnique;
            } catch (e) {
                // timeout or error
                logger.error(`Cannot validate email uniqueness on the backend. Error: ${e?.message}`);
            }
            return null;
        };

    }
}
