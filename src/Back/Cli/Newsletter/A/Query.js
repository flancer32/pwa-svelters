/**
 * RDB query builder to select data for newsletter users.
 *
 * @implements TeqFw_Db_Back_Api_RDb_Query_List
 */
export default class Svelters_Back_Cli_Newsletter_A_Query {
    /**
     * @param {TeqFw_Db_Back_Util_ListQuery} util
     * @param {Fl64_Auth_Otp_Back_Store_RDb_Schema_Email} rdbEmail
     * @param {Fl64_OAuth2_Social_Back_Store_RDb_Schema_User_Identity} rdbIdentity
     * @param {Svelters_Back_Store_RDb_Schema_User} rdbUser
     * @param {Svelters_Back_Cli_Newsletter_A_Dto_Item} dtoItem
     * @param {typeof Svelters_Shared_Enum_User_State} STATE
     */
    constructor(
        {
            TeqFw_Db_Back_Util_ListQuery$: util,
            Fl64_Auth_Otp_Back_Store_RDb_Schema_Email$: rdbEmail,
            Fl64_OAuth2_Social_Back_Store_RDb_Schema_User_Identity$: rdbIdentity,
            Svelters_Back_Store_RDb_Schema_User$: rdbUser,
            Svelters_Back_Cli_Newsletter_A_Dto_Item$: dtoItem,
            Svelters_Shared_Enum_User_State$: STATE,
        }
    ) {
        // CONST
        const {prepareGroupBy, prepareSelect} = util;

        const A_EMAIL = rdbEmail.getAttributes();
        const A_IDENTITY = rdbIdentity.getAttributes();
        const A_USER = rdbUser.getAttributes();

        // Map the DTO attributes to the query aliases
        const COL = dtoItem.getAttributes();
        Object.freeze(COL);

        /**
         * Aliases for tables in the query.
         * @memberOf Svelters_Back_Cli_Newsletter_A_Query
         */
        const TBL = {
            EMAIL: 'e',
            IDENTITY: 'i',
            USER: 'u',
        };
        Object.freeze(TBL);

        // Map the query aliases to the tables columns
        const MAP_FLD = {
            [COL.ID]: `${TBL.USER}.${A_USER.ID}`,
            [COL.OTP_EMAIL]: `${TBL.EMAIL}.${A_EMAIL.EMAIL}`,
            [COL.UID]: `${TBL.IDENTITY}.${A_IDENTITY.UID}`,
        };

        // No aggregate fields needed
        const MAP_AGG = {};

        // Compose the map of all the aliases
        const MAP = Object.assign({}, MAP_FLD, MAP_AGG);

        /**
         * Create the base query.
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {object} opts
         * @returns {Knex.QueryBuilder}
         */
        function init(trx, opts = {}) {
            const tEmail = {[TBL.EMAIL]: trx.getTableName(rdbEmail)};
            const tIdentity = {[TBL.IDENTITY]: trx.getTableName(rdbIdentity)};
            const tUser = {[TBL.USER]: trx.getTableName(rdbUser)};

            // Set the base table (user) as the primary entry point of the query
            const res = trx.createQuery();
            res.table(tUser);
            res.leftJoin(tEmail, `${TBL.EMAIL}.${A_EMAIL.USER_REF}`, `${TBL.USER}.${A_USER.ID}`);
            res.leftJoin(tIdentity, `${TBL.IDENTITY}.${A_IDENTITY.USER_REF}`, `${TBL.USER}.${A_USER.ID}`);
            res.where(`${TBL.USER}.${A_USER.STATE}`, STATE.ACTIVE);
            return res;
        }

        /**
         * Build the base query to select items.
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {object} [opts]
         * @returns {Knex.QueryBuilder}
         */
        this.build = function (trx, opts = {}) {
            const res = init(trx, opts);
            res.select(prepareSelect(COL, MAP));
            res.groupBy(prepareGroupBy(COL, MAP_FLD));
            return res;
        };

        /**
         * Build the base query to count items in the list.
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {object} [opts]
         * @returns {Knex.QueryBuilder}
         */
        this.buildCount = function (trx, opts = {}) {
            const res = init(trx, opts);
            res.select([{total: trx.raw(`COUNT(*)`)}]);
            res.groupBy(prepareGroupBy(COL, MAP_FLD));
            return res;
        };

        /**
         * Retrieve the aliases for the selected columns in the query.
         * @returns {Svelters_Back_Cli_Newsletter_A_Dto_Item.ATTR}
         */
        this.getColumns = () => COL;

        /**
         * Retrieve a mapping of table aliases used in this query.
         * @returns {typeof Svelters_Back_Cli_Newsletter_A_Query.TBL}
         */
        this.getTables = () => TBL;

        /**
         * Map query's column name to `alias.column` pair.
         *
         * @param {string} col
         * @returns {string|undefined}
         */
        this.mapColumn = function (col) {
            return MAP_FLD[col] ?? MAP_AGG[col];
        };
    }
}