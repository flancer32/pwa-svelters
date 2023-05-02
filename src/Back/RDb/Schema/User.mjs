/**
 *  Metadata for RDB entity: users registry.
 *  @namespace Svelters_Back_RDb_Schema_User
 */
// MODULE'S VARS
const NS = 'Svelters_Back_RDb_Schema_User';
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/app/user';

/**
 * @memberOf Svelters_Back_RDb_Schema_User
 * @type {Object}
 */
const ATTR = {
    AGE: 'age',
    BID: 'bid',
    DATE_CREATED: 'date_created',
    DATE_UPDATED: 'date_updated',
    EMAIL: 'email',
    HEIGHT: 'height',
    NAME: 'name',
    UUID: 'uuid',
};
Object.freeze(ATTR);

// MODULE'S CLASSES
/**
 * @memberOf Svelters_Back_RDb_Schema_User
 */
class Dto {
    static namespace = NS;
    /** @type {number} */
    age;
    /**
     * Backend ID for user itself.
     * @type {number}
     */
    bid;
    /**
     * UTC date-time for user registration.
     * @type {Date}
     */
    date_created;
    /** @type {Date} */
    date_updated;
    /** @type {string} */
    email;
    /** @type {number} */
    height;
    /** @type {string} */
    name;
    /** @type {string} */
    uuid;
}

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Svelters_Back_RDb_Schema_User {
    constructor(spec) {
        /** @type {Svelters_Back_Defaults} */
        const DEF = spec['Svelters_Back_Defaults$'];
        /** @type {TeqFw_Db_Back_RDb_Schema_EntityBase} */
        const base = spec['TeqFw_Db_Back_RDb_Schema_EntityBase$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {Svelters_Back_RDb_Schema_User.Dto} [data]
         * @return {Svelters_Back_RDb_Schema_User.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.age = castInt(data?.age);
            res.bid = castInt(data?.bid);
            res.date_created = castDate(data?.date_created);
            res.date_updated = castDate(data?.date_updated);
            res.email = castString(data?.email);
            res.height = castInt(data?.height);
            res.name = castString(data?.name);
            res.uuid = castString(data?.uuid);
            return res;
        };

        /**
         * Set JSDoc return type, real code is in `TeqFw_Db_Back_RDb_Schema_EntityBase`.
         * @return {typeof Svelters_Back_RDb_Schema_User.ATTR}
         */
        this.getAttributes = function () {};

        // MAIN
        return base.create(this,
            `${DEF.SHARED.NAME}${ENTITY}`,
            ATTR,
            [ATTR.BID],
            Dto
        );
    }

}