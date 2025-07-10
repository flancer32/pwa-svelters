import 'dotenv/config';
import {join} from 'node:path';
import {initContainer, initPlugins, stopPlugins} from '@teqfw/core';
import {dirname} from 'path';
import {configDto} from '@teqfw/test';

// VARS
/** @type {TeqFw_Di_Container} */
let container;
// compose path to the project root
const CUR_DIR = dirname(new URL(import.meta.url).pathname);
const ROOT = join(CUR_DIR, '..', '..');

// MAIN
/**
 * Create a DI container then set up it to run in manual scenarios.
 * @returns {Promise<TeqFw_Di_Container>}
 */
export async function createLocalContainer() {
    // Initialize the DI container, then set it to the test mode
    container = await initContainer(ROOT);
    container.enableTestMode();
    // load app configuration
    /** @type {TeqFw_Core_Back_Config} */
    const config = await container.get('TeqFw_Core_Back_Config$');
    config.init(configDto.pathToRoot, '0.0.0');
    config.loadLocal(ROOT, 'test/scenarios/local.json');
    // load teq plugins for the application
    await initPlugins(container, ROOT);
    return container;
}

/**
 * @param {TeqFw_Di_Container} container
 * @return {Promise<void>}
 */
export async function dbConnect(container) {
    /** @type {TeqFw_Db_Back_Defaults} */
    const DEF = await container.get('TeqFw_Db_Back_Defaults$');
    /** @type {TeqFw_Core_Back_Config} */
    const config = await container.get('TeqFw_Core_Back_Config$');
    /** @type {TeqFw_Db_Back_RDb_Connect} */
    const conn = await container.get('TeqFw_Db_Back_RDb_IConnect$');
    // Set up DB connection for the Object Container
    const cfg = config.getLocal(DEF.NAME);
    await conn.init(cfg);
}

/**
 * @param {TeqFw_Di_Container} container
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
 * @param {TeqFw_Di_Container} container
 * @return {Promise<void>}
 */
export async function dbReset(container) {
    /** @type {{action: TeqFw_Db_Back_Cli_Init.action}} */
    const {action} = await container.get('TeqFw_Db_Back_Cli_Init$');
    await dbConnect(container);
    await action();
    await dbDisconnect(container);
}

/**
 * Stop all plugins in the app.
 * @returns {Promise<void>}
 */
export async function stopApp() {
    await stopPlugins(container);
}
