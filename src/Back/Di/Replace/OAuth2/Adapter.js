/**
 * Implementation of the user management interface for the application.
 *
 * This class provides an empty implementation of the user management interface.
 *
 * @implements Fl64_OAuth2_Back_Api_Adapter
 */
export default class Svelters_Back_Di_Replace_OAuth2_Adapter {
    /**
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger - The logger instance.
     * @param {Fl64_Web_Session_Back_Manager} session
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Fl64_Web_Session_Back_Manager$: session,
        }
    ) {
        // VARS
        // FUNCS
        // MAIN
        this.getLocales = function ({req}) {
            // TODO: we have one only locale for the moment
            return {localeUser: DEF.SHARED.LOCALE, localeApp: DEF.SHARED.LOCALE};
        };

        this.getAuthRedirectUrl = async function ({req}) {
            return {authenticationUrl: '/app/login'};
        };

        this.getAuthStatus = async function ({req}) {
            const {dto} = await session.getFromRequest({req});
            const isAuthenticated = (typeof dto?.id === 'number');
            return {isAuthenticated};
        };
    }
}
