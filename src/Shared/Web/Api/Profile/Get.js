/**
 * @memberOf Svelters_Shared_Web_Api_Profile_Get
 */
class Request {}

/**
 * @memberOf Svelters_Shared_Web_Api_Profile_Get
 */
class Response {
    /**
     * Standard structure for transmitting information to GPT-chat about the request processing results.
     * @type {Svelters_Shared_Dto_Web_Api_Response_Meta.Dto}
     */
    meta;
    /**
     * Aggregation of available data in the user's profile.
     * @type {Svelters_Shared_Dto_User_Profile.Dto}
     */
    profile;
}

/**
 * @memberOf Svelters_Shared_Web_Api_Profile_Get
 */
const ResultCode = {
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

/**
 * Description of the request and response structure for user profile endpoint calls.
 * @implements Svelters_Shared_Api_Endpoint
 */
export default class Svelters_Shared_Web_Api_Profile_Get {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast - Utility for type conversions.
     * @param {Svelters_Shared_Dto_Web_Api_Response_Meta} dtoMeta
     * @param {Svelters_Shared_Dto_User_Profile} dtoProfile
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
            Svelters_Shared_Dto_Web_Api_Response_Meta$: dtoMeta,
            Svelters_Shared_Dto_User_Profile$: dtoProfile,
        }
    ) {
        // INSTANCE METHODS

        /**
         * Factory for creating the request structure.
         * @param {Svelters_Shared_Web_Api_Profile_Get.Request} [data] - Reserved for future use
         * @return {Svelters_Shared_Web_Api_Profile_Get.Request}
         */
        this.createReq = function (data) {
            return new Request();
        };

        /**
         * Factory for creating the response structure.
         * @param {Svelters_Shared_Web_Api_Profile_Get.Response} [data]
         * @returns {Svelters_Shared_Web_Api_Profile_Get.Response}
         */
        this.createRes = function (data) {
            const res = new Response();
            // Creating the data structure for the entire hierarchy, as it is used in the handler
            res.meta = dtoMeta.create(data?.meta);
            res.profile = dtoProfile.create(data?.profile);
            return res;
        };

        /**
         * @returns {typeof Svelters_Shared_Web_Api_Profile_Get.ResultCode}
         */
        this.getResultCodes = () => ResultCode;
    }

}
