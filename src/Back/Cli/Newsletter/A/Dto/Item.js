/**
 * Factory class for creating structured `Dto` instances with attribute metadata.
 * Complies with TeqFW dependency injection and module isolation rules.
 *
 * @implements {TeqFw_Core_Shared_Api_Factory_Dto_Meta}
 */
export default class Svelters_Back_Cli_Newsletter_A_Dto_Item {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast - Utility for type casting.
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast
        }
    ) {
        /**
         * Create a validated DTO instance from raw input.
         *
         * @param {*} [data] - Optional raw input object.
         * @returns {Dto} - Structured DTO instance with validated values.
         */
        this.create = function (data) {
            const res = Object.assign(new Dto(), data);
            if (data) {
                res.id = cast.int(data.id);
                res.otpEmail = cast.string(data.otpEmail);
                res.uid = cast.string(data.uid);
            }
            return res;
        };

        /**
         * Return a map of all valid DTO attributes.
         *
         * @returns {typeof Svelters_Back_Cli_Newsletter_A_Dto_Item.ATTR}
         */
        this.getAttributes = () => ATTR;
    }
}

/**
 * List of valid DTO attributes for runtime introspection.
 *
 * @memberOf Svelters_Back_Cli_Newsletter_A_Dto_Item
 * @type {Object<string, string>}
 */
const ATTR = {
    ID: 'id',
    OTP_EMAIL: 'otpEmail',
    UID: 'uid',
};

/**
 * Data Transfer Object structure for a newsletter item.
 *
 * This class defines the actual structure of the DTO.
 * It must not be exported. Use the factory method to create instances.
 *
 * @memberOf Svelters_Back_Cli_Newsletter_A_Dto_Item
 * @class
 */
class Dto {
    /** @type {number} */
    id;
    /** @type {string} */
    otpEmail;
    /** @type {string} */
    uid;
}