/**
 *  Metadata for RDB entity: invitations to bind new device to user.
 *  @namespace Svelters_Back_RDb_Schema_User_Device_Invite
 */
// MODULE'S VARS
const NS = 'Svelters_Back_RDb_Schema_User_Device_Invite';
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/app/user/device/invite';

/**
 * @memberOf Svelters_Back_RDb_Schema_User_Device_Invite
 * @type {Object}
 */
const ATTR = {
    CODE: 'code',
    DATE_CREATED: 'date_created',
    USER_REF: 'user_ref',
};
Object.freeze(ATTR);

// MODULE'S CLASSES
/**
 * @memberOf Svelters_Back_RDb_Schema_User_Device_Invite
 */
class Dto {
    static namespace = NS;
    /** @type {string} */
    code;
    /** @type {Date} */
    date_created;
    /** @type {number} */
    user_ref;
}

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Svelters_Back_RDb_Schema_User_Device_Invite {
    /**
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Db_Back_RDb_Schema_EntityBase} base
     * @param {TeqFw_Core_Shared_Util_Cast.castDate|function} castDate
     * @param {TeqFw_Core_Shared_Util_Cast.castInt|function} castInt
     * @param {TeqFw_Core_Shared_Util_Cast.castString|function} castString
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            TeqFw_Db_Back_RDb_Schema_EntityBase$: base,
            'TeqFw_Core_Shared_Util_Cast.castDate': castDate,
            'TeqFw_Core_Shared_Util_Cast.castInt': castInt,
            'TeqFw_Core_Shared_Util_Cast.castString': castString,
        }
    ) {
        // INSTANCE METHODS
        /**
         * @param {Svelters_Back_RDb_Schema_User_Device_Invite.Dto} [data]
         * @return {Svelters_Back_RDb_Schema_User_Device_Invite.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.code = castString(data?.code);
            res.date_created = castDate(data?.date_created);
            res.user_ref = castInt(data?.user_ref);
            return res;
        };

        /**
         * Set JSDoc return type, real code is in `TeqFw_Db_Back_RDb_Schema_EntityBase`.
         * @return {typeof Svelters_Back_RDb_Schema_User_Device_Invite.ATTR}
         */
        this.getAttributes = function () {};

        // MAIN
        return base.create(this,
            `${DEF.SHARED.NAME}${ENTITY}`,
            ATTR,
            [ATTR.CODE],
            Dto
        );
    }

}