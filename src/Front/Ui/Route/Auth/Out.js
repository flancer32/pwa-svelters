/**
 * End the user's session.
 *
 * @namespace Svelters_Front_Ui_Route_Auth_Out
 */
// MODULE'S IMPORTS

// MODULE'S VARS
const NS = 'Svelters_Front_Ui_Route_Auth_Out';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Svelters_Front_Ui_Route_Auth_Out.vueCompTmpl}
 */
/**
 * @param {Svelters_Front_Defaults} DEF
 * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
 * @param {TeqFw_Ui_Quasar_Front_Lib_Spinner.vueCompTmpl} uiSpinner
 * @param {Fl32_Auth_Front_Mod_Session} modSess
 */
export default function (
    {
        Svelters_Front_Defaults$: DEF,
        TeqFw_Core_Shared_Api_Logger$$: logger,
        TeqFw_Ui_Quasar_Front_Lib_Spinner$: uiSpinner,
        Fl32_Auth_Front_Mod_Session$: modSess,
    }) {
    // VARS
    logger.setNamespace(NS);
    const template = `
<div>
    <navigator/>
    <q-card>
        <ui-spinner :loading="ifLoading"/>
        <q-card-section>
            <div class="text-center">{{$t('route.auth.out.title')}}</div>
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
     * @memberOf Svelters_Front_Ui_Route_Auth_Out
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
        async mounted() {
            this.ifLoading = true;
            this.message = this.$t('route.auth.out.start');
            const res = await modSess.close();
            if (res.success) {
                this.message = this.$t('route.auth.out.finish');
                setTimeout(() => {
                    this.$router.push(DEF.ROUTE_AUTH_IN);
                }, DEF.TIMEOUT_REDIRECT);
            } else {
                this.message = this.$t('route.auth.out.error');
            }
            this.ifLoading = false;
        },
    };
}
