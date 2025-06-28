/**
 * Handles submission of user feedback from the Assistant.
 *
 * Verifies user authorization, validates the payload, saves feedback to the database,
 * and sends an email notification to the support team.
 *
 * Route: `/app/api/feedback/submit`
 */
export default class Svelters_Back_Web_Handler_A_Api_A_Feedback_Submit {
    /**
     * @param {typeof import('node:http2')} http2
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {Fl32_Web_Back_Helper_Respond} respond
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper
     * @param {TeqFw_Email_Back_Act_Send} actEmail
     * @param {Fl64_OAuth2_Back_Manager} oauth2
     * @param {Svelters_Back_Store_RDb_Repo_Feedback_Inbox} repoInbox
     * @param {Svelters_Back_Web_Handler_A_Z_Helper} zHelper
     * @param {Svelters_Shared_Web_Api_Feedback_Submit} endpoint
     */
    constructor(
        {
            'node:http2': http2,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl32_Web_Back_Helper_Respond$: respond,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            TeqFw_Email_Back_Act_Send$: actEmail,
            Fl64_OAuth2_Back_Manager$: oauth2,
            Svelters_Back_Store_RDb_Repo_Feedback_Inbox$: repoInbox,
            Svelters_Back_Web_Handler_A_Z_Helper$: zHelper,
            Svelters_Shared_Web_Api_Feedback_Submit$: endpoint,
        }
    ) {
        // VARS
        const {
            HTTP2_HEADER_CONTENT_TYPE,
        } = http2.constants;
        const A_INBOX = repoInbox.getSchema().getAttributes();
        const RESULT = endpoint.getResultCodes();

        // MAIN

        /**
         * Processes an HTTP request containing user feedback.
         *
         * Authorizes the user, validates the incoming payload, stores the feedback in the database,
         * and triggers an email notification with the feedback summary.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object
         * @returns {Promise<boolean>}
         */
        this.run = async function (req, res) {
            const response = endpoint.createRes();
            response.meta.code = RESULT.UNKNOWN;
            response.meta.ok = false;
            /** @type {Svelters_Shared_Web_Api_Feedback_Submit.Request} */
            const payload = await zHelper.parsePostedData(req);
            const dtoFeedback = payload.feedback;

            return trxWrapper.execute(null, async (trx) => {
                const {isAuthorized, userId} = await oauth2.authorize({req, trx});
                if (isAuthorized) {
                    logger.info(`Received feedback from user #${userId}: ${JSON.stringify(payload)}`);
                    const dto = repoInbox.createDto();
                    dto.date_created = new Date();
                    dto.lang = (dtoFeedback?.lang?.length > 0) ? dtoFeedback.lang : null;
                    dto.subject = dtoFeedback.subject;
                    dto.text_en = dtoFeedback.textEn;
                    dto.text_origin = (dtoFeedback?.textOrigin?.length > 0) ? dtoFeedback.textOrigin : null;
                    dto.user_ref = userId;

                    const {primaryKey: {[A_INBOX.ID]: id}} = await repoInbox.createOne({trx, dto});
                    logger.info(`Registered feedback #${id} from user #${userId}.`);

                    actEmail.act({
                        to: 'alex@wiredgeese.com',
                        subject: `NutriLog Feedback: ${dto.subject}`,
                        text: dto.text_en,
                    }).catch(logger.exception);

                    response.meta.ok = true;
                    response.meta.code = RESULT.SUCCESS;

                    respond.code200_Ok({
                        res,
                        headers: {[HTTP2_HEADER_CONTENT_TYPE]: 'application/json'},
                        body: JSON.stringify(response),
                    });
                } else {
                    respond.code401_Unauthorized({res});
                }
                return true;
            });
        };
    }
}
