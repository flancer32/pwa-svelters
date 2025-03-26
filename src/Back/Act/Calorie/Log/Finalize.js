/**
 * Action that finalizes draft calorie log entries.
 * It transforms draft records into a finalized structure and saves them to the final storage.
 *
 * @implements {TeqFw_Core_Shared_Api_Action}
 */
export default class Svelters_Back_Act_Calorie_Log_Finalize {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper
     * @param {Svelters_Back_Store_RDb_Repo_Calorie_Log_Draft} repoDraft
     * @param {Svelters_Back_Store_RDb_Repo_Calorie_Log_Final} repoFinal
     * @param {Svelters_Back_Store_RDb_Repo_Calorie_Log_Final_Item} repoFinalItem
     * @param {typeof Svelters_Shared_Enum_Product_Measure_Type} MEASURE
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Svelters_Back_Store_RDb_Repo_Calorie_Log_Draft$: repoDraft,
            Svelters_Back_Store_RDb_Repo_Calorie_Log_Final$: repoFinal,
            Svelters_Back_Store_RDb_Repo_Calorie_Log_Final_Item$: repoFinalItem,
            Svelters_Shared_Enum_Product_Measure_Type$: MEASURE,
        }
    ) {
        // VARS
        const A_DRAFT = repoDraft.getSchema().getAttributes();
        const A_FINAL = repoFinal.getSchema().getAttributes();
        const A_ITEM = repoFinalItem.getSchema().getAttributes();
        const DAYS_BEFORE = 3;

        // FUNCS
        /**
         * Calculate total calories for a list of items.
         *
         * @param {Svelters_Shared_Dto_Calorie_Log_Item.Dto[]} items
         * @returns {number}
         */
        function calculateTotalCalories(items) {
            return items.reduce((total, item) => {
                let quantity = item.quantity;
                const unit = item.unitCalories;
                const delta = Math.max(1, unit * 0.05); // Tolerance for rounding errors
                if ((item.measure === MEASURE.GRAMS) || (item.measure === MEASURE.MILLILITERS)) {
                    quantity = (item.quantity / 100); // Convert quantity for grams and milliliters
                }
                // Calculated total calories
                const val = Math.round(quantity * unit);
                // Check if calculated value matches totalCalories
                if (Math.abs(val - item.totalCalories) > delta) {
                    logger.info(`Food item has wrong totals '${item.totalCalories}', expected '${val}' `
                        + `(delta: ${delta}): ${JSON.stringify(item)}`);
                } else {
                    total += val;
                }
                return total;
            }, 0);
        }

        /**
         * Format date as 'YYYY-MM-DD'.
         *
         * @param {Date|string} date - The date to format.
         * @returns {string} - Formatted date string or original data if the input is invalid.
         */
        function formatDate(date) {
            return date instanceof Date ? date.toISOString().slice(0, 10) : date;
        }


        // MAIN
        /**
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @returns {Promise<Object>}
         */
        this.run = async function ({trx: trxOuter} = {}) {
            logger.info('Starting the calorie log finalization process.');
            await trxWrapper.execute(trxOuter, async (trx) => {
                const dateInPast = new Date();
                dateInPast.setDate(dateInPast.getDate() - DAYS_BEFORE);
                const dateOnly = formatDate(dateInPast);
                const conditions = {[A_DRAFT.DATE]: ['<=', dateOnly]};
                const {records: foundDrafts} = await repoDraft.readMany({trx, conditions});
                if (foundDrafts.length) {
                    logger.info(`Found a total of '${foundDrafts.length}' draft records to finalize.`);
                    for (const draft of foundDrafts) {
                        /** @type {Svelters_Shared_Dto_Calorie_Log_Item.Dto[]} */
                        const items = JSON.parse(draft.items);
                        const totalCalories = calculateTotalCalories(items);
                        // items with incorrect total data, skip this draft
                        if (isNaN(totalCalories)) {
                            logger.error(`Draft #${draft.id} contains items with incorrect total data. Skipping.`);
                            continue;
                        }
                        // check the data existence
                        const key = {
                            [A_FINAL.USER_REF]: draft.user_ref,
                            [A_FINAL.DATE]: draft.date,
                        };
                        const {record: foundFinal} = await repoFinal.readOne({trx, key});
                        if (foundFinal) {
                            logger.error(`Final log #${foundFinal.id} for user #${foundFinal.user_ref} `
                                + `on date '${formatDate(foundFinal.date)}' already exists. Skipping.`);
                            continue;
                        }

                        // continue the processing and create a final log record
                        const dtoFinal = repoFinal.createDto();
                        dtoFinal.date = draft.date;
                        dtoFinal.date_committed = new Date();
                        dtoFinal.user_ref = draft.user_ref;
                        dtoFinal.total_calories = totalCalories;
                        const {primaryKey: pkFinal} = await repoFinal.createOne({trx, dto: dtoFinal});
                        const finalId = pkFinal[A_FINAL.ID];
                        logger.info(`New final calories log #${finalId} is created.`);
                        // add items
                        await Promise.all(items.map(async (item) => {
                            const dtoItem = repoFinalItem.createDto();
                            dtoItem.log_ref = finalId;
                            dtoItem.measure = item.measure;
                            dtoItem.product = item.food;
                            dtoItem.quantity = item.quantity;
                            dtoItem.unit_calories = item.unitCalories;
                            const {primaryKey: pkItem} = await repoFinalItem.createOne({trx, dto: dtoItem});
                            logger.info(`New final calories log item #${pkItem[A_ITEM.ID]} is created.`);
                        }));

                        // remove draft
                        const {deletedCount} = await repoDraft.deleteOne({trx, key: draft.id});
                        if (deletedCount) {
                            logger.info(`Draft log #${draft.id} is deleted.`);
                        } else {
                            logger.info(`Cannot delete draft log #${draft.id}.`);
                        }
                    }
                } else {
                    logger.info('No draft logs found to finalize.');
                }
            });
            logger.info('The calorie log finalization process is completed.');
        };
    }
}
