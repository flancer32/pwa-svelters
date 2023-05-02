/**
 * Screen for application's homepage.
 *
 * @namespace Svelters_Front_Ui_Route_Home
 */
// MODULE'S VARS
const NS = 'Svelters_Front_Ui_Route_Home';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Svelters_Front_Ui_Route_Home.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Svelters_Front_Defaults} */
    const DEF = spec['Svelters_Front_Defaults$'];
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance

    // VARS
    logger.setNamespace(NS);
    const template = `
<div>
    <div class="column q-gutter-xs">
        <navigator/>
        <div class="text-center">Svelter's Homepage</div>
    </div>
</div>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Svelters_Front_Ui_Route_Home
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {},
        data() {
            return {};
        },
        methods: {},
    };
}
