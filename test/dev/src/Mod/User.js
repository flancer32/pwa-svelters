/**
 * Model for a test user for test scenarios.
 */
import {randomUUID} from 'node:crypto';

// VARS
const OAUTH_CLIENT_ID = 'test';
const USER_UUID = 'test';

// MAIN
export default class AppTest_Mod_User {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper - Database transaction wrapper
     * @param {Fl64_OAuth2_Back_Store_RDb_Repo_Client} repoOAuthClient
     * @param {Fl64_OAuth2_Back_Store_RDb_Repo_Client_Token} repoOAuthClientToken
     * @param {Fl64_Otp_Back_Store_RDb_Repo_Token} repoOtpToken
     * @param {Fl64_Web_Session_Back_Store_RDb_Repo_Session} repoSess
     * @param {Svelters_Back_Store_RDb_Repo_User} repoUser
     * @param {typeof Fl64_OAuth2_Back_Enum_Token_Type} OAUTH_TOKEN_TYPE
     * @param {typeof Fl64_OAuth2_Shared_Enum_Client_Status} CLIENT_STATUS
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$: logger,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Fl64_OAuth2_Back_Store_RDb_Repo_Client$: repoOAuthClient,
            Fl64_OAuth2_Back_Store_RDb_Repo_Client_Token$: repoOAuthClientToken,
            Fl64_Otp_Back_Store_RDb_Repo_Token$: repoOtpToken,
            Fl64_Web_Session_Back_Store_RDb_Repo_Session$: repoSess,
            Svelters_Back_Store_RDb_Repo_User$: repoUser,
            'Fl64_OAuth2_Back_Enum_Token_Type.default': OAUTH_TOKEN_TYPE,
            'Fl64_OAuth2_Shared_Enum_Client_Status.default': CLIENT_STATUS,
        }
    ) {
        // VARS
        const A_OAUTH_CLIENT = repoOAuthClient.getSchema().getAttributes();
        const A_OAUTH_CLIENT_TOKEN = repoOAuthClientToken.getSchema().getAttributes();
        const A_OTP_TOKEN = repoOtpToken.getSchema().getAttributes();
        const A_SESS = repoSess.getSchema().getAttributes();
        const A_USER = repoUser.getSchema().getAttributes();

        // FUNCS

        /**
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @returns {Promise<string>}
         */
        async function createOauthClient(trx) {
            const dto = repoOAuthClient.createDto();
            dto.client_id = OAUTH_CLIENT_ID;
            dto.client_secret = 'secret';
            dto.date_created = new Date();
            dto.name = 'Test OAuth Client';
            dto.redirect_uri = 'uri';
            dto.status = CLIENT_STATUS.ACTIVE;
            const {primaryKey} = await repoOAuthClient.createOne({trx, dto});
            const id = primaryKey[A_OAUTH_CLIENT.ID];
            logger.info(`New OAuth2 Client #${id} is created for tests.`);
            return id;
        }


        /**
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} userId
         * @param {string} type
         * @returns {Promise<Fl64_Otp_Back_Store_RDb_Schema_Token.Dto>}
         */
        async function createOtpToken(trx, userId, type) {
            const dto = repoOtpToken.createDto();
            dto.code = randomUUID();
            dto.date_created = new Date();
            dto.date_expires = new Date(new Date().setUTCFullYear(new Date().getUTCFullYear() + 1));
            dto.type = type;
            dto.user_ref = userId;
            const {primaryKey: key} = await repoOtpToken.createOne({trx, dto});
            logger.info(`New OTP token #${key[A_OTP_TOKEN.ID]} is created.`);
            const {record} = await repoOtpToken.readOne({trx, key});
            return record;
        }

        /**
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {number} userId
         * @returns {Promise<string>}
         */
        async function createSessionUuid(trx, userId) {
            const dto = repoSess.createDto();
            dto.date_created = new Date();
            dto.date_last = new Date();
            dto.date_expires = new Date(new Date().setUTCFullYear(new Date().getUTCFullYear() + 1));
            dto.user_agent = 'agent';
            dto.user_ip = 'ip';
            dto.user_ref = userId;
            dto.uuid = randomUUID();
            const {primaryKey} = await repoSess.createOne({trx, dto});
            logger.info(`New session #${primaryKey[A_SESS.ID]} is created for a test user.`);
            return dto.uuid;
        }

        /**
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @returns {Promise<number>}
         */
        async function createUser(trx) {
            const dto = repoUser.createDto();
            dto.uuid = USER_UUID;
            dto.date_created = new Date();
            const {primaryKey} = await repoUser.createOne({trx, dto});
            const userId = primaryKey[A_USER.ID];
            logger.info(`New test user #${userId} is created.`);
            return userId;
        }

        // MAIN
        /**
         * Get GPT authentication token for test user from RDb.
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @returns {Promise<string>}
         */
        this.getBearerToken = async function ({trx} = {}) {
            return await trxWrapper.execute(trx, async (trx) => {
                let res;
                // check user existence
                const keyUser = {[A_USER.UUID]: USER_UUID};
                const {record: foundUser} = await repoUser.readOne({trx, key: keyUser});
                const userId = (foundUser) ? foundUser.id : await createUser(trx);
                // check OAuth2 client existence
                const keyClient = {[A_OAUTH_CLIENT.CLIENT_ID]: OAUTH_CLIENT_ID};
                const {record: foundClient} = await repoOAuthClient.readOne({trx, key: keyClient});
                const clientId = (foundClient) ? foundClient.id : await createOauthClient(trx);
                // validate relation between user and OAuth2 client
                const conditions = {[A_OAUTH_CLIENT_TOKEN.CLIENT_REF]: clientId};
                const {records} = await repoOAuthClientToken.readMany({trx, conditions});
                if (records.length) {
                    const first = records[0];
                    const {record} = await repoOtpToken.readOne({trx, key: first.token_ref});
                    res = record.code;
                } else {
                    // create new OTP and relation
                    const tokenAccess = await createOtpToken(trx, userId, OAUTH_TOKEN_TYPE.ACCESS);
                    const dto = repoOAuthClientToken.createDto();
                    dto.client_ref = clientId;
                    dto.token_ref = tokenAccess.id;
                    await repoOAuthClientToken.createOne({trx, dto});
                    res = tokenAccess.code;
                }
                return res;
            });
        };

        /**
         * Get session UUID for test user from RDb.
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @returns {Promise<string>}
         */
        this.getSessionUuid = async function ({trx} = {}) {
            return await trxWrapper.execute(trx, async (trx) => {
                // check user existence
                const keyUser = {[A_USER.UUID]: USER_UUID};
                const {record: foundUser} = await repoUser.readOne({trx, key: keyUser});
                const userId = (foundUser) ? foundUser.id : await createUser(trx);
                // check session existence
                const keySess = {[A_SESS.USER_REF]: userId};
                const {record: foundSess} = await repoSess.readOne({trx, key: keySess});
                return (foundSess) ? foundSess.uuid : await createSessionUuid(trx, userId);
            });
        };
    }
}
