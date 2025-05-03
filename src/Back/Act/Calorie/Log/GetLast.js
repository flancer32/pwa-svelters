/**
 * Action that retrieves the most recent calorie log (from either draft or final storage).
 *
 * @implements {TeqFw_Core_Shared_Api_Action}
 */
export default class Svelters_Back_Act_Calorie_Log_GetLast {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper
     * @param {TeqFw_Db_Shared_Util_Select} utilSelect
     * @param {Svelters_Back_Store_RDb_Repo_Calorie_Log_Draft} repoDraft
     * @param {Svelters_Back_Store_RDb_Repo_Calorie_Log_Final} repoFinal
     * @param {Svelters_Shared_Dto_Calorie_Log} dtoCalorieLog
     * @param {Svelters_Shared_Dto_Calorie_Log_Item} dtoLogItem
     * @param {Svelters_Back_Store_RDb_Repo_Calorie_Log_Final_Item} repoFinalItem
     * @param {typeof Svelters_Shared_Enum_Product_Measure_Type} MEASURE
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$: logger,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            TeqFw_Db_Shared_Util_Select$: utilSelect,
            Svelters_Back_Store_RDb_Repo_Calorie_Log_Draft$: repoDraft,
            Svelters_Back_Store_RDb_Repo_Calorie_Log_Final$: repoFinal,
            Svelters_Shared_Dto_Calorie_Log$: dtoCalorieLog,
            Svelters_Shared_Dto_Calorie_Log_Item$: dtoLogItem,
            Svelters_Back_Store_RDb_Repo_Calorie_Log_Final_Item$: repoFinalItem,
            Svelters_Shared_Enum_Product_Measure_Type$: MEASURE,
        }
    ) {
        // VARS
        const A_DRAFT = repoDraft.getSchema().getAttributes();
        const A_FINAL = repoFinal.getSchema().getAttributes();
        const A_FINAL_ITEM = repoFinalItem.getSchema().getAttributes();
        const DIR = utilSelect.getDirections();

        // MAIN
        /**
         * @param {object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {number} params.userRef - UUID of the user
         * @returns {Promise<CalorieLogResult>}
         */
        this.run = async function ({trx: trxOuter, userRef}) {
            logger.info(`Looking for the most recent calorie log for user ${userRef}`);
            return await trxWrapper.execute(trxOuter, async (trx) => {
                const log = dtoCalorieLog.create();
                // prepare the selections
                const selectDraft = utilSelect.compose({
                    conditions: {[A_DRAFT.USER_REF]: userRef},
                    sorting: {[A_DRAFT.DATE]: DIR.DESC},
                    pagination: {limit: 1, offset: 0},
                });
                const selectFinal = utilSelect.compose({
                    conditions: {[A_FINAL.USER_REF]: userRef},
                    sorting: {[A_FINAL.DATE]: DIR.DESC},
                    pagination: {limit: 1, offset: 0},
                });

                // read the records
                const [drafts, finals] = await Promise.all([
                    repoDraft.readMany({trx, selection: selectDraft}),
                    repoFinal.readMany({trx, selection: selectFinal}),
                ]);
                /** @type {Svelters_Back_Store_RDb_Schema_Calorie_Log_Draft.Dto} */
                const draft = drafts.records[0] ?? null;
                /** @type {Svelters_Back_Store_RDb_Schema_Calorie_Log_Final.Dto} */
                const final = finals.records[0] ?? null;

                if (draft || final) {

                    const dateDraft = draft?.date;
                    const dateFinal = final?.date;

                    if (draft && (!final || dateDraft > dateFinal)) {
                        log.date = draft.date;
                        log.dateCommitted = draft.date_updated;
                        log.totalCalories = 0;
                        log.items = [];
                        /** @type {Svelters_Shared_Dto_Calorie_Log.Dto[]} */
                        const items = JSON.parse(draft.items);
                        for (const one of items) {
                            const item = dtoLogItem.create(one);
                            if (typeof item.totalCalories === 'number') log.totalCalories += item.totalCalories;
                            log.items.push(item);
                        }
                    } else {
                        log.date = final.date;
                        log.dateCommitted = final.date_committed;
                        log.isFinal = true;
                        log.items = [];
                        log.totalCalories = final.total_calories;
                        // select items
                        const selection = utilSelect.compose({
                            conditions: {[A_FINAL_ITEM.LOG_REF]: final.id},
                        });
                        const {records: items} = await repoFinalItem.readMany({trx, selection});
                        for (const one of items) {
                            const item = dtoLogItem.create();
                            item.food = one.product;
                            item.quantity = one.quantity;
                            item.measure = one.measure;
                            item.unitCalories = one.unit_calories;
                            // calculate totals
                            const quantity = ((item.measure === MEASURE.GRAMS) || (item.measure === MEASURE.MILLILITERS))
                                ? (item.quantity / 100) : item.quantity;
                            item.totalCalories = Math.round(quantity * item.unitCalories);
                            //
                            log.items.push(item);
                        }
                    }
                }
                return {log};
            });
        };
    }
}

/**
 * @typedef {object} CalorieLogResult
 * @property {Svelters_Shared_Dto_Calorie_Log.Dto} log
 */
