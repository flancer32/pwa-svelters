/**
 * Implementation of the user management interface for the application.
 *
 * This class provides an empty implementation of the user management interface.
 *
 * @implements Fl64_OAuth2_Social_Back_Api_App_UserManager
 * TODO: rename to Adapter
 */
export default class Svelters_Back_Di_Replace_Social_UserManager {
    /**
     * @param {Svelters_Back_Act_User_Create} actCreate
     */
    constructor(
        {
            Svelters_Back_Act_User_Create$: actCreate,
        }
    ) {

        /**
         * Creates a new user in the application's database.
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx] - The transaction context.
         * @returns {Promise<{id: number|null}>} - The unique identifier of the created user.
         */
        this.createUser = async function ({trx: trxOuter}) {
            const {user} = await actCreate.run({trx: trxOuter});
            const id = user?.id;
            return {id};
        };

    }
}
