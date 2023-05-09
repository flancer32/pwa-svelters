/**
 * End the user's session.
 *
 * @namespace Svelters_Front_Ui_Route_User_Sign_Out
 */
// MODULE'S IMPORTS

// MODULE'S VARS
const NS = 'Svelters_Front_Ui_Route_User_Sign_Out';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Svelters_Front_Ui_Route_User_Sign_Out.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Svelters_Front_Defaults} */
    const DEF = spec['Svelters_Front_Defaults$'];
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
    /** @type {TeqFw_Ui_Quasar_Front_Lib_Spinner.vueCompTmpl} */
    const uiSpinner = spec['TeqFw_Ui_Quasar_Front_Lib_Spinner$'];
    /** @type {Svelters_Front_Mod_User_Session} */
    const modSess = spec['Svelters_Front_Mod_User_Session$'];

    // VARS
    logger.setNamespace(NS);
    const template = `
<div>
    <navigator/>
    <q-card>
        <ui-spinner :loading="ifLoading"/>
        <q-card-section>
            <div class="text-center">{{message}}</div>
        </q-card-section>
    </q-card>
</div>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Svelters_Front_Ui_Route_User_Sign_Out
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {uiSpinner},
        data() {
            return {
                ifLoading: false,
                message: null,
            };
        },
        computed: {},
        methods: {},
        async mounted() {
            this.ifLoading = true;
            this.message = this.$t('route.user.sign.out.start');
            await modSess.close();
            this.message = this.$t('route.user.sign.out.finish');
            this.ifLoading = false;
        },
    };
}
