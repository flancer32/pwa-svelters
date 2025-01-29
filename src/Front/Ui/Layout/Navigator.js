/**
 * Navigation component.
 *
 * @namespace Svelters_Front_Ui_Layout_Navigator
 */
// MODULE'S VARS
const NS = 'Svelters_Front_Ui_Layout_Navigator';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Svelters_Front_Ui_Layout_Navigator.vueCompTmpl}
 */
/**
 * @param {Svelters_Front_Defaults} DEF
 * @param {Fl32_Auth_Front_Mod_Session} modSess
 */
export default function (
    {
        Svelters_Front_Defaults$: DEF,
        Fl32_Auth_Front_Mod_Session$: modSess,
    }) {
    // VARS
    const template = `
<div class="row justify-around q-gutter-md">
    <router-link to="${DEF.ROUTE_HOME}">{{$t('layout.navigator.home')}}</router-link>
    <router-link to="${DEF.ROUTE_AUTH_UP}" v-if="!ifAuth">{{$t('layout.navigator.signUp')}}</router-link>
    <router-link to="${DEF.ROUTE_AUTH_IN}" v-if="!ifAuth">{{$t('layout.navigator.signIn')}}</router-link>
    <router-link to="${DEF.ROUTE_AUTH_OUT}" v-if="ifAuth">{{$t('layout.navigator.signOut')}}</router-link>
</div>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Svelters_Front_Ui_Layout_Navigator
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
        mounted() {
            this.ifAuth = modSess.isValid();
        },
    };
}
