/**
 * Repository for managing Weight Log records in the database.
 * @implements TeqFw_Db_Back_Api_RDb_Repository
 */
export default class Svelters_Back_Store_RDb_Repo_Weight_Log {
    /**
     * @param {TeqFw_Db_Back_App_Crud} crud - CRUD engine for database operations.
     * @param {Svelters_Back_Store_RDb_Schema_Weight_Log} schema - Persistent DTO schema for Weight Log.
     */
    constructor(
        {
            TeqFw_Db_Back_App_Crud$: crud,
            Svelters_Back_Store_RDb_Schema_Weight_Log$: schema,
        }
    ) {
        /**
         * @param {Svelters_Back_Store_RDb_Schema_Weight_Log.Dto} [dto]
         * @returns {Svelters_Back_Store_RDb_Schema_Weight_Log.Dto}
         */
        this.createDto = (dto) => schema.createDto(dto);

        /**
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {Svelters_Back_Store_RDb_Schema_Weight_Log.Dto} [params.dto]
         * @returns {Promise<{primaryKey: Object<string, string|number>}>}
         */
        this.createOne = async function ({trx, dto}) {
            return crud.createOne({schema, trx, dto});
        };

        /**
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {Object} [params.conditions]
         * @returns {Promise<{deletedCount: number}>}
         */
        this.deleteMany = async function ({trx, conditions}) {
            return crud.deleteMany({schema, trx, conditions});
        };

        /**
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {Object} params.key
         * @returns {Promise<{deletedCount: number}>}
         */
        this.deleteOne = async function ({trx, key}) {
            return crud.deleteOne({schema, trx, key});
        };

        /**
         * @returns {Svelters_Back_Store_RDb_Schema_Weight_Log}
         */
        this.getSchema = () => schema;

        /**
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {Object} [params.conditions]
         * @param {Object<string, 'asc'|'desc'>} [params.sorting]
         * @param {{limit: number, offset: number}} [params.pagination]
         * @returns {Promise<{records: Array<Svelters_Back_Store_RDb_Schema_Weight_Log.Dto>}>}
         */
        this.readMany = async function ({trx, conditions, sorting, pagination}) {
            return crud.readMany({schema, trx, conditions, sorting, pagination});
        };

        /**
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {Object} params.key
         * @param {Array<string>} [params.select]
         * @returns {Promise<{record: Svelters_Back_Store_RDb_Schema_Weight_Log.Dto|null}>}
         */
        this.readOne = async function ({trx, key, select}) {
            return crud.readOne({schema, trx, key, select});
        };

        /**
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {Object} [params.conditions]
         * @param {Object} params.updates
         * @returns {Promise<{updatedCount: number}>}
         */
        this.updateMany = async function ({trx, conditions, updates}) {
            return crud.updateMany({schema, trx, conditions, updates});
        };

        /**
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {Object} [params.key]
         * @param {Object} params.updates
         * @returns {Promise<{updatedCount: number}>}
         */
        this.updateOne = async function ({trx, key, updates}) {
            return crud.updateOne({schema, trx, key, updates});
        };
    }
}