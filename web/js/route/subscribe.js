/**
 * Initialize the DI container from `@flancer64/teq-agave-paypal` plugin to get access to plugin's objects.
 * @type {TeqFw_Di_Container}
 */
import container from '/web/@flancer64/teq-agave-paypal/js/di.js';

container.getResolver().addNamespaceRoot('Svelters_', '/src/@flancer32/pwa-svelters');

const page = await container.get('Svelters_Front_Ui_Page_Subscribe$');

/**
 * @typedef {Object} CartItem
 * @see `purchaseUnits` in https://developer.paypal.com/docs/api/orders/v2/#orders_create
 * @property {string} description - Description of the cart item.
 * @property {{value: string, currency: string}} amount - Amount details.
 */

/**
 * @typedef {Object} CartData
 * @property {CartItem[]} cart - List of items in the cart.
 * @property {string} discountCode - Applied discount code.
 */
