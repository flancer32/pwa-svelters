/**
 * Persistent DTO with metadata for the RDB entity: User Profile.
 * @namespace Svelters_Back_Store_RDb_Schema_User_Profile
 */

// MODULE'S VARS

/**
 * Path to the entity in the plugin's DEM.
 *
 * @type {string}
 */
const ENTITY = '/app/user/profile';

/**
 * Attribute mappings for the entity.
 * @memberOf Svelters_Back_Store_RDb_Schema_User_Profile
 */
const ATTR = {
    DATE_BIRTH: 'date_birth',
    DATE_UPDATED: 'date_updated',
    HEIGHT: 'height',
    NAME: 'name',
    TIMEZONE: 'timezone',
    USER_REF: 'user_ref',
};
Object.freeze(ATTR);

// MODULE'S CLASSES

/**
 * DTO class representing the persistent structure of the User Profile entity.
 * @memberOf Svelters_Back_Store_RDb_Schema_User_Profile
 */
class Dto {
    /**
     * UTC date of birth.
     *
     * @type {Date|null}
     */
    date_birth;

    /**
     * Date-time for the last update.
     *
     * @type {Date}
     */
    date_updated;

    /**
     * Height in cm.
     *
     * @type {number}
     */
    height;

    /**
     * Name to display in profile.
     *
     * @type {string}
     */
    name;
    /**
     * IANA timezone identifier (e.g., 'Europe/Riga').
     * @type {string}
     */
    timezone;
    /**
     * Reference to the user.
     *
     * @type {number}
     */
    user_ref;
}

/**
 * Implements metadata and utility methods for the User Profile entity.
 * @implements TeqFw_Db_Back_Api_RDb_Schema_Object
 */
export default class Svelters_Back_Store_RDb_Schema_User_Profile {
    /**
     * Constructor for the User Profile persistent DTO class.
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
         * @param {Svelters_Back_Store_RDb_Schema_User_Profile.Dto|Object} [data]
         * @returns {Svelters_Back_Store_RDb_Schema_User_Profile.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            if (data) {
                res.date_birth = cast.date(data.date_birth);
                res.date_updated = cast.date(data.date_updated);
                res.height = cast.int(data.height);
                res.name = cast.string(data.name);
                res.timezone = cast.string(data.timezone);
                res.user_ref = cast.int(data.user_ref);
            }
            return res;
        };

        /**
         * Returns the attribute map for the entity.
         *
         * @returns {typeof Svelters_Back_Store_RDb_Schema_User_Profile.ATTR}
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
