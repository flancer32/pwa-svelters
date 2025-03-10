/**
 * @memberOf Svelters_Shared_Dto_User_Profile
 * DTO class for user profile information.
 */
class Dto {
    /**
     * Date of birth in string format (YYYY-MM-DD).
     * This field must be a string, not a Date object.
     * @type {string}
     */
    dateBirth;

    /**
     * Date-time for user registration (JavaScript Date object).
     * @type {Date}
     */
    dateCreated;
    /**
     * Date-time when the user's subscription expires.
     * @type {Date}
     */
    dateSubscriptionEnd;

    /**
     * Date-time for the last update (JavaScript Date object).
     * @type {Date}
     */
    dateUpdated;

    /**
     * User's current goal (e.g., weight loss target).
     * @type {string}
     */
    goal;

    /**
     * Height in cm (integer).
     * @type {number}
     */
    height;

    /**
     * User's locale for language preferences (e.g., 'en', 'fr').
     * @type {string}
     */
    locale;

    /**
     * Name to display in profile.
     * @type {string}
     */
    name;

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
     * Universally unique identifier as public ID.
     * @type {string}
     */
    uuid;

    /**
     * Weight in grams (integer).
     * @type {number}
     */
    weight;
}

/**
 * Factory class for creating instances of `Svelters_Shared_Dto_User_Profile`.
 * Ensures type conversion and validation.
 *
 * @implements TeqFw_Core_Shared_Api_Factory
 */
export default class Svelters_Shared_Dto_User_Profile {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast - Utility for type conversions.
     * @param {typeof Svelters_Shared_Enum_Data_Type_Sex} SEX
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
            'Svelters_Shared_Enum_Data_Type_Sex.default': SEX,
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
            const res = Object.assign(new Dto(), data);

            if (data) {
                res.dateBirth = cast.string(data.dateBirth);
                res.dateCreated = cast.date(data.dateCreated);
                res.dateSubscriptionEnd = cast.date(data.dateSubscriptionEnd);
                res.dateUpdated = cast.date(data.dateUpdated);
                res.goal = cast.string(data.goal);
                res.height = cast.int(data.height);
                res.locale = cast.string(data.locale);
                res.name = cast.string(data.name);
                res.sex = cast.enum(data.sex, SEX);
                res.timezone = cast.string(data.timezone);
                res.uuid = cast.string(data.uuid);
                res.weight = cast.int(data.weight);
            }

            return res;
        };
    }
}
