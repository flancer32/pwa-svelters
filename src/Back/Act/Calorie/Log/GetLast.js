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
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$: logger,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            TeqFw_Db_Shared_Util_Select$: utilSelect,
            Svelters_Back_Store_RDb_Repo_Calorie_Log_Draft$: repoDraft,
            Svelters_Back_Store_RDb_Repo_Calorie_Log_Final$: repoFinal,
        }
    ) {
        // VARS
        const A_DRAFT = repoDraft.getSchema().getAttributes();
        const A_FINAL = repoFinal.getSchema().getAttributes();
        const DIR = utilSelect.getDirections();

        // MAIN
        /**
         * @param {object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {number} params.userRef - UUID of the user
         * @returns {Promise<{date: string, totalCalories: number, source: string}|null>}
         */
        this.run = async function ({trx: trxOuter, userRef}) {
            logger.info(`Looking for the most recent calorie log for user ${userRef}`);
            return await trxWrapper.execute(trxOuter, async (trx) => {
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

                if (!draft && !final) return {};

                const dateDraft = draft?.date;
                const dateFinal = final?.date;

                if (draft && (!final || dateDraft > dateFinal)) {
                    let totalCalories = 0;
                    /** @type {Svelters_Shared_Dto_Calorie_Log_Item.Dto[]} */
                    const items = JSON.parse(draft.items);
                    for (const one of items) {
                        totalCalories += one.totalCalories;
                    }
                    return {
                        date: dateDraft,
                        totalCalories,
                        source: 'draft',
                    };
                } else {
                    return {
                        date: dateFinal,
                        totalCalories: Number(final.total_calories),
                        source: 'final',
                    };
                }
            });
        };
    }
}
