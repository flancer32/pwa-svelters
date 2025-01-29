/**
 * Top bar component for mobile layout.
 *
 * @namespace Svelters_Front_Ui_Layout_Mobile_Top
 */
// MODULE'S VARS
const NS = 'Svelters_Front_Ui_Layout_Mobile_Top';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Svelters_Front_Ui_Layout_Mobile_Top.vueCompTmpl}
 */
/**
 * @param {Svelters_Front_Defaults} DEF
 * @param {Fl32_Auth_Front_Mod_Session} modSess
 */
export default function (
    {
        Svelters_Front_Defaults$: DEF,
        Fl32_Auth_Front_Mod_Session$: modSess,
    }) {
    // VARS
    const template = `
<q-bar style="background-color: var(--color-set-base);">
    <q-btn dense flat round icon="lens" size="8.5px" :color="color"/>
    <div class="overflow-hidden" style="height: 20px">Svelters 2</div>
    <q-space></q-space>
</q-bar>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Svelters_Front_Ui_Layout_Mobile_Top
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
        computed: {
            color() {
                return (false) ? 'green' : 'grey';
            }
        },
        methods: {},
        mounted() {
            this.ifAuth = modSess.isValid();
        },
    };
}
