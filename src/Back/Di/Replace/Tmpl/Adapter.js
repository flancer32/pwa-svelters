/**
 * Implementation of the template plugin adapter interface for the application.
 *
 * @implements Fl64_Tmpl_Back_Api_Adapter
 */
export default class Svelters_Back_Di_Replace_Tmpl_Adapter {
    /**
     * @param {Svelters_Back_Defaults} DEF
     * @param {Svelters_Back_Helper_Web} helpWeb
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            Svelters_Back_Helper_Web$: helpWeb,
        }
    ) {

        this.getLocales = async function ({req}) {
            const localeUser = helpWeb.getLocale(req);
            return {localeUser, localeApp: DEF.SHARED.LOCALE};
        };


    }
}
