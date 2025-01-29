/**
 * DTO for session data.
 * @namespace Svelters_Back_Dto_SessionData
 */

// CLASSES
/**
 * @memberOf Svelters_Back_Dto_SessionData
 */
class Dto {
    /** @type {Svelters_Back_Store_RDb_Schema_User.Dto|null} */
    user = null;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Svelters_Back_Dto_SessionData {
    /**
     * @param {Svelters_Back_Store_RDb_Schema_User} dtoUser
     */
    constructor(
        {
            Svelters_Back_Store_RDb_Schema_User$: dtoUser,
        }
    ) {
        /**
         * Create a new DTO and populate it with initialization data.
         * @param {Svelters_Back_Dto_SessionData.Dto} [data]
         * @returns {Svelters_Back_Dto_SessionData.Dto}
         */
        this.createDto = function (data) {
            // Initialize DTO with default values
            const res = Object.assign(new Dto(), data);
            // Cast and validate attributes
            if (data) {
                res.user = data.user ? dtoUser.createDto(data.user) : null;
            }
            return res;
        };
    }
}
