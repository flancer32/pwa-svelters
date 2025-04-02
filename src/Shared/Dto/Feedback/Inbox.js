/**
 * Represents the data transfer object (DTO) for feedback inbox data.
 *
 * @memberOf Svelters_Shared_Dto_Feedback_Inbox
 */
class Dto {

    /**
     * Original language code.
     *
     * @type {string}
     */
    lang;

    /**
     * Short summary for UI/email display.
     *
     * @type {string}
     */
    subject;

    /**
     * Translated text (or original if English).
     *
     * @type {string}
     */
    textEn;

    /**
     * Original feedback text in user's language.
     *
     * @type {string|null}
     */
    textOrigin;

}

/**
 * Factory class for creating instances of `Svelters_Shared_Dto_Feedback_Inbox.Dto`.
 * Provides type casting and basic validation.
 *
 * @implements TeqFw_Core_Shared_Api_Factory
 */
export default class Svelters_Shared_Dto_Feedback_Inbox {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast - Utility for type conversion.
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
        }
    ) {
        /**
         * Creates a new DTO instance with properly cast attributes.
         * Ensures valid types for enum and numeric fields.
         *
         * @param {*} [data] - Raw input data for the DTO.
         * @returns {Dto} - A fully structured and type-safe DTO instance.
         */
        this.create = function (data) {
            const res = Object.assign(new Dto(), data);
            if (data) {
                res.lang = cast.string(data.lang);
                res.subject = cast.string(data.subject);
                res.textEn = cast.string(data.textEn);
                res.textOrigin = cast.string(data.textOrigin);
            }
            return res;
        };
    }
}