/**
 * @memberOf Svelters_Shared_Dto_Web_Api_Response_Meta
 * DTO class for meta information in GPT-chat responses.
 * Contains only data, no business logic.
 */
class Dto {
    /**
     * The result code depends on the endpoint.
     * @type {string}
     */
    code;

    /**
     * Optional message explaining the result code, if necessary.
     * @type {string}
     */
    message;

    /**
     * `true` means the application processed the message normally and without errors.
     * @type {boolean}
     */
    ok;
}

/**
 * Factory class for creating DTO objects in Svelters project.
 * @implements TeqFw_Core_Shared_Api_Factory
 */
export default class Svelters_Shared_Dto_Web_Api_Response_Meta {
    /**
     * Creates a new DTO object.
     * @param {TeqFw_Core_Shared_Util_Cast} cast - The cast utility for type conversion.
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast
        }
    ) {
        /**
         * Factory method to create a new instance of Dto.
         * @param {object} [data]
         * @returns {Svelters_Shared_Dto_Web_Api_Response_Meta.Dto} A new instance of Dto with the provided data.
         */
        this.create = function (data) {
            const res = new Dto();
            if (data) {
                res.code = cast.string(data.code);
                res.message = cast.string(data.message);
                res.ok = cast.boolean(data.ok);
            }
            return res;
        };
    }
}
