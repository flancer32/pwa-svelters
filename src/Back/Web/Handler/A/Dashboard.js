/**
 * Handler for rendering dashboard.
 */
export default class Svelters_Back_Web_Handler_A_Dashboard {
    /**
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Web_Back_Help_Respond} respond - Error response helper
     * @param {Fl64_Web_Session_Back_Manager} session
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper
     * @param {Fl64_Tmpl_Back_Service_Render} tmplRender
     * @param {Svelters_Shared_Helper_Cast} helpCast
     * @param {Svelters_Back_Act_User_Profile_Read} actProfileRead
     * @param {Svelters_Back_Web_Handler_A_Z_Helper} zHelper
     * @param {typeof Fl64_Tmpl_Back_Enum_Type} TYPE
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            TeqFw_Web_Back_Help_Respond$: respond,
            Fl64_Web_Session_Back_Manager$: session,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Fl64_Tmpl_Back_Service_Render$: tmplRender,
            Svelters_Shared_Helper_Cast$: helpCast,
            Svelters_Back_Act_User_Profile_Read$: actProfileRead,
            Svelters_Back_Web_Handler_A_Z_Helper$: zHelper,
            'Fl64_Tmpl_Back_Enum_Type.default': TYPE,
        }
    ) {
        // VARS

        // MAIN
        /**
         * Handles incoming HTTP requests.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object
         *
         * @return {Promise<void>}
         */
        this.run = async function (req, res) {
            return await trxWrapper.execute(null, async (trx) => {
                const localeApp = DEF.SHARED.LOCALE;
                const localeUser = zHelper.getLocale(req);
                const name = 'dashboard.html';
                const partials = await zHelper.loadPartials(localeUser);
                const type = TYPE.WEB;
                const {dto} = await session.getFromRequest({trx, req});
                const {profile} = await actProfileRead.run({trx, userId: dto.user_ref});
                profile.dateBirth = helpCast.dateString(profile.dateBirth);
                profile.dateCreated = helpCast.dateString(profile.dateCreated);
                profile.dateSubscriptionEnd = helpCast.dateString(profile.dateSubscriptionEnd);
                profile.dateUpdated = helpCast.dateString(profile.dateUpdated);
                const view = {
                    isAuthenticated: !!dto?.user_ref,
                    profile,
                };
                const {content: body} = await tmplRender.perform({name, type, localeUser, localeApp, view, partials});
                if (body) {
                    respond.code200_Ok({res, body});
                }
            });
        };

    }
}
