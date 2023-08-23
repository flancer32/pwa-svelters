/**
 * Base screen for configuration.
 *
 * @namespace Svelters_Front_Ui_Route_Cfg
 */
// MODULE'S VARS
const NS = 'Svelters_Front_Ui_Route_Cfg';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Svelters_Front_Ui_Route_Cfg.vueCompTmpl}
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
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
    <div>My Configuration</div>
</layout-main>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Svelters_Front_Ui_Route_Cfg
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
