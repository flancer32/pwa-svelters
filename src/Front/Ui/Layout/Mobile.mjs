/**
 * Base layout for mobiles.
 *
 * @namespace Svelters_Front_Ui_Layout_Mobile
 */
// MODULE'S VARS
const NS = 'Svelters_Front_Ui_Layout_Mobile';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Svelters_Front_Ui_Layout_Mobile.vueCompTmpl}
 */
/**
 * @param {Svelters_Front_Defaults} DEF
 * @param {Fl32_Auth_Front_Mod_Session} modSess
 * @param {Svelters_Front_Ui_Layout_Mobile_Bottom.vueCompTmpl} Bottom
 * @param {Svelters_Front_Ui_Layout_Mobile_Top.vueCompTmpl} Top
 */
export default function (
    {
        Svelters_Front_Defaults$: DEF,
        Fl32_Auth_Front_Mod_Session$: modSess,
        Svelters_Front_Ui_Layout_Mobile_Bottom$: Bottom,
        Svelters_Front_Ui_Layout_Mobile_Top$: Top,
    }) {
    // VARS
    const template = `
<q-layout view="hhh lpr fff" container>

    <q-header elevated>
        <top/>
    </q-header>
    
    <q-page-container>
        <slot/>
    </q-page-container>
    
    <q-footer elevated>
        <bottom/>
    </q-footer>
    
</q-layout>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Svelters_Front_Ui_Layout_Mobile
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {Bottom, Top},
        data() {
            return {
                ifAuth: false,
            };
        },
        methods: {
            getUserName() {
                // noinspection JSValidateTypes
                /** @type {Svelters_Shared_Dto_User.Dto} */
                const sess = modSess.getData();
                return sess?.name ? sess.name : null;
            }
        },
        mounted() {
            this.ifAuth = modSess.isValid();
        },
    };
}
