/**
 * Action that reads a user profile.
 *
 * @implements {TeqFw_Core_Shared_Api_Action}
 */
export default class Svelters_Back_Act_User_Profile_Read {
    /**
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper
     * @param {TeqFw_Db_Shared_Util_Select} utilSelect
     * @param {Fl64_Auth_Otp_Back_Store_RDb_Repo_Email} repoOtpEmail
     * @param {Fl64_OAuth2_Social_Back_Store_RDb_Repo_User_Identity} repoIdentity
     * @param {Svelters_Back_Store_RDb_Repo_User} repoUser
     * @param {Svelters_Back_Store_RDb_Repo_User_Profile} repoProfile
     * @param {Svelters_Back_Store_RDb_Repo_Weight_Goal} repoWeightGoal
     * @param {Svelters_Back_Store_RDb_Repo_Weight_Log} repoWeightLog
     * @param {Svelters_Back_Act_Calorie_Log_GetLast} actLogGetLast
     * @param {Svelters_Shared_Dto_User_Profile} dtoProfile
     */
    constructor(
        {
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            TeqFw_Db_Shared_Util_Select$: utilSelect,
            Fl64_Auth_Otp_Back_Store_RDb_Repo_Email$: repoOtpEmail,
            Fl64_OAuth2_Social_Back_Store_RDb_Repo_User_Identity$: repoIdentity,
            Svelters_Back_Store_RDb_Repo_User$: repoUser,
            Svelters_Back_Store_RDb_Repo_User_Profile$: repoProfile,
            Svelters_Back_Store_RDb_Repo_Weight_Goal$: repoWeightGoal,
            Svelters_Back_Store_RDb_Repo_Weight_Log$: repoWeightLog,
            Svelters_Back_Act_Calorie_Log_GetLast$: actLogGetLast,
            Svelters_Shared_Dto_User_Profile$: dtoProfile,
        }
    ) {
        // VARS
        const A_IDENTITY = repoIdentity.getSchema().getAttributes();
        const A_OTP_EMAIL = repoOtpEmail.getSchema().getAttributes();
        const A_WEIGHT_GOAL = repoWeightGoal.getSchema().getAttributes();
        const A_WEIGHT_LOG = repoWeightLog.getSchema().getAttributes();
        const DIR = utilSelect.getDirections();

        // FUNCS
        /**
         * Read the current weight if exists.
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} userId
         * @returns {Promise<number|null>}
         */
        async function readWeight(trx, userId) {
            const selection = utilSelect.compose({
                conditions: {[A_WEIGHT_LOG.USER_REF]: userId},
                sorting: {[A_WEIGHT_LOG.DATE]: DIR.DESC},
                pagination: {limit: 1, offset: 0},
            });
            const {records} = await repoWeightLog.readMany({trx, selection});
            if (records.length === 1) {
                const [first] = records;
                return first.value / 1000;
            }
            return null;
        }

        /**
         * Read the target weight if exists.
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} userId
         * @returns {Promise<number|null>}
         */
        async function readWeightGoal(trx, userId) {
            const selection = utilSelect.compose({
                conditions: {[A_WEIGHT_GOAL.USER_REF]: userId},
                sorting: {[A_WEIGHT_GOAL.DATE]: DIR.DESC},
                pagination: {limit: 1, offset: 0},
            });
            const {records} = await repoWeightGoal.readMany({trx, selection});
            if (records.length === 1) {
                const [first] = records;
                return first.value / 1000;
            }
            return null;
        }

        // MAIN
        /**
         * @param {object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx] - External transaction (if provided).
         * @param {number} params.userId
         * @returns {Promise<{profile: Svelters_Shared_Dto_User_Profile.Dto}>}
         */
        this.run = async function ({trx: trxOuter, userId}) {
            return await trxWrapper.execute(trxOuter, async (trx) => {
                const {record: foundUser} = await repoUser.readOne({trx, key: userId});
                if (!foundUser) return {profile: null};
                const profile = dtoProfile.create();
                profile.dateCreated = foundUser.date_created;
                profile.dateSubscriptionEnd = foundUser.date_subscription;
                profile.uuid = foundUser.uuid;
                const {record: foundProfile} = await repoProfile.readOne({trx, key: userId});
                if (foundProfile) {
                    profile.dateBirth = foundProfile.date_birth;
                    profile.dateUpdated = foundProfile.date_updated;
                    profile.goal = foundProfile.goal;
                    profile.height = foundProfile.height;
                    profile.locale = foundProfile.locale;
                    profile.measureSystem = foundProfile.measure_system; // Add preferred measurement system
                    profile.name = foundProfile.name;
                    profile.promptStart = foundProfile.prompt_start;
                    profile.sex = foundProfile.sex;
                    profile.timezone = foundProfile.timezone;
                }
                // read emails
                const {record: foundOtpEmail} = await repoOtpEmail.readOne({
                    trx,
                    key: {[A_OTP_EMAIL.USER_REF]: userId}
                });
                if (foundOtpEmail) {
                    profile.email = foundOtpEmail.email;
                } else {
                    const selection = utilSelect.compose({
                        conditions: {[A_IDENTITY.USER_REF]: userId},
                        pagination: {limit: 1, offset: 0},
                    });
                    const {records} = await repoIdentity.readMany({trx, selection});
                    if (records[0]) {
                        profile.email = records[0].uid;
                    }
                }
                // read weights
                profile.weight = await readWeight(trx, userId);
                profile.weightGoal = await readWeightGoal(trx, userId);
                // read calories
                const {log} = await actLogGetLast.run({trx, userRef: userId});
                profile.lastCaloriesLog = log;
                return {profile};
            });
        };
    }
}