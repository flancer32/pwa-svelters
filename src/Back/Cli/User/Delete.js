/* eslint-disable jsdoc/check-param-names */
/**
 * Factory function for a CLI command that initiates the account deletion process.
 * The account will be deactivated and scheduled for permanent removal after 7 days.
 *
 * @namespace Svelters_Back_Cli_User_Delete
 *
 * @param {Svelters_Back_Defaults} DEF - Global application defaults
 * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger service
 * @param {TeqFw_Core_Back_Api_Dto_Command.Factory} fCommand - Factory for CLI command DTOs
 * @param {TeqFw_Core_Back_Api_Dto_Command_Option.Factory} fOpt - Factory for CLI command option DTOs
 * @param {TeqFw_Core_Back_App} app - Application lifecycle manager
 * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper - Database transaction wrapper
 * @param {Svelters_Back_Act_Account_Delete_Init} actInit - Action to initiate account deletion
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
        Svelters_Back_Act_Account_Delete_Init$: actInit,
    }
) {
    // VARS
    const OPT_ID = 'id';

    // FUNCS
    /**
     * CLI command action to initiate account deletion.
     * Disables access and schedules the account for permanent deletion.
     *
     * @param {object} opts - Options provided by the CLI
     * @param {string} opts.id - ID of the user to be scheduled for deletion
     * @returns {Promise<void>}
     */
    async function action(opts) {
        if (!opts[OPT_ID]) throw new Error(`Missing required option: --${OPT_ID}`);

        const userId = opts[OPT_ID];
        try {
            await trxWrapper.execute(null, async (trx) => {
                const {ok} = await actInit.run({
                    trx,
                    userId,
                    emailTmpl: '/account/delete/init/cli',
                });
                if (ok) {
                    logger.info(`Account deletion initiated for user #${userId}.`);
                } else {
                    logger.error(`Failed to initiate account deletion for user #${userId}.`);
                }
            });
        } catch (err) {
            logger.error(err.message);
            throw new Error('Failed to initiate account deletion.');
        } finally {
            await app.stop();
        }
    }

    // MAIN
    const res = fCommand.create();
    res.realm = DEF.CLI_PREFIX;
    res.name = 'user-delete-init';
    res.desc = 'initiate the account deletion process';
    res.action = action;

    const optId = fOpt.create();
    optId.flags = `-i, --${OPT_ID} [number]`;
    optId.description = 'ID of the user to schedule for deletion';
    res.opts.push(optId);

    return res;
}
