/**
 * Represents a weight measurement for a specific date.
 * This DTO is used to transfer structured information about user's body weight.
 *
 * @memberOf Svelters_Shared_Dto_Weight
 */
class Dto {
    /**
     * Date of the weight measurement (format: YYYY-MM-DD, no time part).
     *
     * @type {string}
     */
    date;

    /**
     * Optional user comment related to the measurement.
     *
     * @type {string|null}
     */
    note;

    /**
     * Body weight value in kilograms.
     *
     * @type {number}
     */
    value;
}

/**
 * Factory class for creating instances of `Svelters_Shared_Dto_Weight`.
 * Ensures type conversion and validation.
 *
 * @implements TeqFw_Core_Shared_Api_Factory
 */
export default class Svelters_Shared_Dto_Weight {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     * @param {Svelters_Shared_Helper_Cast} helper
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
            Svelters_Shared_Helper_Cast$: helper,
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
            if (data) {
                res.date = helper.dateString(data.date);
                res.note = cast.string(data.note);
                res.value = cast.int(data.value);
            }
            return res;
        };
    }
}
