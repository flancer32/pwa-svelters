/**
 * User data.
 */
// MODULE'S VARS
const NS = 'Svelters_Shared_Dto_User';


// MODULE'S CLASSES
/**
 * @memberOf Svelters_Shared_Dto_User
 */
class Dto {
    static namespace = NS;
    /** @type {string} */
    uuid;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Svelters_Shared_Dto_User {
    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        /**
         * @param {Svelters_Shared_Dto_User.Dto} [data]
         * @return {Svelters_Shared_Dto_User.Dto}
         */
        this.createDto = function (data) {
            // create new DTO
            const res = new Dto();
            // cast known attributes
            res.uuid = castString(data?.uuid);
            return res;
        };
    }
}
