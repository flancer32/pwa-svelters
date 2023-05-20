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
export default function (spec) {
    /** @type {Svelters_Front_Defaults} */
    const DEF = spec['Svelters_Front_Defaults$'];
    /** @type {Fl32_Auth_Front_Mod_Session} */
    const modSess = spec['Fl32_Auth_Front_Mod_Session$'];
    /** @type {Svelters_Front_Ui_Layout_Mobile_Bottom.vueCompTmpl} */
    const Bottom = spec['Svelters_Front_Ui_Layout_Mobile_Bottom$'];
    /** @type {Svelters_Front_Ui_Layout_Mobile_Top.vueCompTmpl} */
    const Top = spec['Svelters_Front_Ui_Layout_Mobile_Top$'];

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
