/**
 * Sets up and exports a single DI container instance with namespace mappings for the frontend.
 */
import Container from './di-esm-0.32.0.js';

/**
 * The only container instance for this application (shared across all frontend modules).
 * @type {TeqFw_Di_Container}
 */
const container = new Container();

// Map namespace roots to module source paths for resolving dependencies.
const resolver = container.getResolver();
resolver.addNamespaceRoot('Fl64_Auth_Otp_', '/src/@flancer64/teq-agave-auth-otp');
resolver.addNamespaceRoot('Fl64_Paypal_', '/src/@flancer64/teq-agave-paypal');
resolver.addNamespaceRoot('Iabtcf_Core_', '/src/@iabtcf', 'js');
resolver.addNamespaceRoot('Svelters_', '/src/@flancer32/pwa-svelters');
resolver.addNamespaceRoot('TeqFw_Core_', '/src/@teqfw/core', 'mjs');
resolver.addNamespaceRoot('TeqFw_Di_', '/src/@teqfw/di', 'js');

// Export the shared container instance for use across modules.
Object.freeze(container);
export {container};

