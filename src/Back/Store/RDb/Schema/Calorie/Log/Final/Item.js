/**
 * Persistent DTO with metadata for the RDB entity: Calorie Log Final Item.
 * @namespace Svelters_Back_Store_RDb_Schema_Calorie_Log_Final_Item
 */

// MODULE'S VARS

/**
 * Path to the entity in the plugin's DEM.
 *
 * @type {string}
 */
const ENTITY = '/app/calorie/log/final/item';

/**
 * Attribute mappings for the entity.
 * @memberOf Svelters_Back_Store_RDb_Schema_Calorie_Log_Final_Item
 */
const ATTR = {
    ID: 'id',
    LOG_REF: 'log_ref',
    MEASURE: 'measure',
    PRODUCT: 'product',
    QUANTITY: 'quantity',
    UNIT_CALORIES: 'unit_calories',
};
Object.freeze(ATTR);

// MODULE'S CLASSES

/**
 * DTO class representing the persistent structure of the Calorie Log Final Item entity.
 * @memberOf Svelters_Back_Store_RDb_Schema_Calorie_Log_Final_Item
 */
class Dto {
    /**
     * Internal numeric identifier for the log item.
     *
     * @type {number}
     */
    id;

    /**
     * Reference to the finalized daily log entry.
     *
     * @type {number}
     */
    log_ref;

    /**
     * The unit of measurement for the product quantity.
     * Allowed values: 'GRAMS', 'MILLILITERS', 'PIECES'.
     *
     * @type {string}
     */
    measure;

    /**
     * The name of the consumed product.
     *
     * @type {string}
     */
    product;

    /**
     * The amount of the product consumed, measured in the specified unit.
     *
     * @type {number}
     */
    quantity;

    /**
     * Calories per 100 grams/milliliters, or 1 piece.
     *
     * @type {number}
     */
    unit_calories;
}

/**
 * Implements metadata and utility methods for the Calorie Log Final Item entity.
 * @implements TeqFw_Db_Back_Api_RDb_Schema_Object
 */
export default class Svelters_Back_Store_RDb_Schema_Calorie_Log_Final_Item {
    /**
     * Constructor for the Calorie Log Final Item persistent DTO class.
     *
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Util_Cast$: cast
        }
    ) {
        // INSTANCE METHODS

        /**
         * Creates a DTO for the entity with type validation.
         *
         * @param {Svelters_Back_Store_RDb_Schema_Calorie_Log_Final_Item.Dto|Object} [data]
         * @returns {Svelters_Back_Store_RDb_Schema_Calorie_Log_Final_Item.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            if (data) {
                res.id = cast.int(data.id);
                res.log_ref = cast.int(data.log_ref);
                res.measure = cast.enum(data.measure, ['GRAMS', 'MILLILITERS', 'PIECES']);
                res.product = cast.string(data.product);
                res.quantity = cast.int(data.quantity);
                res.unit_calories = cast.int(data.unit_calories);
            }
            return res;
        };

        // noinspection JSCheckFunctionSignatures
        /**
         * Returns the attribute map for the entity.
         *
         * @returns {typeof Svelters_Back_Store_RDb_Schema_Calorie_Log_Final_Item.ATTR}
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
