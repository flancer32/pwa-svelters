/**
 * Screen for 'Not Found' page (error 404).
 *
 * @namespace Svelters_Front_Ui_Route_NotFound
 */
// MODULE'S VARS
const NS = 'Svelters_Front_Ui_Route_NotFound';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Svelters_Front_Ui_Route_NotFound.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Svelters_Front_Defaults} */
    const DEF = spec['Svelters_Front_Defaults$'];

    // VARS
    const template = `
<layout-main>
    <div class="text-center">{{$t('route.notFound.title')}}</div>
</layout-main>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Svelters_Front_Ui_Route_NotFound
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
    };
}
