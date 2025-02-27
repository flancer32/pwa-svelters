/**
 * Persistent DTO with metadata for the RDB entity: Calorie Log Draft.
 * @namespace Svelters_Back_Store_RDb_Schema_Calorie_Log_Draft
 */

// MODULE'S VARS

/**
 * Path to the entity in the plugin's DEM.
 *
 * @type {string}
 */
const ENTITY = '/app/calorie/log/draft';

/**
 * Attribute mappings for the entity.
 * @memberOf Svelters_Back_Store_RDb_Schema_Calorie_Log_Draft
 */
const ATTR = {
    DATE: 'date',
    DATE_CREATED: 'date_created',
    DATE_UPDATED: 'date_updated',
    ID: 'id',
    ITEMS: 'items',
    USER_REF: 'user_ref',
};
Object.freeze(ATTR);

// MODULE'S CLASSES

/**
 * DTO class representing the persistent structure of the Calorie Log Draft entity.
 * @memberOf Svelters_Back_Store_RDb_Schema_Calorie_Log_Draft
 */
class Dto {
    /**
     * The date of food consumption (YYYY-MM-DD). Each user has only one draft per day.
     *
     * @type {string}
     */
    date;

    /**
     * Timestamp when the draft was created.
     *
     * @type {Date}
     */
    date_created;

    /**
     * Timestamp when the draft was last updated.
     *
     * @type {Date}
     */
    date_updated;

    /**
     * Internal numeric identifier for the draft entry.
     *
     * @type {number}
     */
    id;

    /**
     * Draft list of consumed food items in a flexible JSON format.
     *
     * @type {string}
     */
    items;

    /**
     * Reference to the user who owns this draft.
     *
     * @type {number}
     */
    user_ref;
}

/**
 * Implements metadata and utility methods for the Calorie Log Draft entity.
 * @implements TeqFw_Db_Back_Api_RDb_Schema_Object
 */
export default class Svelters_Back_Store_RDb_Schema_Calorie_Log_Draft {
    /**
     * Constructor for the Calorie Log Draft persistent DTO class.
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
         * @param {Svelters_Back_Store_RDb_Schema_Calorie_Log_Draft.Dto|Object} [data]
         * @returns {Svelters_Back_Store_RDb_Schema_Calorie_Log_Draft.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            if (data) {
                res.date = helper.dateString(data.date);
                res.date_created = cast.date(data.date_created);
                res.date_updated = cast.date(data.date_updated);
                res.id = cast.int(data.id);
                res.items = cast.string(data.items);
                res.user_ref = cast.int(data.user_ref);
            }
            return res;
        };

        // noinspection JSCheckFunctionSignatures
        /**
         * Returns the attribute map for the entity.
         *
         * @returns {typeof Svelters_Back_Store_RDb_Schema_Calorie_Log_Draft.ATTR}
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
