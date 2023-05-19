/**
 * Top bar component for desktop layout.
 *
 * @namespace Svelters_Front_Ui_Layout_Desk_Top
 */
// MODULE'S VARS
const NS = 'Svelters_Front_Ui_Layout_Desk_Top';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Svelters_Front_Ui_Layout_Desk_Top.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Svelters_Front_Defaults} */
    const DEF = spec['Svelters_Front_Defaults$'];
    /** @type {Fl32_Auth_Front_Mod_Session} */
    const modSess = spec['Fl32_Auth_Front_Mod_Session$'];

    // VARS
    const COLOR_DARK = 'var(--color-base)';
    const COLOR_LIGHT = 'var(--color-lightest)';
    const template = `
<q-bar style="background-color: var(--color-base);">
    <q-btn dense flat round icon="lens" size="8.5px" :color="color"/>
    <div class="overflow-hidden" style="height: 20px">Svelters 2</div>
    <q-space></q-space>
    <div class="row justify-around q-gutter-md">
        <q-btn to="${DEF.ROUTE_MY}"
               :style="itemColor('${DEF.ROUTE_MY}')"
               :label="$t('navig.my')"
               flat
               icon="person"
        />
        <q-btn to="${DEF.ROUTE_FRIEND}"
               :style="itemColor('${DEF.ROUTE_FRIEND}')"
               :label="$t('navig.friend')"
               flat
               icon="group"
        />
        <q-btn to="${DEF.ROUTE_GROUP}"
               :style="itemColor('${DEF.ROUTE_GROUP}')"
               :label="$t('navig.group')"
               flat
               icon="groups"
        />
        <q-btn to="${DEF.ROUTE_CFG}"
               :style="itemColor('${DEF.ROUTE_CFG}')"
               :label="$t('navig.cfg')"
               flat
               icon="settings"
        />
    </div>
    <q-space></q-space>
</q-bar>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Svelters_Front_Ui_Layout_Desk_Top
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
        methods: {
            itemColor(route) {
                let bg = COLOR_DARK, fg = COLOR_LIGHT;
                if (this.$router.currentRoute.value.fullPath === route) [bg, fg] = [fg, bg];
                return `background-color: ${bg}; color: ${fg};`;
            }
        },
        mounted() {
            this.ifAuth = modSess.isValid();
        },
    };
}
