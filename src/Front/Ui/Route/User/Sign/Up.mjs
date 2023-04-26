/**
 * New user registration.
 *
 * @namespace Svelters_Front_Ui_Route_User_Sign_Up
 */
// MODULE'S IMPORTS

// MODULE'S VARS
const NS = 'Svelters_Front_Ui_Route_User_Sign_Up';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Svelters_Front_Ui_Route_User_Sign_Up.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Svelters_Front_Defaults} */
    const DEF = spec['Svelters_Front_Defaults$'];
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
    /** @type {TeqFw_Ui_Quasar_Front_Lib_Spinner.vueCompTmpl} */
    const uiSpinner = spec['TeqFw_Ui_Quasar_Front_Lib_Spinner$'];
    /** @type {Svelters_Front_Mod_User_Sign_Up} */
    const modSignUp = spec['Svelters_Front_Mod_User_Sign_Up$'];

    // VARS
    logger.setNamespace(NS);
    const template = `
<div>
    <q-card>
        <ui-spinner :loading="ifLoading"/>
        <q-card-section>
            <q-input v-model="fldEmail"
                     :label="$t('route.user.sign.up.fld.email')"
                     autocomplete="username"
                     outlined
                     type="email"
            />
        </q-card-section>
                <q-card-actions align="center">
            <q-btn :label="$t('btn.ok')"
                   color="${DEF.COLOR_Q_PRIMARY}"
                   v-on:click="onOk"
            />
        </q-card-actions>
    </q-card>
</div>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Svelters_Front_Ui_Route_User_Sign_Up
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {uiSpinner},
        data() {
            return {
                fldEmail: null,
                ifLoading: false,
            };
        },
        methods: {
            async onOk() {
                const res = await modSignUp.registerEmail(this.fldEmail);
                debugger
            }
        },
        mounted() { },
    };
}
