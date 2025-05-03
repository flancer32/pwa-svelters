/**
 * Represents a single entry in a daily calorie log.
 * This DTO is used to transfer structured information about the products consumed in one day.
 *
 * @implements TeqFw_Core_Shared_Api_Factory
 */
export default class Svelters_Shared_Dto_Calorie_Log {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast - Utility for type conversions.
     * @param {Svelters_Shared_Helper_Cast} castApp
     * @param {Svelters_Shared_Dto_Calorie_Log_Item} dtoItem
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
            Svelters_Shared_Helper_Cast$: castApp,
            Svelters_Shared_Dto_Calorie_Log_Item$: dtoItem,
        }
    ) {
        /**
         * Creates a new DTO instance with properly casted attributes.
         * Ensures valid values for enums and numerical fields.
         *
         * @param {object} [data] - Raw input data for the DTO.
         * @returns {Dto} - A properly structured DTO instance.
         */
        this.create = function (data) {
            const res = Object.assign(new Dto(), data);
            // Create DTO properties even without initial data.
            res.date = castApp.dateString(data?.date);
            res.dateCommitted = cast.date(data?.dateCommitted);
            res.items = cast.arrayOfObj(data?.items, dtoItem.create);
            res.totalCalories = cast.int(data?.totalCalories);
            return res;
        };
    }
}

/**
 * @memberOf Svelters_Shared_Dto_Calorie_Log
 */
class Dto {
    /**
     * The date of the record in 'YYYY-MM-DD' format.
     * @type {string}
     */
    date;

    /**
     * The date when the data was committed to the log.
     * @type {Date}
     */
    dateCommitted;
    /**
     * The list of food items recorded in the daily calorie log.
     * @type {Svelters_Shared_Dto_Calorie_Log_Item.Dto[]}
     */
    items;

    /**
     * The total number of calories consumed on this date.
     * This should be equal to the sum of calories of all food items recorded for the day.
     *
     * @type {number}
     */
    totalCalories;
}
