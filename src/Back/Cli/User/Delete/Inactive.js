/* eslint-disable jsdoc/check-param-names */
/**
 * CLI command to batch-initiate deletion of inactive user accounts.
 *
 * Criteria:
 * - The user must be active.
 * - The account must be older than 7 days.
 * - No records in calorie log, weight logs, or profile.
 * - Not verified in the OTP registry.
 * - Last session activity was more than 7 days ago.
 * - No feedback records.
 *
 * For each selected user, the deletion process is initiated (account status set to DELETING).
 *
 * @namespace Svelters_Back_Cli_User_Delete_Inactive
 *
 * @param {Svelters_Back_Defaults} DEF - Global application defaults
 * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger service
 * @param {TeqFw_Core_Back_Api_Dto_Command.Factory} fCommand - Factory for CLI command DTOs
 * @param {TeqFw_Core_Back_App} app - Application lifecycle manager
 * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper - Database transaction wrapper
 * @param {TeqFw_Db_Shared_Util_Select} utilSelect
 * @param {Fl64_Auth_Otp_Back_Store_RDb_Repo_Email} repoEmailOtp
 * @param {Svelters_Back_Store_RDb_Repo_Calorie_Log_Draft} repoCalorieLogDraft
 * @param {Svelters_Back_Store_RDb_Repo_Calorie_Log_Final} repoCalorieLogFinal
 * @param {Svelters_Back_Store_RDb_Repo_Feedback_Inbox} repoFeedbackInbox
 * @param {Svelters_Back_Store_RDb_Repo_User} repoUser
 * @param {Svelters_Back_Store_RDb_Repo_User_Profile} repoProfile
 * @param {Svelters_Back_Store_RDb_Repo_Weight_Goal} repoWeightGoal
 * @param {Svelters_Back_Store_RDb_Repo_Weight_Log} repoWeightLog
 * @param {Svelters_Back_Act_Account_Delete_Init} actInit - Action to initiate account deletion
 * @param {typeof Svelters_Shared_Enum_User_State} STATE
 * @param {typeof Fl64_Auth_Otp_Shared_Enum_Status} OTP
 *
 * @returns {TeqFw_Core_Back_Api_Dto_Command}
 */
export default function Factory(
    {
        Svelters_Back_Defaults$: DEF,
        TeqFw_Core_Shared_Api_Logger$$: logger,
        'TeqFw_Core_Back_Api_Dto_Command.Factory$': fCommand,
        TeqFw_Core_Back_App$: app,
        TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
        TeqFw_Db_Shared_Util_Select$: utilSelect,
        Fl64_Auth_Otp_Back_Store_RDb_Repo_Email$: repoEmailOtp,
        Svelters_Back_Store_RDb_Repo_Calorie_Log_Draft$: repoCalorieLogDraft,
        Svelters_Back_Store_RDb_Repo_Calorie_Log_Final$: repoCalorieLogFinal,
        Svelters_Back_Store_RDb_Repo_Feedback_Inbox$: repoFeedbackInbox,
        Svelters_Back_Store_RDb_Repo_User$: repoUser,
        Svelters_Back_Store_RDb_Repo_User_Profile$: repoProfile,
        Svelters_Back_Store_RDb_Repo_Weight_Goal$: repoWeightGoal,
        Svelters_Back_Store_RDb_Repo_Weight_Log$: repoWeightLog,
        Svelters_Back_Act_Account_Delete_Init$: actInit,
        Svelters_Shared_Enum_User_State$: STATE,
        Fl64_Auth_Otp_Shared_Enum_Status$: OTP,
    }
) {
    // VARS
    const A_CAL_DRAFT = repoCalorieLogDraft.getSchema().getAttributes();
    const A_CAL_FINAL = repoCalorieLogFinal.getSchema().getAttributes();
    const A_FEED = repoFeedbackInbox.getSchema().getAttributes();
    const A_OTP = repoEmailOtp.getSchema().getAttributes();
    const A_PROFILE = repoProfile.getSchema().getAttributes();
    const A_USER = repoUser.getSchema().getAttributes();
    const A_WEIGHT_GOAL = repoWeightGoal.getSchema().getAttributes();
    const A_WEIGHT_LOG = repoWeightLog.getSchema().getAttributes();
    const DATE_WEEKS_AGO = formatDate();
    const DIR = utilSelect.getDirections();
    const FUNC = utilSelect.getFunctions();

    // FUNCS

    function formatDate() {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
        return weekAgo.toISOString().split('T')[0]; // format 'YYYY-MM-DD'
    }

    /**
     * CLI command action to batch-initiate deletion of inactive accounts.
     *
     * @returns {Promise<void>}
     */
    async function action() {
        // FUNCS


        /**
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @returns {Promise<void>}
         */
        async function selectInactiveUsers(trx) {
            // FUNC

            /**
             * @param {TeqFw_Db_Back_RDb_ITrans} trx
             * @param {number} userId
             * @returns {Promise<boolean>}
             */
            async function checkCaloriesLogDraft(trx, userId) {
                const selection = utilSelect.compose({conditions: {[A_CAL_DRAFT.USER_REF]: userId}});
                const {records} = await repoCalorieLogDraft.readMany({trx, selection});
                return records.length === 0;
            }

            /**
             * @param {TeqFw_Db_Back_RDb_ITrans} trx
             * @param {number} userId
             * @returns {Promise<boolean>}
             */
            async function checkCaloriesLogFinal(trx, userId) {
                const selection = utilSelect.compose({conditions: {[A_CAL_FINAL.USER_REF]: userId}});
                const {records} = await repoCalorieLogFinal.readMany({trx, selection});
                return records.length === 0;
            }

            /**
             * @param {TeqFw_Db_Back_RDb_ITrans} trx
             * @param {number} userId
             * @returns {Promise<boolean>}
             */
            async function checkFeedback(trx, userId) {
                const selection = utilSelect.compose({conditions: {[A_FEED.USER_REF]: userId}});
                const {records} = await repoFeedbackInbox.readMany({trx, selection});
                return records.length === 0;
            }

            /**
             * @param {TeqFw_Db_Back_RDb_ITrans} trx
             * @param {number} userId
             * @returns {Promise<boolean>}
             */
            async function checkProfile(trx, userId) {
                const selection = utilSelect.compose({conditions: {[A_PROFILE.USER_REF]: userId}});
                const {records} = await repoProfile.readMany({trx, selection});
                return records.length === 0;
            }

            /**
             * @param {TeqFw_Db_Back_RDb_ITrans} trx
             * @param {number} userId
             * @returns {Promise<boolean>}
             */
            async function checkWeightGoal(trx, userId) {
                const selection = utilSelect.compose({conditions: {[A_WEIGHT_GOAL.USER_REF]: userId}});
                const {records} = await repoWeightGoal.readMany({trx, selection});
                return records.length === 0;
            }

            /**
             * @param {TeqFw_Db_Back_RDb_ITrans} trx
             * @param {number} userId
             * @returns {Promise<boolean>}
             */
            async function checkWeightLog(trx, userId) {
                const selection = utilSelect.compose({conditions: {[A_WEIGHT_LOG.USER_REF]: userId}});
                const {records} = await repoWeightLog.readMany({trx, selection});
                return records.length === 0;
            }

            /**
             * @param {TeqFw_Db_Back_RDb_ITrans} trx
             * @param {number} userId
             * @returns {Promise<boolean>}
             */
            async function checkOtp(trx, userId) {
                const {record} = await repoEmailOtp.readOne({trx, key: userId});
                return !record || record.status === OTP.UNVERIFIED;
            }

            // MAIN
            const res = [];
            // create an initial selection criteria
            const selection = utilSelect.compose({
                conditions: {[A_USER.STATE]: STATE.ACTIVE},
                sorting: {[A_USER.ID]: DIR.ASC},
            });
            // add a filter: include only accounts created more than 7 days ago
            selection.filter.items.push({
                name: FUNC.LT,
                params: [
                    {alias: A_USER.DATE_CREATED},
                    {value: DATE_WEEKS_AGO}
                ]
            });
            // select all users
            const {records: foundUsers} = await repoUser.readMany({trx, selection});
            for (const user of foundUsers) {
                if (
                    (await checkCaloriesLogDraft(trx, user.id)) &&
                    (await checkCaloriesLogFinal(trx, user.id)) &&
                    (await checkFeedback(trx, user.id)) &&
                    (await checkProfile(trx, user.id)) &&
                    (await checkWeightGoal(trx, user.id)) &&
                    (await checkWeightLog(trx, user.id)) &&
                    (await checkOtp(trx, user.id))
                ) {
                    res.push(user.id);
                }

            }
            return res;
        }

        // MAIN
        try {
            const prompt = 'Start batch deletion of inactive users? [Y/n] ';
            const input = await readInput(prompt);
            if (!/^y(es)?$/i.test(input.trim())) {
                logger.info('Operation canceled by user.');
            } else {
                await trxWrapper.execute(null, async (trx) => {
                    logger.info('Account deletion process started for eligible users.');
                    const ids = await selectInactiveUsers(trx);
                    for (const id of ids) {
                        const {ok} = await actInit.run({
                            trx,
                            userId: id,
                            emailTmpl: '/account/delete/init/cli',
                        });
                        if (ok) {
                            logger.info(`Account deletion initiated for user #${id}.`);
                        } else {
                            logger.error(`Account deletion initialization failed for user #${id}.`);
                        }
                    }
                });
            }
        } catch (err) {
            logger.error(err.message);
            throw new Error('Failed to initiate batch deletion of inactive accounts.');
        } finally {
            await app.stop();
        }
    }

    /**
     * Read input from the console.
     *
     * @param {string} question - Prompt for the user
     * @returns {Promise<string>} - User input
     */
    function readInput(question) {
        return new Promise((resolve) => {
            process.stdout.write(question);
            process.stdin.setEncoding('utf8');
            process.stdin.once('data', (data) => {
                resolve(data);
                process.stdin.pause(); // stop the waiting
            });
        });
    }

    // MAIN
    const res = fCommand.create();
    res.realm = DEF.CLI_PREFIX;
    res.name = 'user-delete-inactive';
    res.desc = 'initiate deletion for inactive users (batch mode)';
    res.action = action;

    return res;
}
