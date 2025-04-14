/**
 * Handler for rendering a subscription form.
 */
export default class Svelters_Back_Web_Handler_A_Subscribe {
    /**
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Web_Back_Help_Respond} respond
     * @param {Fl64_Web_Session_Back_Manager} session
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper
     * @param {Fl64_Tmpl_Back_Service_Render_Web} srvRender
     * @param {Fl64_Paypal_Back_Client} client
     * @param {Svelters_Shared_Helper_Subscription} helpSubs
     * @param {Svelters_Back_Web_Handler_A_Z_Helper} zHelper
     * @param {typeof Svelters_Shared_Enum_Data_Type_Subscription} SUBS
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            TeqFw_Web_Back_Help_Respond$: respond,
            Fl64_Web_Session_Back_Manager$: session,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Fl64_Tmpl_Back_Service_Render_Web$: srvRender,
            Fl64_Paypal_Back_Client$: client,
            Svelters_Shared_Helper_Subscription$: helpSubs,
            Svelters_Back_Web_Handler_A_Z_Helper$: zHelper,
            Svelters_Shared_Enum_Data_Type_Subscription$: SUBS,
        }
    ) {
        // VARS
        const PARAM_EU = 'eu'; // '1' if a customer is EU resident
        const PARAM_TYPE = 'type'; // subscription type - month or year

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
                let amount, currency, description, dateSubscriptionEnd;
                const {dto} = await session.getFromRequest({trx, req});
                const isAuthenticated = !!dto?.user_ref;
                const profile = (isAuthenticated)
                    ? await zHelper.readProfile({trx, userId: dto.user_ref}) : null;
                const canSubscribe = zHelper.calcUserCanSubscribe({
                    dateSubscriptionEnd: profile?.dateSubscriptionEnd
                });
                if (canSubscribe) {
                    const params = zHelper.parseGetParams(req);
                    const type = params[PARAM_TYPE]?.toUpperCase() === SUBS.MONTH ? SUBS.MONTH : SUBS.YEAR;
                    amount = helpSubs.getPriceByType(type);
                    currency = params[PARAM_EU] === '1' ? 'EUR' : DEF.SUBSCRIPTION_CURRENCY;
                    dateSubscriptionEnd = zHelper.castDate(profile.dateSubscriptionEnd);
                    description = helpSubs.getDescByType(type, profile.dateSubscriptionEnd);
                }
                const view = {
                    amount,
                    canSubscribe,
                    currency,
                    dateSubscriptionEnd,
                    description,
                    isAuthenticated,
                    paypalClientId: client.getClientId(),
                };
                const {content: body} = await srvRender.perform({
                    name: 'subscribe.html',
                    localePkg: DEF.SHARED.LOCALE,
                    view,
                    req,
                    trx,
                });
                if (body) {
                    respond.code200_Ok({res, body});
                }
            });
        };

    }
}
