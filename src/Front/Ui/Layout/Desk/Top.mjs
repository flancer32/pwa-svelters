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
/**
 * @param {Svelters_Front_Defaults} DEF
 * @param {Fl32_Auth_Front_Mod_Session} modSess
 * @param {TeqFw_Ui_Quasar_Front_Lib_Led_Connect.vueCompTmpl} uiLed
 */
export default function (
    {
        Svelters_Front_Defaults$: DEF,
        Fl32_Auth_Front_Mod_Session$: modSess,
        TeqFw_Ui_Quasar_Front_Lib_Led_Connect$: uiLed,
    }) {
    // VARS
    const COLOR_DARK = 'var(--color-set-base)';
    const COLOR_LIGHT = 'var(--color-set-lightest)';
    const template = `
<q-bar style="background-color: var(--color-set-base);">
    <ui-led/>
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
        components: {uiLed},
        data() {
            return {
                ifAuth: false,
            };
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
