/** @type {TeqFw_Di_Container} */
import container from '/web/@flancer64/teq-agave-paypal/js/di.js';

function onMessage({message}) {
    document.querySelector('#result-message').textContent = message;
}

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

/**
 * @returns {Promise<CartData>}
 */
async function cartDataProvider() {
    const description = document.getElementById('paypalDescription').textContent;
    const value = document.getElementById('paypalAmount').textContent;
    const discountCode = document.getElementById('discountCode').value;
    const amount = {value, currencyCode: 'USD'};
    const cart = [{description, discountCode, amount}];
    return {cart, discountCode};
}

/** @type {Fl64_Paypal_Front_Ui_Page_Checkout} */
const page = await container.get('Fl64_Paypal_Front_Ui_Page_Checkout$');
page.setHandlers({cartDataProvider, onMessage});
page.renderButtons({cssContainer: '#paypal-button-container'});

// Discount Code Handler
document.getElementById('applyDiscount').addEventListener('click', async () => {
    const paypalAmount = document.getElementById('paypalAmount');
    const discountCode = document.getElementById('discountCode');
    const discountMessage = document.getElementById('discountMessage');
    const loadingIndicator = document.getElementById('loadingIndicator');

    loadingIndicator.classList.remove('hidden');
    discountMessage.classList.add('hidden');

    // Just wait for 2 sec
    setTimeout(() => {
        // ... then hide the loader and update payment amount
        loadingIndicator.classList.add('hidden');
        if (discountCode.value) {
            discountMessage.classList.remove('hidden');
            paypalAmount.textContent = '5';
        }
    }, 1000);


});