import {constants as H2} from 'node:http2';

// VARS
const {
    HTTP2_HEADER_CONTENT_TYPE,
} = H2;

/**
 * Route: `/app/api/profile/get`
 */
export default class Svelters_Back_Web_Handler_A_Api_A_Profile_Get {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger instance
     * @param {TeqFw_Web_Back_Help_Respond} respond - Error response helper
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper - Database transaction wrapper
     * @param {Svelters_Shared_Web_Api_Profile_Get} endpoint
     * @param {Fl64_OAuth2_Back_Manager} oauth2
     * @param {Svelters_Back_Act_User_Profile_Read} actProfileRead
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Back_Help_Respond$: respond,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Svelters_Shared_Web_Api_Profile_Get$: endpoint,
            Fl64_OAuth2_Back_Manager$: oauth2,
            Svelters_Back_Act_User_Profile_Read$: actProfileRead,

        }
    ) {
        // VARS
        const RESULT = endpoint.getResultCodes();

        // MAIN
        /**
         * Handles incoming HTTP requests to retrieve user profile data.
         * Validates authorization, loads user and profile data, and sends the response.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object
         *
         * @returns {Promise<void>}
         */
        this.run = async function (req, res) {
            // VARS
            const response = endpoint.createRes();
            response.meta.code = RESULT.UNKNOWN;
            response.meta.ok = false;

            try {
                await trxWrapper.execute(null, async (trx) => {
                    // AUTHORIZATION
                    const {isAuthorized, userId} = await oauth2.authorize({req, trx});
                    if (isAuthorized) {
                        logger.info(`Received a request to retrieve the profile for user #${userId}.`);
                        response.meta.ok = true;
                        response.meta.code = RESULT.SUCCESS;
                        const {profile} = await actProfileRead.run({trx, userId});
                        response.profile = profile;
                        // Send the response
                        const body = JSON.stringify(response);
                        respond.code200_Ok({
                            res,
                            headers: {[HTTP2_HEADER_CONTENT_TYPE]: 'application/json'},
                            body,
                        });
                        logger.info(`Response sent: ${body}`);
                    } else {
                        respond.code401_Unauthorized({res});
                    }
                });
            } catch (e) {
                logger.exception(e);
                respond.code500_InternalServerError({
                    res,
                    body: `Internal server error: ${e?.message}`,
                });
            }
        };
    }
}
