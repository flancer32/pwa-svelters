/**
 * Helper class for subscription-related business logic.
 */
export default class Svelters_Shared_Helper_Subscription {
    /**
     * @param {Svelters_Shared_Defaults} DEFS
     * @param {Svelters_Shared_Helper_Cast} helpCast
     * @param {typeof Svelters_Shared_Enum_Data_Type_Subscription} TYPE
     */
    constructor(
        {
            Svelters_Shared_Defaults$: DEFS,
            Svelters_Shared_Helper_Cast$: helpCast,
            'Svelters_Shared_Enum_Data_Type_Subscription.default': TYPE,
        }
    ) {

        /**
         * Return description for subscription renewal.
         * @param {string} type
         * @see Svelters_Shared_Enum_Data_Type_Subscription
         * @param {Date|string} dateEnd
         * @returns {string}
         */
        this.getDescByType = function (type, dateEnd) {
            const date = new Date(dateEnd);
            const from = helpCast.dateString(date, '/');
            let period = 'year';
            if (type === TYPE.MONTH) {
                date.setMonth(date.getMonth() + 1);
                period = 'month';
            } else {
                date.setMonth(date.getMonth() + 12);
            }
            const to = helpCast.dateString(date, '/');
            return `NutriLog service subscription for 1 ${period}: ${from} - ${to}.`;
        };

        /**
         * Returns the price for the subscription type in USD.
         * @param {string} type
         * @see Svelters_Shared_Enum_Data_Type_Subscription
         * @returns {number}
         */
        this.getPriceByType = function (type) {
            return (type === TYPE.MONTH) ? DEFS.SUBSCRIPTION_PRICE_MONTH : DEFS.SUBSCRIPTION_PRICE_YEAR;
        };

    }
}



