/**
 * Get user data from RDb.
 *
 * @namespace Svelters_Back_Act_User_Read
 */
// MODULE'S VARS
const NS = 'Svelters_Back_Act_User_Read';

// MODULE'S FUNCTIONS
export default function (spec) {
    // DEPS
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$']; // instance
    /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
    const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
    /** @type {Svelters_Back_RDb_Schema_User} */
    const rdbUser = spec['Svelters_Back_RDb_Schema_User$'];

    // VARS
    logger.setNamespace(NS);
    const A_USER = rdbUser.getAttributes();

    // FUNCS
    /**
     * Get user data from RDb.
     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {string} email
     * @return {Promise<{user: Svelters_Back_RDb_Schema_User.Dto}>}
     * @memberOf Svelters_Back_Act_User_Read
     */
    async function act({trx, email}) {
        let user;
        if (typeof email === 'string') {
            const key = email.trim().toLowerCase();
            user = await crud.readOne(trx, rdbUser, {[A_USER.EMAIL]: key});
        }
        return {user};
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}