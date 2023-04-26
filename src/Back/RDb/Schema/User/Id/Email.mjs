/**
 *  Metadata for RDB entity: emails registry.
 *  @namespace Svelters_Back_RDb_Schema_User_Id_Email
 */
// MODULE'S VARS
const NS = 'Svelters_Back_RDb_Schema_User_Id_Email';
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/app/user/id/email';

/**
 * @memberOf Svelters_Back_RDb_Schema_User_Id_Email
 * @type {Object}
 */
const ATTR = {
    EMAIL: 'email',
    USER_REF: 'user_ref',
};
Object.freeze(ATTR);

// MODULE'S CLASSES
/**
 * @memberOf Svelters_Back_RDb_Schema_User_Id_Email
 */
class Dto {
    static namespace = NS;
    /**
     * @type {string}
     */
    email;
    /**
     * @type {number}
     */
    user_ref;
}

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Svelters_Back_RDb_Schema_User_Id_Email {
    constructor(spec) {
        /** @type {Svelters_Back_Defaults} */
        const DEF = spec['Svelters_Back_Defaults$'];
        /** @type {TeqFw_Db_Back_RDb_Schema_EntityBase} */
        const base = spec['TeqFw_Db_Back_RDb_Schema_EntityBase$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {Svelters_Back_RDb_Schema_User_Id_Email.Dto} [data]
         * @return {Svelters_Back_RDb_Schema_User_Id_Email.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.email = castString(data?.email);
            res.user_ref = castInt(data?.user_ref);
            return res;
        };

        /**
         * Set JSDoc return type, real code is in `TeqFw_Db_Back_RDb_Schema_EntityBase`.
         * @return {typeof Svelters_Back_RDb_Schema_User_Id_Email.ATTR}
         */
        this.getAttributes = function () {};

        // MAIN
        return base.create(this,
            `${DEF.SHARED.NAME}${ENTITY}`,
            ATTR,
            [ATTR.EMAIL],
            Dto
        );
    }

}