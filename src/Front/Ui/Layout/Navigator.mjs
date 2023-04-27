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

    // VARS
    const template = `
<div class="row q-gutter-md">
    <router-link to="${DEF.ROUTE_HOME}">{{$t('layout.navigator.home')}}</router-link>
    <router-link to="${DEF.ROUTE_USER_DEVICE_REGISTER}">{{$t('layout.navigator.device')}}</router-link>
    <router-link to="${DEF.ROUTE_USER_SIGN_UP}">{{$t('layout.navigator.signUp')}}</router-link>
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
    };
}
