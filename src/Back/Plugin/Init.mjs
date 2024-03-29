/**
 * Plugin initialization function.
 */
// MODULE'S VARS
const NS = 'Svelters_Back_Plugin_Init';
/**
 * @param {TeqFw_Di_Container} container
 * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
 */

export default function Factory(
    {
        TeqFw_Di_Container$: container,
        TeqFw_Core_Shared_Api_Logger$$: logger,
    }) {
    // VARS
    logger.setNamespace(NS);

    // FUNCS
    async function init() {
        // create event listeners synchronously to prevent doubling of singletons in container
        // await container.get('Svelters_Back_Listen_Trans_SignIn_Challenge$');
        // await container.get('Svelters_Back_Listen_Trans_SignIn_Validate$');
        // await container.get('Svelters_Back_Listen_Trans_SignUp_Attestation$');
        // await container.get('Svelters_Back_Listen_Trans_SignUp_Challenge$');
    }

    // MAIN
    Object.defineProperty(init, 'namespace', {value: NS});
    return init;
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'namespace', {value: NS});
