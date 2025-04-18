/**
 * Factory for creating standardized DTOs for the "delete account" API endpoint.
 * The factory is intended to be injected and used wherever this interaction format is needed.
 *
 * @implements Svelters_Shared_Api_Endpoint
 */
export default class Svelters_Shared_Web_End_Account_Delete {
    /**
     * @param {Svelters_Shared_Defaults} DEF
     * @param {TeqFw_Core_Shared_Util_Cast} cast - The cast utility for type conversion.
     * @param {Svelters_Shared_Dto_Web_Api_Response_Meta} dtoMeta
     */
    constructor(
        {
            Svelters_Shared_Defaults$: DEF,
            TeqFw_Core_Shared_Util_Cast$: cast,
            Svelters_Shared_Dto_Web_Api_Response_Meta$: dtoMeta,
        }
    ) {
        // VARS
        const ROUTE = `/${DEF.SPACE}/${DEF.ROUTE_ACCOUNT}/${DEF.ROUTE_ACCOUNT_DELETE}`;

        // MAIN
        /**
         * Constructs and populates the request DTO.
         *
         * @param {Svelters_Shared_Web_End_Account_Delete.Request|*} [data]
         * @returns {Svelters_Shared_Web_End_Account_Delete.Request}
         */
        this.createReq = function (data) {
            const res = new Request();
            // Creating the data structure for the entire hierarchy
            res.xsrfToken = cast.string(data?.xsrfToken);
            return res;
        };

        /**
         * Constructs and populates the response DTO.
         *
         * @param {Svelters_Shared_Web_End_Account_Delete.Response|*} [data]
         * @returns {Svelters_Shared_Web_End_Account_Delete.Response}
         */
        this.createRes = function (data) {
            const res = new Response();
            // Creating the data structure for the entire hierarchy
            res.meta = dtoMeta.create(data?.meta);
            return res;
        };

        /**
         * Provides access to the fixed set of result codes for this endpoint.
         *
         * @returns {typeof Svelters_Shared_Web_End_Account_Delete.ResultCode}
         */
        this.getResultCodes = () => ResultCode;

        /**
         * Provides access to the route for this endpoint.
         * @returns {string}
         */
        this.getRoute = () => ROUTE;
    }
}

/**
 * Request DTO representing the expected payload from the client.
 *
 * @memberOf Svelters_Shared_Web_End_Account_Delete
 */
class Request {
    /**
     * XSRF token for request validation.
     * @type {string}
     */
    xsrfToken;
}

/**
 * Response DTO for this endpoint.
 * Currently, it carries no data but maintains structural consistency.
 *
 * @memberOf Svelters_Shared_Web_End_Account_Delete
 */
class Response {
    /**
     * Standard structure for transmitting information to a client about the request processing results.
     * @type {Svelters_Shared_Dto_Web_Api_Response_Meta.Dto}
     */
    meta;
}

/**
 * @memberOf Svelters_Shared_Web_End_Account_Delete
 */
const ResultCode = {
    /**
     * Indicates successful operation.
     */
    SUCCESS: 'SUCCESS',
    /**
     * Default error state for undefined failures.
     */
    UNKNOWN: 'UNKNOWN',
    /**
     * Indicates that the XSRF token is invalid or not provided.
     */
    XSRF_TOKEN_INVALID: 'XSRF_TOKEN_INVALID',
};
Object.freeze(ResultCode);
