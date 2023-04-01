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

    // VARS
    const template = `
<div>
    HERE WE ARE!
</div>
`;

    // FUNCS


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
        mounted() { },
    };
}
