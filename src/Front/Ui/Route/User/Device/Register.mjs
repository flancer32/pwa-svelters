/**
 * Screen to register new device (smartphone) for a user.
 *
 * @namespace Svelters_Front_Ui_Route_User_Device_Register
 */
// MODULE'S IMPORTS

// MODULE'S VARS
const NS = 'Svelters_Front_Ui_Route_User_Device_Register';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Svelters_Front_Ui_Route_User_Device_Register.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Svelters_Front_Defaults} */
    const DEF = spec['Svelters_Front_Defaults$'];
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
    /** @type {TeqFw_Ui_Quasar_Front_Lib_Spinner.vueCompTmpl} */
    const uiSpinner = spec['TeqFw_Ui_Quasar_Front_Lib_Spinner$'];
    /** @type {Svelters_Front_Mod_User_Device} */
    const modDev = spec['Svelters_Front_Mod_User_Device$'];

    // VARS
    logger.setNamespace(NS);
    const template = `
<div>
    <navigator/>
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
     * @memberOf Svelters_Front_Ui_Route_User_Device_Register
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
                this.ifLoading = true;
                const res = await modDev.inviteCreate(this.fldEmail);
                this.ifLoading = false;
                const code = res?.code;
                if (code) {
                    const route = DEF.ROUTE_USER_DEVICE_ATTEST.replace(':code', code);
                    this.$router.push(route);
                }
            }
        },
        mounted() { },
    };
}
