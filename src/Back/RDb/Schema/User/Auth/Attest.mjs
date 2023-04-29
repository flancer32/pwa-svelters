/**
 *  Metadata for RDB entity: public keys to authenticate users (WebAuthn API).
 *  @namespace Svelters_Back_RDb_Schema_User_Auth_Attest
 */
// MODULE'S VARS
const NS = 'Svelters_Back_RDb_Schema_User_Auth_Attest';
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/app/user/auth/attest';

/**
 * @memberOf Svelters_Back_RDb_Schema_User_Auth_Attest
 * @type {Object}
 */
const ATTR = {
    ATTESTATION_ID: 'attestation_id',
    BID: 'bid',
    DATE_CREATED: 'date_created',
    PUBLIC_KEY: 'public_key',
    USER_REF: 'user_ref',
};
Object.freeze(ATTR);

// MODULE'S CLASSES
/**
 * @memberOf Svelters_Back_RDb_Schema_User_Auth_Attest
 */
class Dto {
    static namespace = NS;
    /** @type {string} */
    attestation_id;
    /** @type {number} */
    bid;
    /** @type {Date} */
    date_created;
    /** @type {string} */
    public_key;
    /** @type {number} */
    user_ref;
}

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class Svelters_Back_RDb_Schema_User_Auth_Attest {
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
         * @param {Svelters_Back_RDb_Schema_User_Auth_Attest.Dto} [data]
         * @return {Svelters_Back_RDb_Schema_User_Auth_Attest.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.attestation_id = castString(data?.attestation_id);
            res.bid = castInt(data?.bid);
            res.public_key = castString(data?.public_key);
            res.date_created = castDate(data?.date_created);
            res.user_ref = castInt(data?.user_ref);
            return res;
        };

        /**
         * Set JSDoc return type, real code is in `TeqFw_Db_Back_RDb_Schema_EntityBase`.
         * @return {typeof Svelters_Back_RDb_Schema_User_Auth_Attest.ATTR}
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