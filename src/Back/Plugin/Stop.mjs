/**
 * Plugin finalization function.
 */
// MODULE'S VARS
const NS = 'App_Back_Plugin_Stop';
/**
 * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
 */

export default function Factory(
    {
        TeqFw_Core_Shared_Api_Logger$$: logger,
    }) {
    // COMPOSE RESULT
    async function exec() {
        // stop scheduled tasks
        logger.info(`Image upload application is stopped.`);
    }

    Object.defineProperty(exec, 'namespace', {value: NS});
    return exec;
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'namespace', {value: NS});
