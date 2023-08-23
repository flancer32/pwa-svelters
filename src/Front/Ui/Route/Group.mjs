/**
 * Base screen for groups data routes.
 *
 * @namespace Svelters_Front_Ui_Route_Group
 */
// MODULE'S VARS
const NS = 'Svelters_Front_Ui_Route_Group';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Svelters_Front_Ui_Route_Group.vueCompTmpl}
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
    My Groups Data
</layout-main>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Svelters_Front_Ui_Route_Group
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
