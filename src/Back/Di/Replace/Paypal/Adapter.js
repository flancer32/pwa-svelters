/**
 * Implementation of the PayPal adapter for processing successful payments.
 *
 * This class integrates PayPal payment confirmation into the application's business logic.
 * It validates payments, updates user subscription data, and logs relevant actions.
 *
 * @implements {Fl64_Paypal_Back_Api_Adapter}
 */
export default class Svelters_Back_Di_Replace_Paypal_Adapter {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper
     * @param {Svelters_Shared_Helper_Cast} helpCast
     * @param {Svelters_Back_Store_RDb_Repo_User} repoUser
     * @param {Fl64_Paypal_Back_Store_RDb_Repo_Order} repoOrder
     * @param {Fl64_Paypal_Back_Store_RDb_Repo_Payment} repoPayment
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Svelters_Shared_Helper_Cast$: helpCast,
            Svelters_Back_Store_RDb_Repo_User$: repoUser,
            Fl64_Paypal_Back_Store_RDb_Repo_Order$: repoOrder,
            Fl64_Paypal_Back_Store_RDb_Repo_Payment$: repoPayment,
        }
    ) {
        // Retrieve payment schema attributes
        const A_PAYMENT = repoPayment.getSchema().getAttributes();

        // FUNCTIONS

        /**
         * Calculates the new subscription expiration date based on the payment amount.
         *
         * If the current expiration date is in the past, the new subscription period
         * starts from today. Otherwise, it extends from the current expiration date.
         *
         * @param {Date} current - The current subscription expiration date.
         * @param {number} amountPaid - The payment amount received.
         * @returns {Date} - The updated subscription expiration date.
         */
        function calcSubscriptionExpiration(current, amountPaid) {
            const now = new Date(); // Get current date

            // Determine the base date: either current expiration or today's date
            const baseDate = current > now ? new Date(current) : now;

            // Calculate new expiration based on payment amount
            if (amountPaid > 10) {
                // Yearly subscription
                baseDate.setFullYear(baseDate.getFullYear() + 1);
            } else {
                // Monthly subscription
                baseDate.setMonth(baseDate.getMonth() + 1);
            }

            return baseDate;
        }


        // MAIN LOGIC

        /**
         * Processes a successful payment by validating the order, updating the user's subscription,
         * and logging necessary information.
         *
         * @param {object} params - Input parameters.
         * @param {string} params.orderId - The PayPal order ID.
         * @param {object} params.paypalResponse - The full response from PayPal.
         * @returns {Promise<void>}
         */
        this.processSuccessfulPayment = async function ({orderId, paypalResponse}) {
            return trxWrapper.execute(null, async (trx) => {
                logger.info(`Processing successful payment for order #${orderId}.`);

                // Fetch payment records related to this order
                const conditions = {[A_PAYMENT.ORDER_REF]: orderId};
                const {records} = await repoPayment.readMany({trx, conditions});

                if (records.length === 1) {
                    // Fetch the corresponding order record
                    const {record: order} = await repoOrder.readOne({trx, key: orderId});
                    const payment = records[0];
                    const amount = payment.amount;

                    // Validate that the payment amount matches the order amount
                    if (order.amount !== amount) {
                        logger.error(`Amount mismatch for order #${orderId}: expected=${order.amount}, received=${amount}.`);
                    } else {
                        // Update user's subscription expiration date
                        const userId = order.user_ref;
                        const {record: user} = await repoUser.readOne({trx, key: userId});

                        logger.info(`Current subscription date for user #${userId}: '${helpCast.dateString(user.date_subscription)}'.`);

                        user.date_subscription = calcSubscriptionExpiration(user.date_subscription, amount);
                        await repoUser.updateOne({trx, updates: user});

                        logger.info(`New subscription date for user #${userId}: '${helpCast.dateString(user.date_subscription)}'.`);
                    }
                } else if (records.length > 1) {
                    logger.error(`Multiple payment records found for order #${orderId}. Expected only one.`);
                } else {
                    logger.error(`No payment record found for order #${orderId}.`);
                }
            });
        };
    }
}
