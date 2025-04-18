/**
 * Sends an account deletion notification email to the user.
 * @implements TeqFw_Core_Shared_Api_Service
 */
export default class Svelters_Back_Email_Account_Delete_Init {
    /**
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper
     * @param {Fl64_Tmpl_Back_Service_Render} servRender
     * @param {TeqFw_Email_Back_Act_Send} actSend
     * @param {Svelters_Back_Act_User_Profile_Read} actProfileRead
     * @param {typeof Fl64_Tmpl_Back_Enum_Type} TMPL_TYPE
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Fl64_Tmpl_Back_Service_Render$: servRender,
            TeqFw_Email_Back_Act_Send$: actSend,
            Svelters_Back_Act_User_Profile_Read$: actProfileRead,
            Fl64_Tmpl_Back_Enum_Type$: TMPL_TYPE,
        }
    ) {
        // VARS
        const TMPL_NAME = '/account/delete/init';

        // FUNCS

        /**
         * Renders the email content for account deletion request.
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {Svelters_Shared_Dto_User_Profile.Dto} profile
         * @returns {Promise<{html: string, text: string, subject: string}>}
         */
        async function prepareContent(trx, profile) {
            const {locale} = profile;
            const localeApp = DEF.SHARED.LOCALE;

            const {content: html} = await servRender.perform({
                type: TMPL_TYPE.EMAIL,
                name: TMPL_NAME + '.html',
                localeUser: locale,
                localeApp,
            });

            const {content: text} = await servRender.perform({
                type: TMPL_TYPE.EMAIL,
                name: TMPL_NAME + '.txt',
                localeUser: locale,
                localeApp,
            });

            const {content: meta} = await servRender.perform({
                type: TMPL_TYPE.EMAIL,
                name: TMPL_NAME + '.meta.json',
                localeUser: locale,
                localeApp,
            });

            const subject = JSON.parse(meta).subject;

            return {html, text, subject};
        }

        // MAIN

        /**
         * Sends an account deletion confirmation message to the user.
         * @param {Object} [params={}] - Optional parameters.
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx] - Optional transaction context.
         * @param {number} params.userId - ID of the user to notify.
         * @returns {Promise<{resultCode: string}>}
         */
        this.perform = async function ({trx: trxOuter, userId}) {
            let resultCode = RESULT_CODES.UNKNOWN_ERROR;

            await trxWrapper.execute(trxOuter, async function (trx) {
                const {profile} = await actProfileRead.run({trx, userId});
                if (!profile) {
                    resultCode = RESULT_CODES.USER_NOT_FOUND;
                    logger.info(`User not found: userId=${userId}`);
                    return;
                }

                if (!profile.email) {
                    resultCode = RESULT_CODES.EMAIL_MISSED;
                    logger.info(`User #${userId} does not have an email address.`);
                    return;
                }

                const {html, text, subject} = await prepareContent(trx, profile);
                const {success} = await actSend.act({
                    to: profile.email,
                    subject,
                    text,
                    html,
                });

                resultCode = success ? RESULT_CODES.SUCCESS : RESULT_CODES.EMAIL_SEND_FAILED;

                logger.info(`Account deletion email ${success ? 'sent' : 'failed'} for userId=${userId}`);
            });

            return {resultCode};
        };

        /**
         * Provides result codes for the service execution.
         * @returns {typeof Svelters_Back_Email_Account_Delete_Init.RESULT_CODES}
         */
        this.getResultCodes = () => RESULT_CODES;
    }
}

// VARS

/**
 * Possible result codes for the service.
 * @memberOf Svelters_Back_Email_Account_Delete_Init
 */
const RESULT_CODES = {
    EMAIL_MISSED: 'EMAIL_MISSED',
    EMAIL_SEND_FAILED: 'EMAIL_SEND_FAILED',
    SUCCESS: 'SUCCESS',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
};

Object.freeze(RESULT_CODES);
