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
    GOAL: 'goal',
    HEIGHT: 'height',
    LOCALE: 'locale',
    NAME: 'name',
    PROMPT_START: 'prompt_start',
    SEX: 'sex',
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
     * Date of birth.
     *
     * @type {string|Date}
     */
    date_birth;

    /**
     * Date-time for the last update.
     *
     * @type {Date}
     */
    date_updated;

    /**
     * User's current goal (e.g., weight loss target).
     *
     * @type {string}
     */
    goal;

    /**
     * Height in cm.
     *
     * @type {number}
     */
    height;

    /**
     * User's locale for language preferences.
     *
     * @type {string}
     */
    locale;

    /**
     * Name to display in profile.
     *
     * @type {string}
     */
    name;

    /**
     * Contains a brief context or instruction for the AI to start a new conversation, taking into account
     * the user's prior conversation history.
     * @type {string}
     */
    prompt_start;

    /**
     * Biological sex with values representing male and female categories.
     *
     * @type {string}
     * @see Svelters_Shared_Enum_Data_Type_Sex
     */
    sex;

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
     * @param {Svelters_Shared_Helper_Cast} helper
     * @param {typeof Svelters_Shared_Enum_Data_Type_Sex} SEX
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Util_Cast$: cast,
            Svelters_Shared_Helper_Cast$: helper,
            Svelters_Shared_Enum_Data_Type_Sex$: SEX,
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
                res.date_birth = helper.dateString(data.date_birth);
                res.date_updated = cast.date(data.date_updated);
                res.goal = cast.string(data.goal);
                res.height = cast.int(data.height);
                res.locale = cast.string(data.locale);
                res.name = cast.string(data.name);
                res.prompt_start = cast.string(data.prompt_start);
                res.sex = cast.enum(data.sex, SEX);
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
