/**
 * Represents a single food item in a daily calorie log.
 * This DTO is used to transfer structured information about consumed products.
 *
 * @memberOf Svelters_Shared_Dto_Calorie_Log_Item
 */
class Dto {
    /**
     * The name of the consumed product.
     * Example: "Apple", "Rice", "Chicken Breast".
     * @type {string}
     */
    product;

    /**
     * The amount of the product consumed.
     * The unit is defined separately in the `measure` field.
     * Example: 150 (grams), 1 (piece), 250 (milliliters).
     * @type {number}
     */
    quantity;

    /**
     * The measurement unit associated with the consumed product.
     * Uses predefined enumeration values.
     * @type {string}
     * @see Svelters_Shared_Enum_Product_Measure_Type
     */
    measure;

    /**
     * The caloric value of the product per standard unit.
     * Expressed in kilocalories per 100 grams/milliliters or per piece.
     * Example: 52 (kcal per 100g for an apple), 365 (kcal per 100g for rice).
     * @type {number}
     */
    unitCalories;
}

/**
 * Factory class for creating instances of `Svelters_Shared_Dto_Calorie_Log_Item`.
 * Ensures type conversion and validation.
 *
 * @implements TeqFw_Core_Shared_Api_Factory
 */
export default class Svelters_Shared_Dto_Calorie_Log_Item {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast - Utility for type conversions.
     * @param {typeof Svelters_Shared_Enum_Product_Measure_Type} MEASURE - Enumeration of valid measurement units.
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
            'Svelters_Shared_Enum_Product_Measure_Type.default': MEASURE,
        }
    ) {
        /**
         * Creates a new DTO instance with properly casted attributes.
         * Ensures valid values for enums and numerical fields.
         *
         * @param {object} data - Raw input data for the DTO.
         * @returns {Dto} - A properly structured DTO instance.
         */
        this.create = function (data) {
            const res = new Dto();
            if (data) {
                res.product = cast.string(data.product);
                res.quantity = cast.int(data.quantity);
                res.measure = cast.enum(data.measure, MEASURE);
                res.unitCalories = cast.int(data.unitCalories);
            }
            return res;
        };
    }
}
