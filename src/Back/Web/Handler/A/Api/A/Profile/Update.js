import {constants as H2} from 'node:http2';

// VARS
const {
    HTTP2_HEADER_CONTENT_TYPE,
} = H2;

/**
 * Route: `/app/api/profile/update`
 */
export default class Svelters_Back_Web_Handler_A_Api_A_Profile_Update {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger instance
     * @param {TeqFw_Web_Back_Help_Respond} respond - Error response helper
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper - Database transaction wrapper
     * @param {Svelters_Shared_Web_Api_Profile_Update} endpoint
     * @param {Fl64_OAuth2_Back_Manager} oauth2
     * @param {Svelters_Back_Web_Handler_A_Z_Helper} zHelper
     * @param {Svelters_Back_Store_RDb_Repo_User_Profile} repoProfile
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Back_Help_Respond$: respond,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Svelters_Shared_Web_Api_Profile_Update$: endpoint,
            Fl64_OAuth2_Back_Manager$: oauth2,
            Svelters_Back_Web_Handler_A_Z_Helper$: zHelper,
            Svelters_Back_Store_RDb_Repo_User_Profile$: repoProfile,
        }
    ) {
        // VARS
        const RESULT = endpoint.getResultCodes();

        // MAIN
        /**
         * Handles incoming HTTP requests to update user profile data.
         * Validates authorization, updates user profile data, and sends the response.
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
            const updatedFields = [];

            /** @type {Svelters_Shared_Web_Api_Profile_Update.Request} */
            const payload = await zHelper.parsePostedData(req);
            try {
                await trxWrapper.execute(null, async (trx) => {
                    // AUTHORIZATION
                    const {isAuthorized, userId} = await oauth2.authorize({req, trx});
                    if (isAuthorized) {
                        const profile = payload?.profile;
                        logger.info(`Received a request to update the profile for user #${userId}:`
                            + ` ${JSON.stringify(profile)}`);
                        if (Object.keys(profile)) {
                            // update app profile
                            const {record: foundProfile} = await repoProfile.readOne({trx, key: userId});
                            const dto = foundProfile ?? repoProfile.createDto();
                            if (profile.dateBirth !== dto.date_birth) {
                                dto.date_birth = profile.dateBirth;
                                updatedFields.push('dateBirth');
                            }
                            dto.date_updated = new Date();
                            if (profile.goal) {
                                dto.goal = profile.goal;
                                updatedFields.push('goal');
                            }
                            if (profile.height) {
                                dto.height = profile.height;
                                updatedFields.push('height');
                            }
                            if (profile.locale) {
                                dto.locale = profile.locale;
                                updatedFields.push('locale');
                            }
                            if (profile.name !== dto.name) {
                                dto.name = profile.name;
                                updatedFields.push('name');
                            }
                            if (profile.sex !== dto.sex) {
                                dto.sex = profile.sex;
                                updatedFields.push('sex');
                            }
                            if (profile.timezone) {
                                dto.timezone = profile.timezone;
                                updatedFields.push('timezone');
                            }
                            dto.user_ref = userId;
                            // persist updates
                            if (!foundProfile) {
                                await repoProfile.createOne({trx, dto});
                            } else {
                                await repoProfile.updateOne({trx, updates: dto});
                            }
                            response.meta.code = RESULT.SUCCESS;
                            response.meta.ok = true;
                            response.meta.message
                                = `The following fields were successfully updated: ${JSON.stringify(updatedFields)}`;
                        }
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
