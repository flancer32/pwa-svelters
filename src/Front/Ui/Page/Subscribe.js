/**
 * This is a code for a 'subscribe.html' template.
 */
export default class Svelters_Front_Ui_Page_Subscribe {
    /**
     * @param {Svelters_Shared_Helper_Subscription} helpSubs
     * @param {Fl64_Paypal_Front_Ui_Page_Checkout} pageCheckout
     * @param {typeof Svelters_Shared_Enum_Data_Type_Subscription} SUBS
     */
    constructor(
        {
            Svelters_Shared_Helper_Subscription$: helpSubs,
            Fl64_Paypal_Front_Ui_Page_Checkout$: pageCheckout,
            'Svelters_Shared_Enum_Data_Type_Subscription.default': SUBS,
        }
    ) {
        // VARS
        const ID_BUTTONS = 'paypal-button-container';

        const CSS_BUTTONS = '#' + ID_BUTTONS;
        const CSS_HIDDEN = 'hidden';
        const PARAM_COUNTRY = 'country';
        const PARAM_EU = 'eu';
        const PARAM_TYPE = 'type';

        const model = new Model();
        // get the elements from the page
        const elAmount = document.getElementById('paypalAmount');
        const elAmountTotal = document.getElementById('totalAmount');
        const elAmountVat = document.getElementById('vatAmount');
        const elCountry = document.getElementById('euCountry');
        const elDateSubsEnd = document.getElementById('dateSubscriptionEnd');
        const elDesc = document.getElementById('paypalDesc');
        const elIsEuResident = document.getElementById('isEuResident');
        const elMsg = document.getElementById('result-message');
        const elVatPercent = document.getElementById('vatPercent');
        const elsEuResident = document.querySelectorAll('.app-eu-resident');
        const elsSubsType = document.querySelectorAll('input[name="subscriptionType"]');
        const formatEur = new Intl.NumberFormat(navigator.language, {style: 'currency', currency: 'EUR'});
        const formatUsd = new Intl.NumberFormat(navigator.language, {style: 'currency', currency: 'USD'});

        /**
         * The VAT rates for the EU countries.
         */
        const vatRates = {
            'AT': 20.0, 'BE': 21.0, 'BG': 20.0, 'HR': 25.0, 'CY': 19.0, 'CZ': 21.0, 'DK': 25.0, 'EE': 20.0,
            'FI': 24.0, 'FR': 20.0, 'DE': 19.0, 'GR': 24.0, 'HU': 27.0, 'IE': 23.0, 'IT': 22.0, 'LV': 21.0,
            'LT': 21.0, 'LU': 16.0, 'MT': 18.0, 'NL': 21.0, 'PL': 23.0, 'PT': 23.0, 'RO': 19.0, 'SK': 20.0,
            'SI': 22.0, 'ES': 21.0, 'SE': 25.0
        };

        /**
         * Default style for paypal buttons.
         * @see https://developer.paypal.com/sdk/js/reference/
         */
        const BUTTONS = {
            style: {
                color: 'gold',
                label: 'paypal',
                layout: 'vertical',
                shape: 'rect',
                tagline: false,
            },
            disableFunding: 'venmo,paylater',
        };

        // FUNCS

        /**
         * This handler switches the currency and VAT visibility.
         */
        function switchEu() {
            const urlParams = new URLSearchParams(window.location.search);
            const isEu = elIsEuResident.checked ? '1' : '0';
            urlParams.set(PARAM_EU, isEu);
            urlParams.set(PARAM_TYPE, model.subscriptionType.toLowerCase());
            if (model.country) urlParams.set(PARAM_COUNTRY, model.country);
            window.location.search = urlParams.toString();
        }

        /**
         * This handler switches the VAT rate for the selected country.
         */
        function switchEuCountry() {
            if (elIsEuResident.checked) {
                model.country = elCountry.value;
                updateModel();
            }
        }

        /**
         * @returns {Promise<CartData>}
         */
        async function cartDataProvider() {
            const description = model.description;
            const value = String(model.amountTotal);
            const currencyCode = model.isEuResident ? 'EUR' : 'USD';
            const amount = {value, currencyCode};
            const cart = [{description, amount}];
            return {cart};
        }

        /**
         * Get values from DOM elements and update the model.
         */
        function initModel() {
            // get environment
            const urlParams = new URLSearchParams(window.location.search);
            // set model properties
            model.amountVat = 0;
            model.country = urlParams.get(PARAM_COUNTRY);
            model.isEuResident = (urlParams.get(PARAM_EU) === '1');
            model.subscriptionType = (urlParams.get(PARAM_TYPE)?.toUpperCase() === SUBS.MONTH)
                ? SUBS.MONTH : SUBS.YEAR;
            // bind listeners
            elIsEuResident.addEventListener('change', switchEu);
            elCountry.addEventListener('change', switchEuCountry);
            elsSubsType.forEach(radio => {
                radio.addEventListener('change', function () {
                    const selected = elsSubsType.values().find((radio) => radio.checked);
                    model.subscriptionType = (selected.value === SUBS.MONTH) ? SUBS.MONTH : SUBS.YEAR; // see the form
                    updateModel();
                });
            });
            // update model and UI
            updateModel();
        }

        function updateModel() {
            model.amount = helpSubs.getPriceByType(model.subscriptionType);
            model.description = helpSubs.getDescByType(model.subscriptionType, elDateSubsEnd.value);
            model.vatPercent = (model.isEuResident && vatRates[model.country]) ? vatRates[model.country] : 0;
            model.amountVat = model.amount * model.vatPercent / 100;
            model.amountTotal = model.amount + model.amountVat;
            updateUi();
        }

        function updateUi() {
            const cur = model.isEuResident ? formatEur : formatUsd;
            elAmount.textContent = cur.format(model.amount);
            elAmountVat.textContent = cur.format(model.amountVat);
            elAmountTotal.textContent = cur.format(model.amountTotal);
            elDesc.textContent = model.description;
            elVatPercent.textContent = String(model.vatPercent);
            elsSubsType.forEach(el => {
                if (el.value === model.subscriptionType) el.checked = true;
            });
            if (model.country) elCountry.value = model.country;
            if (model.isEuResident) {
                elIsEuResident.checked = true;
                elsEuResident.forEach(el => el.classList.remove(CSS_HIDDEN));
            } else {
                elIsEuResident.checked = false;
                elsEuResident.forEach(el => el.classList.add(CSS_HIDDEN));
            }
        }

        /**
         * Handles the message from the PayPal buttons.
         * @param message
         */
        function onMessage({message}) {
            elMsg.textContent = message;
        }

        // MAIN
        initModel();
        pageCheckout.setHandlers({cartDataProvider, onMessage});
        pageCheckout.renderButtons({cssContainer: CSS_BUTTONS, buttons: BUTTONS});
    }
}

/**
 * This is a DTO for the subscription page.
 * @memberOf Svelters_Front_Ui_Page_Subscribe
 */
class Model {
    amount = 0;
    amountTotal = 0;
    amountVat = 0;
    country = '';
    description;
    isEuResident;
    isMonthly;
    subscriptionType = '';
    vatPercent = 0;
}
