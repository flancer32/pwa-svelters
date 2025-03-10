/**
 * Persistent DTO with metadata for the RDB entity: User.
 * @namespace Svelters_Back_Store_RDb_Schema_User
 */

// MODULE'S VARS

/**
 * Path to the entity in the plugin's DEM.
 *
 * @type {string}
 */
const ENTITY = '/app/user';

/**
 * Attribute mappings for the entity.
 * @memberOf Svelters_Back_Store_RDb_Schema_User
 */
const ATTR = {
    DATE_CREATED: 'date_created',
    DATE_SUBSCRIPTION: 'date_subscription',
    ID: 'id',
    UUID: 'uuid',
};
Object.freeze(ATTR);

// MODULE'S CLASSES

/**
 * DTO class representing the persistent structure of the User entity.
 * @memberOf Svelters_Back_Store_RDb_Schema_User
 */
class Dto {
    /**
     * Date-time for user registration.
     *
     * @type {Date}
     */
    date_created;

    /**
     * Date-time when the user's subscription expires.
     *
     * @type {Date}
     */
    date_subscription;

    /**
     * Internal ID used in foreign keys.
     *
     * @type {number}
     */
    id;

    /**
     * Universally unique identifier as public ID.
     *
     * @type {string}
     */
    uuid;
}

/**
 * Implements metadata and utility methods for the User entity.
 * @implements TeqFw_Db_Back_Api_RDb_Schema_Object
 */
export default class Svelters_Back_Store_RDb_Schema_User {
    /**
     * Constructor for the User persistent DTO class.
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
         * @param {Svelters_Back_Store_RDb_Schema_User.Dto|Object} [data]
         * @returns {Svelters_Back_Store_RDb_Schema_User.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            if (data) {
                res.date_created = cast.date(data.date_created);
                res.date_subscription = cast.date(data.date_subscription);
                res.id = cast.int(data.id);
                res.uuid = cast.string(data.uuid);
            }
            return res;
        };

        /**
         * Returns the attribute map for the entity.
         *
         * @returns {typeof Svelters_Back_Store_RDb_Schema_User.ATTR}
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
