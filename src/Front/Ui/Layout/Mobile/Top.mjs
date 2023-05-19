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
export default function (spec) {
    /** @type {Svelters_Front_Defaults} */
    const DEF = spec['Svelters_Front_Defaults$'];
    /** @type {Fl32_Auth_Front_Mod_Session} */
    const modSess = spec['Fl32_Auth_Front_Mod_Session$'];

    // VARS
    const template = `
<q-bar style="background-color: var(--color-base);">
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
