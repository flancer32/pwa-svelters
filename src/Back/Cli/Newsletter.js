/**
 * Factory function for a CLI command that sends newsletters to subscribers.
 * @namespace Svelters_Back_Cli_Newsletter
 *
 * @param {Svelters_Back_Defaults} DEF - Global application defaults
 * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger service
 * @param {TeqFw_Core_Back_Api_Dto_Command.Factory} fCommand - Factory for CLI command DTOs
 * @param {TeqFw_Core_Back_Api_Dto_Command_Option.Factory} fOpt - Factory for CLI command option DTOs
 * @param {TeqFw_Core_Back_App} app - Application lifecycle manager
 * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper
 * @param {TeqFw_Email_Back_Act_Send} actSend
 * @param {Fl64_Tmpl_Back_Service_Render} servRender
 * @param {Svelters_Back_Cli_Newsletter_A_Query} aQuery
 * @param {typeof Fl64_Tmpl_Back_Enum_Type} TMPL
 *
 * @returns {TeqFw_Core_Back_Api_Dto_Command}
 */
export default function Factory(
    {
        Svelters_Back_Defaults$: DEF,
        TeqFw_Core_Shared_Api_Logger$$: logger,
        'TeqFw_Core_Back_Api_Dto_Command.Factory$': fCommand,
        'TeqFw_Core_Back_Api_Dto_Command_Option.Factory$': fOpt,
        TeqFw_Core_Back_App$: app,
        TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
        TeqFw_Email_Back_Act_Send$: actSend,
        Fl64_Tmpl_Back_Service_Render$: servRender,
        Svelters_Back_Cli_Newsletter_A_Query$: aQuery,
        Fl64_Tmpl_Back_Enum_Type$: TMPL,
    }
) {
    // VARS
    const LOCALE = DEF.SHARED.LOCALE;

    // FUNCS
    /**
     * Action executed when the CLI command is invoked.
     *
     * @param {object} opts - Options provided by the CLI environment
     * @returns {Promise<void>}
     */
    async function action(opts) {
        const TMPL_NAME = '/news/20250425_cleanup';
        try {
            return await trxWrapper.execute(null, async (trx) => {

                // FUNCS

                /**
                 * Select all emails from the database.
                 * @param {TeqFw_Db_Back_RDb_ITrans} trx
                 * @returns {Promise<string[]>}
                 */
                async function selectEmails(trx) {
                    // FUNCS
                    /**
                     * Returns the email address of the given item.
                     * @param {Svelters_Back_Cli_Newsletter_A_Dto_Item.Dto} item
                     * @returns {string|null}
                     */
                    function getEmail(item) {
                        if (item.otpEmail) return item.otpEmail;
                        if (item.uid && item.uid.includes('@')) return item.uid;
                        return null;
                    }

                    // MAIN
                    const query = aQuery.build(trx);
                    /** @type {Svelters_Back_Cli_Newsletter_A_Dto_Item.Dto[]} */
                    const items = await query;
                    /** @type {Object.<number, string>} */
                    const emailById = {};
                    for (const item of items) {
                        if (!emailById[item.id]) {
                            const email = getEmail(item);
                            if (email) emailById[item.id] = email;
                        }
                    }
                    return Object.values(emailById);
                }

                // MAIN
                const {content: html} = await servRender.perform({
                    type: TMPL.EMAIL,
                    name: TMPL_NAME + '/body.html',
                    localeApp: LOCALE,
                });
                const {content: text} = await servRender.perform({
                    type: TMPL.EMAIL,
                    name: TMPL_NAME + '/body.txt',
                    localeApp: LOCALE,
                });
                const {content: meta} = await servRender.perform({
                    type: TMPL.EMAIL,
                    name: TMPL_NAME + '/meta.json',
                    localeApp: LOCALE,
                });
                const subject = JSON.parse(meta).subject;
                const emails = await selectEmails(trx);
                for (const email of emails) {
                    const {success} = await actSend.act({
                        to: email,
                        subject,
                        text,
                        html,
                    });
                    logger.info(`Newsletter email to '${email}' is ${success ? 'sent' : 'failed'}`);
                }
            });
        } catch (err) {
            logger.error(err.message);
            throw new Error('Newsletter sending error.');
        } finally {
            await app.stop(); // Ensures clean application shutdown before proceeding
        }
    }


    // MAIN
    const res = fCommand.create();
    res.realm = DEF.CLI_PREFIX;
    res.name = 'newsletter';
    res.desc = 'sends newsletters to subscribers.';
    res.action = action;

    return res;
}
