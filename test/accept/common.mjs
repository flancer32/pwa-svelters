import {configDto, dbConnect as dbConnectFw, RDBMS} from '@teqfw/test';
import {join} from 'node:path';

// import 'dotenv/config';

/**
 * @param {TeqFw_Di_Api_Container} container
 * @return {Promise<void>}
 */
export async function dbConnect(container) {
    /** @type {TeqFw_Db_Back_RDb_Connect} */
    const conn = await container.get('TeqFw_Db_Back_RDb_IConnect$');
    // Set up DB connection for the Object Container
    await dbConnectFw(RDBMS.SQLITE_BETTER, conn);
}

/**
 * @param {TeqFw_Di_Api_Container} container
 * @return {Promise<void>}
 */
export async function dbDisconnect(container) {
    try {
        /** @type {TeqFw_Db_Back_RDb_Connect} */
        const conn = await container.get('TeqFw_Db_Back_RDb_IConnect$');
        await conn.disconnect();
    } catch (e) {
        debugger
    }
}

/**
 * @typedef {Svelters_Back_Store_RDb_Schema_User.Dto} UserDto
 */

/**
 * @param {TeqFw_Di_Api_Container} container
 * @return {Promise<{user: UserDto}>}
 */
export async function dbCreateFkEntities(container) {
    // Use app entities for testing
    /** @type {Svelters_Back_Store_RDb_Repo_User} */
    const repoUser = await container.get('Svelters_Back_Store_RDb_Repo_User$');
    /** @type {typeof Svelters_Shared_Enum_User_State} */
    const STATE = await container.get('Svelters_Shared_Enum_User_State$');

    // Create an app user
    let user;
    await dbConnect(container);
    /** @type {TeqFw_Db_Back_RDb_Connect} */
    const conn = await container.get('TeqFw_Db_Back_RDb_IConnect$');
    const trx = await conn.startTransaction();
    try {
        const dto = repoUser.createDto();
        dto.date_created = new Date();
        dto.date_subscription = new Date();
        dto.state = STATE.ACTIVE;
        dto.uuid = 'UUID';
        const {primaryKey: key} = await repoUser.createOne({trx, dto});
        const {record} = await repoUser.readOne({trx, key});
        user = record;
    } finally {
        await trx.commit();
    }
    await dbDisconnect(container);
    return {user};
}

/**
 * @param {TeqFw_Di_Api_Container} container
 * @return {Promise<void>}
 */
export async function dbReset(container) {
    // FUNCS
    /**
     * Get the path to the test data directory.
     * @param {string} root - The root path of the project.
     * @returns {string} The resolved path to the test data directory.
     */
    function getTestDataPath(root) {
        // const pathInNodeModules = join(root, 'node_modules', '@flancer64', 'teq-agave-web-session', 'test', 'data');
        const pathInRoot = join(root, 'test', 'data');
        // return existsSync(pathInNodeModules) ? pathInNodeModules : pathInRoot;
        return pathInRoot;
    }

    // MAIN
    try {
        /** @type {TeqFw_Core_Back_Config} */
        const config = await container.get('TeqFw_Core_Back_Config$');
        // Initialize database structure using test DEM

        /** @type {{action: TeqFw_Db_Back_Cli_Init.action}} */
        const {action} = await container.get('TeqFw_Db_Back_Cli_Init$');
        const testRoot = getTestDataPath(config.getPathToRoot());
        const testDems = {
            test: testRoot,
        };
        await dbConnect(container);
        await action({testDems, testMapRoot: testRoot});
        await dbDisconnect(container);
    } catch (e) {
        debugger
    }
}

/**
 * @param {TeqFw_Di_Api_Container} container
 * @return {Promise<void>}
 */
export async function initConfig(container) {
    // Initialize environment configuration
    /** @type {TeqFw_Core_Back_Config} */
    const config = await container.get('TeqFw_Core_Back_Config$');
    config.init(configDto.pathToRoot, '0.0.0');

    // Set up console transport for the logger
    /** @type {TeqFw_Core_Shared_Logger_Base} */
    const base = await container.get('TeqFw_Core_Shared_Logger_Base$');
    /** @type {TeqFw_Core_Shared_Api_Logger_Transport} */
    const transport = await container.get('TeqFw_Core_Shared_Api_Logger_Transport$');
    base.setTransport(transport);
}
