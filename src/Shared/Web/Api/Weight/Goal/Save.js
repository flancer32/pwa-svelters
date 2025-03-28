/**
 * API Endpoint: Save or update a user goal weight entry.
 *
 * Accepts user-defined target body weight data with a target date,
 * creates a new record or updates an existing one based on availability.
 * Returns metadata indicating whether the operation was an insert or an update.
 *
 * @implements Svelters_Shared_Api_Endpoint
 */
export default class Svelters_Shared_Web_Api_Weight_Goal_Save {
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
         * @param {Svelters_Shared_Web_Api_Weight_Goal_Save.Request} [data]
         * @return {Svelters_Shared_Web_Api_Weight_Goal_Save.Request}
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
         * @param {Svelters_Shared_Web_Api_Weight_Goal_Save.Response} [data]
         * @returns {Svelters_Shared_Web_Api_Weight_Goal_Save.Response}
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
         * @returns {typeof Svelters_Shared_Web_Api_Weight_Goal_Save.ResultCode}
         */
        this.getResultCodes = () => ResultCode;
    }
}

/**
 * @memberOf Svelters_Shared_Web_Api_Weight_Goal_Save
 */
class Request {
    /**
     * Target weight data defined by the user.
     * @type {Svelters_Shared_Dto_Weight.Dto}
     */
    weight;
}

/**
 * @memberOf Svelters_Shared_Web_Api_Weight_Goal_Save
 */
class Response {
    /**
     * Metadata about the result of the request processing.
     * @type {Svelters_Shared_Dto_Web_Api_Response_Meta.Dto}
     */
    meta;
}

/**
 * @memberOf Svelters_Shared_Web_Api_Weight_Goal_Save
 */
const ResultCode = {
    /**
     * A new goal weight entry was successfully created (record inserted).
     */
    SUCCESS_INSERTED: 'SUCCESS_INSERTED',

    /**
     * An existing goal weight entry was successfully updated (record modified).
     */
    SUCCESS_UPDATED: 'SUCCESS_UPDATED',

    /**
     * An unknown error occurred during request processing.
     */
    UNKNOWN: 'UNKNOWN',
};
Object.freeze(ResultCode);
