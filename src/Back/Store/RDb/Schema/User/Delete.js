/**
 * Persistent DTO with metadata for the RDB entity: User Delete.
 * @namespace Svelters_Back_Store_RDb_Schema_User_Delete
 */

// MODULE'S VARS

/**
 * Path to the entity in the plugin's DEM.
 *
 * @type {string}
 */
const ENTITY = '/app/user/delete';

/**
 * Attribute mappings for the entity.
 * @memberOf Svelters_Back_Store_RDb_Schema_User_Delete
 */
const ATTR = {
    DATE_CREATED: 'date_created',
    DATE_UPDATED: 'date_updated',
    STATE: 'state',
    USER_REF: 'user_ref',
};
Object.freeze(ATTR);

// MODULE'S CLASSES

/**
 * DTO class representing the persistent structure of the User Delete entity.
 * @memberOf Svelters_Back_Store_RDb_Schema_User_Delete
 */
class Dto {
    /**
     * Timestamp when the deletion record was created.
     *
     * @type {Date}
     */
    date_created;

    /**
     * Timestamp when the deletion record was last updated.
     *
     * @type {Date}
     */
    date_updated;

    /**
     * Current state of the deletion process.
     *
     * @type {string}
     */
    state;

    /**
     * Reference to the user being deleted.
     *
     * @type {number}
     */
    user_ref;
}

/**
 * Implements metadata and utility methods for the User Delete entity.
 * @implements TeqFw_Db_Back_Api_RDb_Schema_Object
 */
export default class Svelters_Back_Store_RDb_Schema_User_Delete {
    /**
     * Constructor for the User Delete persistent DTO class.
     *
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     * @param {Svelters_Shared_Enum_User_Delete_State} STATE
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Util_Cast$: cast,
            Svelters_Shared_Enum_User_Delete_State$: STATE
        }
    ) {
        // INSTANCE METHODS

        /**
         * @param {Svelters_Back_Store_RDb_Schema_User_Delete.Dto|Object} [data]
         * @returns {Svelters_Back_Store_RDb_Schema_User_Delete.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            if (data) {
                res.date_created = cast.date(data.date_created);
                res.date_updated = cast.date(data.date_updated);
                res.state = cast.enum(data.state, STATE);
                res.user_ref = cast.int(data.user_ref);
            }
            return res;
        };

        // noinspection JSCheckFunctionSignatures
        /**
         * Returns the attribute map for the entity.
         *
         * @returns {typeof Svelters_Back_Store_RDb_Schema_User_Delete.ATTR}
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
        this.getPrimaryKey = () => [ATTR.USER_REF];
    }
}