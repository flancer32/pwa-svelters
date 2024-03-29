/**
 * Get user data from RDb.
 *
 * @namespace Svelters_Back_Act_User_Read
 */
// MODULE'S VARS
const NS = 'Svelters_Back_Act_User_Read';

// MODULE'S FUNCTIONS
/**
 * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
 * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
 * @param {Svelters_Back_RDb_Schema_User} rdbUser
 */
export default function (
    {
        TeqFw_Core_Shared_Api_Logger$: logger,
        TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
        Svelters_Back_RDb_Schema_User$: rdbUser,
    }) {
    // VARS
    logger.setNamespace(NS);
    const A_USER = rdbUser.getAttributes();

    // FUNCS
    /**
     * Get user data from RDb.
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {string} email
     * @param {number} userBid
     * @return {Promise<{user: Svelters_Back_RDb_Schema_User.Dto}>}
     * @memberOf Svelters_Back_Act_User_Read
     */
    async function act({trx, email, userBid}) {
        /** @type {Svelters_Back_RDb_Schema_User.Dto} */
        let user;
        if (typeof userBid === 'number') {
            user = await crud.readOne(trx, rdbUser, userBid);
        } else if (typeof email === 'string') {
            const key = email.trim().toLowerCase();
            user = await crud.readOne(trx, rdbUser, {[A_USER.EMAIL]: key});
        }
        return {user};
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}