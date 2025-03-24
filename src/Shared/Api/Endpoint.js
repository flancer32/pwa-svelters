/**
 * Endpoint object creates requests and responses DTOs and provides route's address.
 * @interface
 */
export default class Svelters_Shared_Api_Endpoint {
    /**
     * Create a request DTO (Data Transfer Object).
     *
     * @param {object|null} [data] Optional data for the request, not used in the method.
     * @returns {object} The created request DTO.
     */
    // eslint-disable-next-line no-unused-vars
    createReq(data = null) {}

    /**
     * Create a response DTO (Data Transfer Object).
     *
     * @param {object|null} [data] Optional data for the response, not used in the method.
     * @returns {object} The created response DTO.
     */
    // eslint-disable-next-line no-unused-vars
    createRes(data = null) {}

    /**
     * Get object with result codes.
     *
     * @returns {object} Object containing result codes.
     */
    getResultCodes() {}
}
