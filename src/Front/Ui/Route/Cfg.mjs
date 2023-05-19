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
export default function (spec) {
    /** @type {Svelters_Front_Defaults} */
    const DEF = spec['Svelters_Front_Defaults$'];
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
    /** @type {Fl32_Auth_Front_Mod_Session} */
    const modSess = spec['Fl32_Auth_Front_Mod_Session$'];

    // VARS
    logger.setNamespace(NS);
    const template = `
<layout-mobile>
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
</layout-mobile>
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
