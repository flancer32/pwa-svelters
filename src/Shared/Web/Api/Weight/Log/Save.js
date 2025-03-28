/**
 * API Endpoint: Save or update a user weight entry.
 *
 * Accepts user-submitted body weight data for a specific date,
 * creates a new record or updates an existing one depending on availability.
 * Returns metadata indicating whether the operation resulted in an insert or an update.
 *
 * @implements Svelters_Shared_Api_Endpoint
 */
export default class Svelters_Shared_Web_Api_Weight_Log_Save {
    /**
     * @param {Svelters_Shared_Dto_Web_Api_Response_Meta} dtoMeta - DTO for response metadata.
     * @param {Svelters_Shared_Dto_Weight} dtoWeight - DTO for weight data.
     */
    constructor(
        {
            Svelters_Shared_Dto_Web_Api_Response_Meta$: dtoMeta,
            Svelters_Shared_Dto_Weight$: dtoWeight,
        }
    ) {
        // INSTANCE METHODS

        /**
         * Create a request DTO from raw input.
         *
         * @param {Svelters_Shared_Web_Api_Weight_Log_Save.Request} [data]
         * @return {Svelters_Shared_Web_Api_Weight_Log_Save.Request}
         */
        this.createReq = function (data) {
            const res = new Request();
            // Create DTO properties even without initial data.
            res.weight = dtoWeight.create(data?.weight);
            return res;
        };

        /**
         * Create a response DTO from raw input.
         *
         * @param {Svelters_Shared_Web_Api_Weight_Log_Save.Response} [data]
         * @returns {Svelters_Shared_Web_Api_Weight_Log_Save.Response}
         */
        this.createRes = function (data) {
            const res = new Response();
            // Create DTO properties even without initial data.
            res.meta = dtoMeta.create(data?.meta);
            return res;
        };

        /**
         * Get available result codes for this API endpoint.
         *
         * @returns {typeof Svelters_Shared_Web_Api_Weight_Log_Save.ResultCode}
         */
        this.getResultCodes = () => ResultCode;
    }
}

/**
 * @memberOf Svelters_Shared_Web_Api_Weight_Log_Save
 */
class Request {
    /**
     * User weight data to be saved.
     * @type {Svelters_Shared_Dto_Weight.Dto}
     */
    weight;
}

/**
 * @memberOf Svelters_Shared_Web_Api_Weight_Log_Save
 */
class Response {
    /**
     * Metadata about the result of the request processing.
     * @type {Svelters_Shared_Dto_Web_Api_Response_Meta.Dto}
     */
    meta;
}

/**
 * @memberOf Svelters_Shared_Web_Api_Weight_Log_Save
 */
const ResultCode = {
    /**
     * The weight entry was successfully created (new record inserted).
     */
    SUCCESS_INSERTED: 'SUCCESS_INSERTED',

    /**
     * The weight entry was successfully updated (existing record modified).
     */
    SUCCESS_UPDATED: 'SUCCESS_UPDATED',

    /**
     * An unknown error occurred during request processing.
     */
    UNKNOWN: 'UNKNOWN',
};
Object.freeze(ResultCode);
