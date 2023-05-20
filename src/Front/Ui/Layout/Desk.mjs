/**
 * Base layout for desktops.
 *
 * @namespace Svelters_Front_Ui_Layout_Desk
 */
// MODULE'S VARS
const NS = 'Svelters_Front_Ui_Layout_Desk';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Svelters_Front_Ui_Layout_Desk.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Svelters_Front_Defaults} */
    const DEF = spec['Svelters_Front_Defaults$'];
    /** @type {Fl32_Auth_Front_Mod_Session} */
    const modSess = spec['Fl32_Auth_Front_Mod_Session$'];
    /** @type {Svelters_Front_Ui_Layout_Desk_Top.vueCompTmpl} */
    const Top = spec['Svelters_Front_Ui_Layout_Desk_Top$'];

    // VARS
    const template = `
<q-layout view="hhh lpr fff" container>

    <q-header reveal elevated>
        <top/>
    </q-header>
    
    <q-page-container>
        <slot/>
    </q-page-container>
    
</q-layout>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Svelters_Front_Ui_Layout_Desk
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {Top},
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
