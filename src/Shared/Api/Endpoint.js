/**
 * Endpoint object creates requests and responses DTOs and provides route's address.
 * @interface
 */
export default class Svelters_Shared_Api_Endpoint {
    /**
     * @param {Object|null} [data]
     * @returns {Object}
     */
    createReq(data = null) {}

    /**
     * @param {Object|null} [data]
     * @returns {Object}
     */
    createRes(data = null) {}

    /**
     * Get object with result codes.
     *
     * @returns {Object}
     */
    getResultCodes() {}
}
