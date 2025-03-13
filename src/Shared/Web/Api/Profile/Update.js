/**
 * Description of the request and response structure for user profile endpoint calls.
 * @implements Svelters_Shared_Api_Endpoint
 */
export default class Svelters_Shared_Web_Api_Profile_Update {
    /**
     * @param {Svelters_Shared_Dto_Web_Api_Response_Meta} dtoMeta
     * @param {Svelters_Shared_Dto_User_Profile} dtoProfile
     */
    constructor(
        {
            Svelters_Shared_Dto_Web_Api_Response_Meta$: dtoMeta,
            Svelters_Shared_Dto_User_Profile$: dtoProfile,
        }
    ) {
        // INSTANCE METHODS

        /**
         * Factory for creating the request structure.
         * @param {Svelters_Shared_Web_Api_Profile_Update.Request} [data] - Reserved for future use
         * @return {Svelters_Shared_Web_Api_Profile_Update.Request}
         */
        this.createReq = function (data) {
            const res = new Request();
            // Creating the data structure for the entire hierarchy, as it is used in the handler
            res.profile = dtoProfile.create(data?.profile);
            return res;
        };

        /**
         * Factory for creating the response structure.
         * @param {Svelters_Shared_Web_Api_Profile_Update.Response} [data]
         * @returns {Svelters_Shared_Web_Api_Profile_Update.Response}
         */
        this.createRes = function (data) {
            const res = new Response();
            // Create DTO properties even without initial data.
            res.meta = dtoMeta.create(data?.meta);
            return res;
        };

        /**
         * @returns {typeof Svelters_Shared_Web_Api_Profile_Update.ResultCode}
         */
        this.getResultCodes = () => ResultCode;
    }

}

/**
 * @memberOf Svelters_Shared_Web_Api_Profile_Update
 */
class Request {
    /**
     * Aggregation of available data in the user's profile.
     * @type {Svelters_Shared_Dto_User_Profile.Dto}
     */
    profile;
}

/**
 * @memberOf Svelters_Shared_Web_Api_Profile_Update
 */
class Response {
    /**
     * Standard structure for transmitting information to GPT-chat about the request processing results.
     * @type {Svelters_Shared_Dto_Web_Api_Response_Meta.Dto}
     */
    meta;
}

/**
 * @memberOf Svelters_Shared_Web_Api_Profile_Update
 */
const ResultCode = {
    /**
     * User's subscription has expired, preventing profile update.
     */
    SUBSCRIPTION_EXPIRED: 'SUBSCRIPTION_EXPIRED',
    /**
     * User profile successfully loaded, as much as possible (based on available data).
     */
    SUCCESS: 'SUCCESS',
    /**
     * Initial error code. Should not appear in results during normal operation.
     */
    UNKNOWN: 'UNKNOWN',
};
Object.freeze(ResultCode);

