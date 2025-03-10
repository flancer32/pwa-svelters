/**
 * Model for a test OAuth2 client for test scenarios.
 */
import {randomUUID} from 'node:crypto';

// VARS
const NAME = 'TEST';

// MAIN
export default class AppTest_Mod_OAuth2_Client {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper - Database transaction wrapper
     * @param {Fl64_OAuth2_Back_Store_RDb_Repo_Client} repoClient
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$: logger,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Fl64_OAuth2_Back_Store_RDb_Repo_Client$: repoClient,
        }
    ) {
        // VARS 
        const A_CLIENT = repoClient.getSchema().getAttributes();

        // MAIN
        /**
         * Get the test client data from RDb, create the test data if it does not exist.
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @returns {Promise<Fl64_OAuth2_Back_Store_RDb_Schema_Client.Dto>}
         */
        this.getTestClient = async function ({trx: trxOuter} = {}) {
            return await trxWrapper.execute(trxOuter, async (trx) => {
                let res;
                // check user existence
                const byName = {[A_CLIENT.NAME]: NAME};
                const {record: foundClient} = await repoClient.readOne({trx, key: byName});
                if (foundClient) {
                    res = foundClient;
                } else {
                    const dto = repoClient.createDto();
                    dto.client_id = randomUUID();
                    dto.client_secret = randomUUID();
                    dto.date_created = new Date();
                    dto.redirect_uri = 'n/a';
                    dto.name = NAME;
                    const {primaryKey: key} = await repoClient.createOne({trx, dto});
                    const clientId = key[A_CLIENT.ID];
                    logger.info(`New test OAuth2 client #${clientId} is created.`);
                    const {record} = await repoClient.readOne({trx, key});
                    res = record;
                }
                return res;
            });
        };
    }
}
