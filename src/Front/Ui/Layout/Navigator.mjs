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
export default function (spec) {
    /** @type {Svelters_Front_Defaults} */
    const DEF = spec['Svelters_Front_Defaults$'];
    /** @type {Fl32_Auth_Front_Mod_Session} */
    const modSess = spec['Fl32_Auth_Front_Mod_Session$'];

    // VARS
    const template = `
<div class="row justify-around q-gutter-md">
    <router-link to="${DEF.ROUTE_HOME}">{{$t('layout.navigator.home')}}</router-link>
    <router-link to="${DEF.ROUTE_USER_SIGN_UP}" v-if="!ifAuth">{{$t('layout.navigator.signUp')}}</router-link>
    <router-link to="${DEF.ROUTE_USER_SIGN_IN}" v-if="!ifAuth">{{$t('layout.navigator.signIn')}}</router-link>
    <router-link to="${DEF.ROUTE_USER_SIGN_OUT}" v-if="ifAuth">{{$t('layout.navigator.signOut')}}</router-link>
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
