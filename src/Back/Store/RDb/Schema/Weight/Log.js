/**
 * Persistent DTO with metadata for the RDB entity: Weight Log.
 * @namespace Svelters_Back_Store_RDb_Schema_Weight_Log
 */

// MODULE'S VARS

/**
 * Path to the entity in the plugin's DEM.
 *
 * @type {string}
 */
const ENTITY = '/app/weight/log';

/**
 * Attribute mappings for the entity.
 * @memberOf Svelters_Back_Store_RDb_Schema_Weight_Log
 */
const ATTR = {
    DATE: 'date',
    NOTE: 'note',
    USER_REF: 'user_ref',
    VALUE: 'value',
};
Object.freeze(ATTR);

// MODULE'S CLASSES

/**
 * DTO class representing the persistent structure of the Weight Log entity.
 * @memberOf Svelters_Back_Store_RDb_Schema_Weight_Log
 */
class Dto {
    /**
     * Date of weight measurement (no time part).
     *
     * @type {string}
     */
    date;

    /**
     * Optional user comment for the measurement.
     *
     * @type {string|null}
     */
    note;

    /**
     * Reference to the user.
     *
     * @type {number}
     */
    user_ref;

    /**
     * Weight value in grams.
     *
     * @type {number}
     */
    value;
}

/**
 * Implements metadata and utility methods for the Weight Log entity.
 * @implements TeqFw_Db_Back_Api_RDb_Schema_Object
 */
export default class Svelters_Back_Store_RDb_Schema_Weight_Log {
    /**
     * Constructor for the Weight Log persistent DTO class.
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
         * @param {Svelters_Back_Store_RDb_Schema_Weight_Log.Dto|Object} [data]
         * @returns {Svelters_Back_Store_RDb_Schema_Weight_Log.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            if (data) {
                res.date = helper.dateString(data.date);
                res.note = cast.string(data.note);
                res.user_ref = cast.int(data.user_ref);
                res.value = cast.int(data.value);
            }
            return res;
        };

        // noinspection JSCheckFunctionSignatures
        /**
         * Returns the attribute map for the entity.
         *
         * @returns {typeof Svelters_Back_Store_RDb_Schema_Weight_Log.ATTR}
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
        this.getPrimaryKey = () => [ATTR.USER_REF, ATTR.DATE];
    }
}