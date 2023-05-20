/**
 * Navigation component for mobile layout.
 *
 * @namespace Svelters_Front_Ui_Layout_Mobile_Bottom
 */
// MODULE'S VARS
const NS = 'Svelters_Front_Ui_Layout_Mobile_Bottom';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Svelters_Front_Ui_Layout_Mobile_Bottom.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Svelters_Front_Defaults} */
    const DEF = spec['Svelters_Front_Defaults$'];
    /** @type {Fl32_Auth_Front_Mod_Session} */
    const modSess = spec['Fl32_Auth_Front_Mod_Session$'];

    // VARS
    const COLOR_DARK = 'var(--color-set-base)';
    const COLOR_LIGHT = 'var(--color-set-lightest)';
    const template = `
<div class="row justify-around" style="background-color: ${COLOR_DARK};">
    <q-btn flat round icon="person" to="${DEF.ROUTE_MY}" :style="itemColor('${DEF.ROUTE_MY}')"/>
    <q-btn flat round icon="group" to="${DEF.ROUTE_FRIEND}" :style="itemColor('${DEF.ROUTE_FRIEND}')"/>
    <q-btn flat round icon="groups" to="${DEF.ROUTE_GROUP}" :style="itemColor('${DEF.ROUTE_GROUP}')"/>
    <q-btn flat round icon="settings" to="${DEF.ROUTE_CFG}" :style="itemColor('${DEF.ROUTE_CFG}')"/>
</div>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Svelters_Front_Ui_Layout_Mobile_Bottom
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        data() {
            return {
                ifAuth: false,
            };
        },
        methods: {
            itemColor(route) {
                let bg = COLOR_DARK, fg = COLOR_LIGHT;
                if (this.$router.currentRoute.value.fullPath === route) [bg, fg] = [fg, bg];
                return `background-color: ${bg}; color: ${fg};`;
            }
        },
        mounted() {
            this.ifAuth = modSess.isValid();
        },
    };
}
