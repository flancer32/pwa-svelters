/**
 * Route: `/app/api/profile/update`
 */
export default class Svelters_Back_Web_Handler_A_Api_A_Profile_Update {
    /**
     * @param {typeof import('node:http2')} http2
     * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger instance
     * @param {TeqFw_Web_Back_Help_Respond} respond - Error response helper
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper - Database transaction wrapper
     * @param {Svelters_Shared_Web_Api_Profile_Update} endpoint
     * @param {Fl64_OAuth2_Back_Manager} oauth2
     * @param {Svelters_Shared_Helper_Cast} helpCast
     * @param {Svelters_Back_Store_RDb_Repo_User_Profile} repoProfile
     * @param {Svelters_Back_Store_RDb_Repo_User} repoUser
     * @param {Svelters_Back_Web_Handler_A_Z_Helper} zHelper
     */
    constructor(
        {
            'node:http2': http2,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Back_Help_Respond$: respond,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Svelters_Shared_Web_Api_Profile_Update$: endpoint,
            Fl64_OAuth2_Back_Manager$: oauth2,
            Svelters_Shared_Helper_Cast$: helpCast,
            Svelters_Back_Store_RDb_Repo_User$: repoUser,
            Svelters_Back_Store_RDb_Repo_User_Profile$: repoProfile,
            Svelters_Back_Web_Handler_A_Z_Helper$: zHelper,
        }
    ) {
        // VARS
        const {
            HTTP2_HEADER_CONTENT_TYPE,
        } = http2.constants;
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

            // FUNCS

            /**
             * @param {TeqFw_Db_Back_RDb_ITrans} trx
             * @param {Svelters_Shared_Dto_User_Profile.Dto} profile
             * @param {number} userId
             * @returns {Promise<string[]>}
             */
            async function updateProfile(trx, profile, userId,) {
                const updatedFields = [];
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
                    if (profile.promptStart !== dto.prompt_start) {
                        dto.prompt_start = profile.promptStart;
                        updatedFields.push('promptStart');
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

                }
                return updatedFields;
            }

            // MAIN
            /** @type {Svelters_Shared_Web_Api_Profile_Update.Request} */
            const payload = await zHelper.parsePostedData(req);
            try {
                logger.info(`Payload: ${JSON.stringify(payload)}`);
                // use one transaction for all DB requests
                await trxWrapper.execute(null, async (trx) => {
                    // AUTHORIZATION
                    const {isAuthorized, userId} = await oauth2.authorize({req, trx});
                    if (isAuthorized) {
                        const profile = payload?.profile;
                        logger.info(`Received a request to update the profile for user #${userId}:`
                            + ` ${JSON.stringify(profile)}`);
                        // verify subscription date
                        const {record: user} = await repoUser.readOne({trx, key: userId});
                        if (user.date_subscription > new Date()) {
                            const updatedFields = await updateProfile(trx, profile, userId);
                            response.meta.code = RESULT.SUCCESS;
                            response.meta.ok = true;
                            response.meta.message
                                = `The following fields were successfully updated: ${JSON.stringify(updatedFields)}`;
                            // Send the response
                            const body = JSON.stringify(response);
                            respond.code200_Ok({
                                res,
                                headers: {[HTTP2_HEADER_CONTENT_TYPE]: 'application/json'},
                                body,
                            });
                            logger.info(`Response sent: ${body}`);
                        } else {
                            const date = helpCast.dateString(user.date_subscription);
                            response.meta.code = RESULT.SUBSCRIPTION_EXPIRED;
                            response.meta.message
                                = `The user's subscription expired on ${date}, so the profile couldn't be updated.`;
                            // Send the response
                            const body = JSON.stringify(response);
                            respond.code402_PaymentRequired({
                                res,
                                headers: {[HTTP2_HEADER_CONTENT_TYPE]: 'application/json'},
                                body,
                            });
                            logger.info(`Response sent: ${body}`);
                        }
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
