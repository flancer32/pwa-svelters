/**
 * Screen for application's homepage.
 *
 * @namespace Svelters_Front_Ui_Route_Home
 */
// MODULE'S VARS
const NS = 'Svelters_Front_Ui_Route_Home';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Svelters_Front_Ui_Route_Home.vueCompTmpl}
 */
/**
 * @param {Svelters_Front_Defaults} DEF
 * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
 * @param {Fl32_Auth_Front_Mod_Session} modSess
 */
export default function (
    {
        Svelters_Front_Defaults$: DEF,
        TeqFw_Core_Shared_Api_Logger$$: logger,
        Fl32_Auth_Front_Mod_Session$: modSess,
    }) {
    // VARS
    logger.setNamespace(NS);
    const template = `
<layout-main>
    <div class="column q-gutter-xs">
        <navigator/>
        <div class="text-center">Svelter's Homepage</div>
        <div class="text-center" v-if="user">Welcome, {{user?.name}}</div>
    </div>
</layout-main>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Svelters_Front_Ui_Route_Home
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {},
        data() {
            return {
                user: null,
            };
        },
        methods: {},
        async mounted() {
            this.user = await modSess.getData();
        },
    };
}
