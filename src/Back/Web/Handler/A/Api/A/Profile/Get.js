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
     * @param {Fl64_Web_Session_Back_Manager} mgrSession - Session manager
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper - Database transaction wrapper
     * @param {Svelters_Shared_Web_Api_Profile_Get} endpoint
     * @param {Fl64_OAuth2_Back_Manager} oauth2
     * @param {Svelters_Back_Store_RDb_Repo_User} repoUser
     * @param {Svelters_Back_Store_RDb_Repo_User_Profile} repoProfile
     */
    constructor({
                    TeqFw_Core_Shared_Api_Logger$$: logger,
                    TeqFw_Web_Back_Help_Respond$: respond,
                    TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
                    Svelters_Back_Web_Handler_A_Z_Helper$: zHelper,
                    Svelters_Shared_Web_Api_Profile_Get$: endpoint,
                    Fl64_OAuth2_Back_Manager$: oauth2,
                    Svelters_Back_Store_RDb_Repo_User$: repoUser,
                    Svelters_Back_Store_RDb_Repo_User_Profile$: repoProfile,
                }) {
        // VARS
        const RESULT = endpoint.getResultCodes();

        // FUNCS

        // MAIN
        /**
         * Handles incoming HTTP requests to save or update a calorie log draft.
         * Validates input data, checks totals, and processes the request based on authorization.
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
                    // Get authorization info
                    const {isAuthorized, userId} = await oauth2.authorize({req, trx});
                    if (isAuthorized) {
                        logger.info(`Profile request from user #${userId}.`);
                        response.meta.ok = true;
                        response.meta.code = RESULT.SUCCESS;
                        // load base user data
                        const {record: foundUser} = await repoUser.readOne({trx, key: userId});
                        response.profile.dateCreated = foundUser.date_created;
                        response.profile.uuid = foundUser.uuid;
                        // load user profile data
                        const {record: foundProfile} = await repoProfile.readOne({trx, key: userId});
                        if (foundProfile) {
                            response.profile.dateBirth = foundProfile.date_birth;
                            response.profile.dateUpdated = foundProfile.date_updated;
                            response.profile.goal = foundProfile.goal;
                            response.profile.height = foundProfile.height;
                            response.profile.locale = foundProfile.locale;
                            response.profile.name = foundProfile.name;
                            response.profile.timezone = foundProfile.timezone;
                        }
                        // TODO: add weight

                        // Send the response
                        const body = JSON.stringify(response);
                        respond.code200_Ok({
                            res,
                            headers: {[HTTP2_HEADER_CONTENT_TYPE]: 'application/json'},
                            body,
                        });
                        logger.info(`Response: ${body}`);
                    } else {
                        respond.code401_Unauthorized({res});
                    }
                });
            } catch (e) {
                logger.exception(e);
                respond.code500_InternalServerError({res, body: e?.message});
            }
        };

    }
}
