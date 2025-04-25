/**
 * Repository for managing Feedback Inbox records in the database.
 * @implements TeqFw_Db_Back_Api_RDb_Repository
 */
export default class Svelters_Back_Store_RDb_Repo_Feedback_Inbox {
    /**
     * @param {TeqFw_Db_Back_App_Crud} crud - CRUD engine for database operations.
     * @param {Svelters_Back_Store_RDb_Schema_Feedback_Inbox} schema - Persistent DTO schema for Feedback Inbox.
     */
    constructor(
        {
            TeqFw_Db_Back_App_Crud$: crud,
            Svelters_Back_Store_RDb_Schema_Feedback_Inbox$: schema,
        }
    ) {
        /**
         * @param {Svelters_Back_Store_RDb_Schema_Feedback_Inbox.Dto} [dto]
         * @returns {Svelters_Back_Store_RDb_Schema_Feedback_Inbox.Dto}
         */
        this.createDto = (dto) => schema.createDto(dto);

        /**
         * @param {object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {Svelters_Back_Store_RDb_Schema_Feedback_Inbox.Dto} [params.dto]
         * @returns {Promise<{primaryKey: Object<string, string|number>}>}
         */
        this.createOne = async function ({trx, dto}) {
            return crud.createOne({schema, trx, dto});
        };

        /**
         * @param {object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {object} [params.conditions]
         * @returns {Promise<{deletedCount: number}>}
         */
        this.deleteMany = async function ({trx, conditions}) {
            return crud.deleteMany({schema, trx, conditions});
        };

        /**
         * @param {object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {object} params.key
         * @returns {Promise<{deletedCount: number}>}
         */
        this.deleteOne = async function ({trx, key}) {
            return crud.deleteOne({schema, trx, key});
        };

        /**
         * @returns {Svelters_Back_Store_RDb_Schema_Feedback_Inbox}
         */
        this.getSchema = () => schema;

        /**
         * @param {object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {TeqFw_Db_Shared_Dto_List_Selection.Dto} [params.selection]
         * @param {object} [params.conditions]
         * @param {Object<string, 'asc'|'desc'>} [params.sorting]
         * @param {{limit: number, offset: number}} [params.pagination]
         * @returns {Promise<{records: Array<Svelters_Back_Store_RDb_Schema_Feedback_Inbox.Dto>}>}
         */
        this.readMany = async function ({trx, selection, conditions, sorting, pagination}) {
            return crud.readMany({schema, trx, selection, conditions, sorting, pagination});
        };

        /**
         * @param {object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {object} params.key
         * @param {Array<string>} [params.select]
         * @returns {Promise<{record: Svelters_Back_Store_RDb_Schema_Feedback_Inbox.Dto|null}>}
         */
        this.readOne = async function ({trx, key, select}) {
            return crud.readOne({schema, trx, key, select});
        };

        /**
         * @param {object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {object} [params.conditions]
         * @param {object} params.updates
         * @returns {Promise<{updatedCount: number}>}
         */
        this.updateMany = async function ({trx, conditions, updates}) {
            return crud.updateMany({schema, trx, conditions, updates});
        };

        /**
         * @param {object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {object} [params.key]
         * @param {object} params.updates
         * @returns {Promise<{updatedCount: number}>}
         */
        this.updateOne = async function ({trx, key, updates}) {
            return crud.updateOne({schema, trx, key, updates});
        };
    }
}