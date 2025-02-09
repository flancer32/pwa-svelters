/**
 * Persistent DTO with metadata for the RDB entity: Calorie Log.
 * @namespace Svelters_Back_Store_RDb_Schema_Calorie_Log
 */

// MODULE'S VARS

/**
 * Path to the entity in the plugin's DEM.
 *
 * @type {string}
 */
const ENTITY = '/app/calorie/log';

/**
 * Attribute mappings for the entity.
 * @memberOf Svelters_Back_Store_RDb_Schema_Calorie_Log
 */
const ATTR = {
    DATE: 'date',
    DATE_CREATED: 'date_created',
    ID: 'id',
    MEASURE: 'measure',
    PRODUCT: 'product',
    QUANTITY: 'quantity',
    UNIT_CALORIES: 'unit_calories',
    USER_REF: 'user_ref',
};
Object.freeze(ATTR);

// MODULE'S CLASSES

/**
 * DTO class representing the persistent structure of the Calorie Log entity.
 * @memberOf Svelters_Back_Store_RDb_Schema_Calorie_Log
 */
class Dto {
    /**
     * Date when the food was consumed.
     *
     * @type {string} Format: YYYY-MM-DD
     */
    date;

    /**
     * Timestamp in UTC when the food record was created.
     *
     * @type {Date}
     */
    date_created;

    /**
     * Internal numeric identifier for the log entry.
     *
     * @type {number}
     */
    id;

    /**
     * Measurement type (grams, milliliters, or pieces).
     *
     * @type {string}
     * @see Svelters_Shared_Enum_Product_Measure_Type
     */
    measure;

    /**
     * Name of the consumed product.
     *
     * @type {string}
     */
    product;

    /**
     * Total quantity of the food consumed, according to measure type (grams, milliliters, pieces).
     *
     * @type {number}
     */
    quantity;

    /**
     * Calories per 100 grams/milliliters, or unit.
     *
     * @type {number}
     */
    unit_calories;

    /**
     * Reference to the user who consumed the food.
     *
     * @type {number}
     */
    user_ref;
}

/**
 * Implements metadata and utility methods for the Calorie Log entity.
 * @implements TeqFw_Db_Back_Api_RDb_Schema_Object
 */
export default class Svelters_Back_Store_RDb_Schema_Calorie_Log {
    /**
     * Constructor for the Calorie Log persistent DTO class.
     *
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     * @param {typeof Svelters_Shared_Enum_Product_Measure_Type} TYPE
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Util_Cast$: cast,
            'Svelters_Shared_Enum_Product_Measure_Type.default': TYPE,
        }
    ) {
        // INSTANCE METHODS

        /**
         * @param {Svelters_Back_Store_RDb_Schema_Calorie_Log.Dto|Object} [data]
         * @returns {Svelters_Back_Store_RDb_Schema_Calorie_Log.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            if (data) {
                res.date = cast.string(data.date);
                res.date_created = cast.date(data.date_created);
                res.id = cast.int(data.id);
                res.measure = cast.enum(data.measure, TYPE);
                res.product = cast.string(data.product);
                res.quantity = cast.int(data.quantity);
                res.unit_calories = cast.int(data.unit_calories);
                res.user_ref = cast.int(data.user_ref);
            }
            return res;
        };

        /**
         * Returns the attribute map for the entity.
         *
         * @returns {typeof Svelters_Back_Store_RDb_Schema_Calorie_Log.ATTR}
         */
        this.getAttributes = () => ATTR;

        /**
         * Returns the entity's path in the DEM.
         *
         * @returns {string}
         */
        this.getEntityName = () => `${DEF.NAME}${ENTITY}`;

        /**
         * Returns the primary key attributes for the entity.
         *
         * @returns {Array<string>}
         */
        this.getPrimaryKey = () => [ATTR.ID];
    }
}
