/**
 * Handler for rendering a subscription form.
 */
export default class Svelters_Back_Web_Handler_A_Subscribe {
    /**
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Web_Back_Help_Respond} respond - Error response helper
     * @param {Fl64_Web_Session_Back_Manager} session
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper
     * @param {Fl64_Tmpl_Back_Service_Render} tmplRender
     * @param {Fl64_Paypal_Back_Client} client
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
            Fl64_Paypal_Back_Client$: client,
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
                let amount, currency, description;
                const localeApp = DEF.SHARED.LOCALE;
                const localeUser = zHelper.getLocale(req);
                const name = 'subscribe.html';
                const partials = await zHelper.loadPartials(localeUser);
                const type = TYPE.WEB;
                const {dto} = await session.getFromRequest({trx, req});
                const isAuthenticated = !!dto?.user_ref;
                const profile = (isAuthenticated)
                    ? await zHelper.readProfile({trx, userId: dto.user_ref}) : null;
                const canSubscribe = zHelper.calcUserCanSubscribe({
                    dateSubscriptionEnd: profile?.dateSubscriptionEnd
                });
                if (canSubscribe) {
                    amount = DEF.SUBSCRIPTION_AMOUNT_YEAR;
                    currency = DEF.SUBSCRIPTION_CURRENCY;
                    const until = new Date(profile.dateSubscriptionEnd);
                    until.setMonth(until.getMonth() + 12);
                    const date = zHelper.castDate(until);
                    description = `NutriLog service subscription for 1 year (until ${date}).`;
                }
                const view = {
                    amount,
                    canSubscribe,
                    currency,
                    description,
                    isAuthenticated,
                    paypalClientId: client.getClientId(),
                };
                const {content: body} = await tmplRender.perform({name, type, localeUser, localeApp, view, partials});
                if (body) {
                    respond.code200_Ok({res, body});
                }
            });
        };

    }
}
