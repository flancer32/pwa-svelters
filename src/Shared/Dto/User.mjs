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
    /**
     * UTC date of birth.
     * @type {Date}
     */
    dateBirth;
    /**
     * UTC date-time for user registration.
     * @type {Date}
     */
    dateRegistered;
    /** @type {string} */
    email;
    /** @type {number} */
    height;
    /** @type {string} */
    name;
    /** @type {string} */
    uuid;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Svelters_Shared_Dto_User {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast.castDate|function} castDate
     * @param {TeqFw_Core_Shared_Util_Cast.castInt|function} castInt
     * @param {TeqFw_Core_Shared_Util_Cast.castString|function} castString
     */
    constructor(
        {
            'TeqFw_Core_Shared_Util_Cast.castDate': castDate,
            'TeqFw_Core_Shared_Util_Cast.castInt': castInt,
            'TeqFw_Core_Shared_Util_Cast.castString': castString,
        }
    ) {
        /**
         * @param {Svelters_Shared_Dto_User.Dto} [data]
         * @return {Svelters_Shared_Dto_User.Dto}
         */
        this.createDto = function (data) {
            // create new DTO
            const res = new Dto();
            // cast known attributes
            res.dateBirth = castDate(data?.dateBirth);
            res.dateRegistered = castDate(data?.dateRegistered);
            res.email = castString(data?.email);
            res.height = castInt(data?.height);
            res.name = castString(data?.name);
            res.uuid = castString(data?.uuid);
            return res;
        };
    }
}
