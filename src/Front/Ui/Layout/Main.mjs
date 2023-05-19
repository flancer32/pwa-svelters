/**
 * Layout switcher (mobile/desktop).
 *
 * @namespace Svelters_Front_Ui_Layout_Main
 */
// MODULE'S VARS
const NS = 'Svelters_Front_Ui_Layout_Main';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Svelters_Front_Ui_Layout_Main.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Svelters_Front_Defaults} */
    const DEF = spec['Svelters_Front_Defaults$'];
    /** @type {Svelters_Front_Ui_Layout_Desk.vueCompTmpl} */
    const LayoutDesk = spec['Svelters_Front_Ui_Layout_Desk$'];
    /** @type {Svelters_Front_Ui_Layout_Mobile.vueCompTmpl} */
    const LayoutMobile = spec['Svelters_Front_Ui_Layout_Mobile$'];

    // VARS
    const template = `
<layout-desk  v-if="ifDesk()"><slot/></layout-desk>
<layout-mobile v-else><slot/></layout-mobile>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Svelters_Front_Ui_Layout_Main
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {LayoutDesk, LayoutMobile},
        data() {
            return {};
        },
        methods: {
            ifDesk() {
                return (window.innerWidth >= 600);
            }
        },
        mounted() { },
    };
}
