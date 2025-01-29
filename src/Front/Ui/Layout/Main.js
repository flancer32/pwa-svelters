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
/**
 * @param {Svelters_Front_Defaults} DEF
 * @param {Svelters_Front_Ui_Layout_Desk.vueCompTmpl} LayoutDesk
 * @param {Svelters_Front_Ui_Layout_Mobile.vueCompTmpl} LayoutMobile
 */
export default function (
    {
        Svelters_Front_Defaults$: DEF,
        Svelters_Front_Ui_Layout_Desk$: LayoutDesk,
        Svelters_Front_Ui_Layout_Mobile$: LayoutMobile,
    }) {
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
        methods: {
            ifDesk: () => (window.innerWidth >= 650),
        },
    };
}
