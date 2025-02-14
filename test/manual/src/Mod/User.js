/**
 * Model for a test user for test scenarios.
 */
import {randomUUID} from 'node:crypto';

// VARS
const UUID = 'test';

// MAIN
export default class AppTest_Mod_User {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper - Database transaction wrapper
     * @param {Svelters_Back_Store_RDb_Repo_User} repoUser
     * @param {Fl64_Web_Session_Back_Store_RDb_Repo_Session} repoSess
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$: logger,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Svelters_Back_Store_RDb_Repo_User$: repoUser,
            Fl64_Web_Session_Back_Store_RDb_Repo_Session$: repoSess,
        }
    ) {
        // VARS
        const A_SESS = repoSess.getSchema().getAttributes();
        const A_USER = repoUser.getSchema().getAttributes();

        // MAIN
        /**
         * Get session UUID for test user from RDb.
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @returns {Promise<string>}
         */
        this.getSessionUuid = async function ({trx} = {}) {
            return await trxWrapper.execute(trx, async (trx) => {
                let res, userId;
                // check user existence
                const keyUser = {[A_USER.UUID]: UUID};
                const {record: foundUser} = await repoUser.readOne({trx, key: keyUser});
                if (foundUser) {
                    userId = foundUser.id;
                } else {
                    const dto = repoUser.createDto();
                    dto.uuid = UUID;
                    dto.date_created = new Date();
                    const {primaryKey} = await repoUser.createOne({trx, dto});
                    userId = primaryKey[A_USER.ID];
                    logger.info(`New test user #${userId} is created.`);
                }
                // check session existence
                const keySess = {[A_SESS.USER_REF]: userId};
                const {record: foundSess} = await repoSess.readOne({trx, key: keySess});
                if (foundSess) {
                    res = foundSess.uuid;
                } else {
                    const dto = repoSess.createDto();
                    dto.date_created = new Date();
                    dto.date_last = new Date();
                    dto.date_expires = new Date(new Date().setUTCFullYear(new Date().getUTCFullYear() + 1));
                    dto.user_agent = 'agent';
                    dto.user_ip = 'ip';
                    dto.user_ref = userId;
                    dto.uuid = randomUUID();
                    const {primaryKey} = await repoSess.createOne({trx, dto});
                    res = dto.uuid;
                    logger.info(`New session #${primaryKey[A_SESS.ID]} is created for a test user.`);
                }
                return res;
            });
        };
    }
}
