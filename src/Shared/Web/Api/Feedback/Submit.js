/**
 * API Endpoint: Feedback Submit.
 *
 * Is a tool for the Assistant that can be used for user feedback
 * to the application support service.
 *
 * @implements Svelters_Shared_Api_Endpoint
 */
export default class Svelters_Shared_Web_Api_Feedback_Submit {
    /**
     * @param {Svelters_Shared_Dto_Web_Api_Response_Meta} dtoMeta - DTO for response metadata.
     * @param {Svelters_Shared_Dto_Feedback_Inbox} dtoFeedback - DTO for feedback data.
     */
    constructor(
        {
            Svelters_Shared_Dto_Web_Api_Response_Meta$: dtoMeta,
            Svelters_Shared_Dto_Feedback_Inbox$: dtoFeedback,
        }
    ) {
        // INSTANCE METHODS

        /**
         * Create a request DTO from raw input.
         *
         * @param {Svelters_Shared_Web_Api_Feedback_Submit.Request} [data]
         * @return {Svelters_Shared_Web_Api_Feedback_Submit.Request}
         */
        this.createReq = function (data) {
            const res = new Request();
            // Always initialize DTO properties, even if no input data is provided.
            res.feedback = dtoFeedback.create(data?.feedback);
            return res;
        };

        /**
         * Create a response DTO from raw input.
         *
         * @param {Svelters_Shared_Web_Api_Feedback_Submit.Response} [data]
         * @returns {Svelters_Shared_Web_Api_Feedback_Submit.Response}
         */
        this.createRes = function (data) {
            const res = new Response();
            // Always initialize DTO properties, even if no input data is provided.
            res.meta = dtoMeta.create(data?.meta);
            return res;
        };

        /**
         * Get available result codes for this API endpoint.
         *
         * @returns {typeof Svelters_Shared_Web_Api_Feedback_Submit.ResultCode}
         */
        this.getResultCodes = () => ResultCode;
    }
}

/**
 * @memberOf Svelters_Shared_Web_Api_Feedback_Submit
 */
class Request {
    /**
     * Feedback information from the user.
     * @type {Svelters_Shared_Dto_Feedback_Inbox.Dto}
     */
    feedback;
}

/**
 * @memberOf Svelters_Shared_Web_Api_Feedback_Submit
 */
class Response {
    /**
     * Metadata describing the result of the request processing.
     * @type {Svelters_Shared_Dto_Web_Api_Response_Meta.Dto}
     */
    meta;
}

/**
 * @memberOf Svelters_Shared_Web_Api_Feedback_Submit
 */
const ResultCode = {
    /**
     * Indicates that feedback was successfully submitted.
     */
    SUCCESS: 'SUCCESS',

    /**
     * Indicates that an unknown error occurred during request processing.
     */
    UNKNOWN: 'UNKNOWN',
};
Object.freeze(ResultCode);