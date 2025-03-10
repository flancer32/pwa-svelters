/**
 * Action that reads a user profile.
 *
 * @implements {TeqFw_Core_Shared_Api_Action}
 */
export default class Svelters_Back_Act_User_Profile_Read {
    /**
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper
     * @param {Svelters_Back_Store_RDb_Repo_User} repoUser
     * @param {Svelters_Back_Store_RDb_Repo_User_Profile} repoProfile
     * @param {Svelters_Shared_Dto_User_Profile} dtoProfile
     */
    constructor(
        {
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Svelters_Back_Store_RDb_Repo_User$: repoUser,
            Svelters_Back_Store_RDb_Repo_User_Profile$: repoProfile,
            Svelters_Shared_Dto_User_Profile$: dtoProfile,
        }
    ) {
        /**
         * @param {Object} params
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
                    profile.name = foundProfile.name;
                    profile.sex = foundProfile.sex;
                    profile.timezone = foundProfile.timezone;
                    // TODO: add weight
                }
                return {profile};
            });
        };

    }
}
