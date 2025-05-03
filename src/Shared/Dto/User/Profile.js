/**
 * Factory class for user profile information.
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
            Svelters_Shared_Enum_Data_Type_Sex$: SEX,
        }
    ) {
        /**
         * Creates a new DTO instance with properly casted attributes.
         * Ensures valid values for enums and numerical fields.
         *
         * @param {Dto|object} [data] - Raw input data for the DTO.
         * @returns {Dto} - A properly structured DTO instance.
         */
        this.create = function (data) {
            /** @type {Svelters_Shared_Dto_User_Profile.Dto} */
            const res = Object.assign(new Dto(), data);

            if (data) {
                res.dateBirth = cast.string(data.dateBirth);
                res.dateCreated = cast.date(data.dateCreated);
                res.dateSubscriptionEnd = cast.date(data.dateSubscriptionEnd);
                res.dateUpdated = cast.date(data.dateUpdated);
                res.email = cast.string(data.email);
                res.goal = cast.string(data.goal);
                res.height = cast.int(data.height);
                res.lastCaloriesDate = cast.string(data.lastCaloriesDate);
                res.lastCaloriesTotal = cast.decimal(data.lastCaloriesTotal);
                res.locale = cast.string(data.locale);
                res.name = cast.string(data.name);
                res.promptStart = cast.string(data.promptStart);
                res.sex = cast.enum(data.sex, SEX);
                res.timezone = cast.string(data.timezone);
                res.uuid = cast.string(data.uuid);
                res.weight = cast.decimal(data.weight);
                res.weightGoal = cast.decimal(data.weightGoal);
            }

            return res;
        };
    }
}

/**
 * The user profile information.
 *
 * @memberOf Svelters_Shared_Dto_User_Profile
 */
class Dto {
    /**
     * Date of birth in YYYY-MM-DD format. Used for BMR (Basal Metabolic Rate) and age-related calculations.
     * @type {string}
     */
    dateBirth;

    /**
     * ISO timestamp of profile creation. Indicates the account registration time.
     * @type {Date|string}
     */
    dateCreated;

    /**
     * ISO timestamp indicating when the current subscription expires. Determines access to premium features and data persistence.
     * @type {Date|string}
     */
    dateSubscriptionEnd;

    /**
     * ISO timestamp of the most recent profile update.
     * @type {Date|string}
     */
    dateUpdated;

    /**
     * User's email address (optional).
     */
    email;

    /**
     * User-defined wellness goal, such as target weight or deadline. Interpreted by the Assistant for motivation and progress analysis.
     * @type {string}
     */
    goal;

    /**
     * User's height in centimeters. Used for BMR and calorie goal calculations.
     * @type {number}
     */
    height;

    /**
     * The date of the most recent calorie log entry, in YYYY-MM-DD format.
     * Used for tracking logging activity and showing progress on the dashboard.
     * @type {string}
     */
    lastCaloriesDate;

    /**
     * Total calories recorded in the most recent log entry.
     * Helps visualize dietary input on the dashboard.
     * @type {number}
     */
    lastCaloriesTotal;
    /**
     * @type {Svelters_Shared_Dto_Calorie_Log.Dto}
     */
    lastCaloriesLog;

    /**
     * Language preference of the user, in BCP 47 format (e.g., en, fr). Used to personalize Assistant responses.
     * @type {string}
     */
    locale;

    /**
     * User's display name shown in the interface. Not necessarily unique.
     * @type {string}
     */
    name;

    /**
     * Brief context for GPT-based Assistant to resume personalized conversations. Encapsulates prior user goals, preferences, and tone.
     * @type {string}
     */
    promptStart;

    /**
     * User's biological sex. Used in metabolic calculations.
     * @type {string}
     * @see Svelters_Shared_Enum_Data_Type_Sex
     */
    sex;

    /**
     * User's timezone in IANA format (e.g., Europe/Riga). Used for localizing reminders and daily logs.
     * @type {string}
     */
    timezone;

    /**
     * Universally unique identifier of the user profile. Used as a public key across all user-related operations.
     * @type {string}
     */
    uuid;

    /**
     * Current body weight in kilograms. Used in progress tracking and metabolic analysis.
     * @type {number}
     */
    weight;

    /**
     * Current target body weight in kilograms. Used to assess progress toward the user's goal.
     * @type {number}
     */
    weightGoal;
}