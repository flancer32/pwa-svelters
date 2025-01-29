import {randomUUID} from 'node:crypto';

/**
 * Implementation of the user management interface for the application.
 *
 * This class provides an empty implementation of the user management interface.
 *
 * @implements Fl64_OAuth2_Social_Back_Api_App_UserManager
 */
export default class Svelters_Back_Di_Replace_Social_UserManager {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger - The logger instance.
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper - Database transaction wrapper
     * @param {Svelters_Back_Store_RDb_Repo_User} repoUser - User repository
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Svelters_Back_Store_RDb_Repo_User$: repoUser,

        }
    ) {
        // VARS
        const A_USER = repoUser.getSchema().getAttributes();

        // FUNCS
        function errorNotImplemented(methodName) {
            logger.error(`Method "${methodName}" is not implemented.`);
            throw new Error(`Method "${methodName}" is not implemented.`);
        }

        /**
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @return {Promise<string>}
         */
        async function generateUniqueUUID(trx) {
            let uuid;
            let isUnique = false;
            while (!isUnique) {
                uuid = randomUUID();
                const {record} = await repoUser.readOne({trx, key: {[A_USER.UUID]: uuid}});
                isUnique = !record;
            }
            return uuid;
        }

        // MAIN
        /**
         * Finds a user in the application's database by criteria.
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx] - The transaction context.
         * @param {string} [params.email] - The email address of the user.
         * @param {number} [params.id] - The unique identifier of the user.
         * @returns {Promise<{userId: number|null}>} - The user ID if found, or null if not found.
         */
        this.findUser = async function ({trx: trxOuter, email, id}) {
            let userId = null;
            await trxWrapper.execute(trxOuter, async (trx) => {
                const record = null;
                //const {record} = await repoUser.readOne({trx, key: id});
                if (record) {
                    userId = record[A_USER.ID];
                } else {
                    logger.info(`User not found with email/ID: ${email}/${id}`);
                }
            });
            return {userId};
        };

        /**
         * Creates a new user in the application's database.
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx] - The transaction context.
         * @param {string} params.email - The email address of the user.
         * @param {Object} [params.extras] - Additional user attributes (e.g., name, avatar).
         * @returns {Promise<{id: number}>} - The unique identifier of the created user.
         */
        this.createUser = async function ({trx: trxOuter, email, extras}) {
            let id = null;
            await trxWrapper.execute(trxOuter, async (trx) => {
                const dto = repoUser.getSchema().createDto();
                dto.date_created = new Date();
                dto.uuid = await generateUniqueUUID(trx);
                const {primaryKey} = await repoUser.createOne({trx, dto});
                if (primaryKey) {
                    id = primaryKey[A_USER.ID];
                } else {
                    logger.info(`User not found with email/ID: ${email}/${id}`);
                }
            });
            return {id};
        };

        /**
         * Updates an existing user's information in the application's database.
         * @param {Object} params
         * @param {number} params.id - The unique identifier of the user.
         * @param {Object} [params.extras] - Additional attributes to update (e.g., name, avatar).
         * @returns {Promise<Object>} - The updated user object.
         */
        this.updateUser = async function ({trx, id, extras}) {
            errorNotImplemented('updateUser');
        };
    }
}
