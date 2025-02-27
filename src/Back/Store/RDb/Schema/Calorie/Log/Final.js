/**
 * Persistent DTO with metadata for the RDB entity: Calorie Log Final.
 * @namespace Svelters_Back_Store_RDb_Schema_Calorie_Log_Final
 */

// MODULE'S VARS

/**
 * Path to the entity in the plugin's DEM.
 *
 * @type {string}
 */
const ENTITY = '/app/calorie/log/final';

/**
 * Attribute mappings for the entity.
 * @memberOf Svelters_Back_Store_RDb_Schema_Calorie_Log_Final
 */
const ATTR = {
    DATE: 'date',
    DATE_COMMITTED: 'date_committed',
    ID: 'id',
    TOTAL_CALORIES: 'total_calories',
    USER_REF: 'user_ref',
};
Object.freeze(ATTR);

// MODULE'S CLASSES

/**
 * DTO class representing the persistent structure of the Calorie Log Final entity.
 * @memberOf Svelters_Back_Store_RDb_Schema_Calorie_Log_Final
 */
class Dto {
    /**
     * The date of food consumption (YYYY-MM-DD).
     *
     * @type {string}
     */
    date;

    /**
     * The timestamp when the entry was finalized.
     *
     * @type {Date}
     */
    date_committed;

    /**
     * Internal numeric identifier for the finalized log entry.
     *
     * @type {number}
     */
    id;

    /**
     * The total calorie intake for the day. Precomputed for fast querying.
     *
     * @type {number}
     */
    total_calories;

    /**
     * Reference to the user who consumed the food.
     *
     * @type {number}
     */
    user_ref;
}

/**
 * Implements metadata and utility methods for the Calorie Log Final entity.
 * @implements TeqFw_Db_Back_Api_RDb_Schema_Object
 */
export default class Svelters_Back_Store_RDb_Schema_Calorie_Log_Final {
    /**
     * Constructor for the Calorie Log Final persistent DTO class.
     *
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     * @param {Svelters_Shared_Helper_Cast} helper
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Util_Cast$: cast,
            Svelters_Shared_Helper_Cast$: helper,
        }
    ) {
        // INSTANCE METHODS

        /**
         * Creates a DTO for the entity with type validation.
         *
         * @param {Svelters_Back_Store_RDb_Schema_Calorie_Log_Final.Dto|Object} [data]
         * @returns {Svelters_Back_Store_RDb_Schema_Calorie_Log_Final.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            if (data) {
                res.date = helper.dateString(data.date);
                res.date_committed = cast.date(data.date_committed);
                res.id = cast.int(data.id);
                res.total_calories = cast.int(data.total_calories);
                res.user_ref = cast.int(data.user_ref);
            }
            return res;
        };

        // noinspection JSCheckFunctionSignatures
        /**
         * Returns the attribute map for the entity.
         *
         * @returns {typeof Svelters_Back_Store_RDb_Schema_Calorie_Log_Final.ATTR}
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
