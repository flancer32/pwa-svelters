/**
 * Model to validate the uniqueness of some data.

 * @namespace Svelters_Front_Mod_Data_Unique
 */
export default class Svelters_Front_Mod_Data_Unique {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Web_Api_Front_Web_Connect} connApi
     * @param {Svelters_Shared_Web_Api_Data_Unique} apiUnique
     * @param {typeof Svelters_Shared_Enum_Data_Type_Unique} TYPE
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Api_Front_Web_Connect$: connApi,
            Svelters_Shared_Web_Api_Data_Unique$: apiUnique,
            Svelters_Shared_Enum_Data_Type_Unique$: TYPE,
        }) {
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
