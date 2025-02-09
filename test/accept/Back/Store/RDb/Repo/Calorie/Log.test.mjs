import assert from 'assert';
import {createContainer} from '@teqfw/test';
import {dbConnect, dbCreateFkEntities, dbDisconnect, dbReset, initConfig} from '../../../../../common.mjs';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

// SETUP ENVIRONMENT
/** @type {Svelters_Back_Store_RDb_Repo_Calorie_Log} */
const repoLog = await container.get('Svelters_Back_Store_RDb_Repo_Calorie_Log$');
const ATTR = repoLog.getSchema().getAttributes();

// TEST CONSTANTS
const DATE = '2025-02-09';
const DATE_CREATED = new Date();
const MEASURE = 'grams';
const PRODUCT = 'Apple';
const QUANTITY = 150;
const UNIT_CALORIES = 52;
let LOG_ID, USER_REF;

// Test Suite for Calorie Log Repository
describe('Svelters_Back_Store_RDb_Repo_Calorie_Log', () => {
    before(async () => {
        await dbReset(container);
        const {user} = await dbCreateFkEntities(container);
        USER_REF = user.id;
        await dbConnect(container);
    });

    after(async () => {
        await dbDisconnect(container);
    });

    it('should create a new calorie log entry', async () => {
        /** @type {Svelters_Back_Store_RDb_Schema_Calorie_Log.Dto} */
        const dto = repoLog.createDto();
        dto.date = DATE;
        dto.date_created = DATE_CREATED;
        dto.measure = MEASURE;
        dto.product = PRODUCT;
        dto.quantity = QUANTITY;
        dto.unit_calories = UNIT_CALORIES;
        dto.user_ref = USER_REF;

        const {primaryKey} = await repoLog.createOne({dto});
        LOG_ID = primaryKey[ATTR.ID];
        assert.ok(primaryKey, 'Calorie log entry should be created');
    });

    it('should read an existing calorie log entry by ID', async () => {
        const {record} = await repoLog.readOne({key: {id: LOG_ID}});

        assert.ok(record, 'Calorie log entry should exist');
        assert.strictEqual(record.id, LOG_ID, 'Log ID should match');
    });

    it('should list all calorie log entries', async () => {
        const logs = await repoLog.readMany({});

        assert.ok(logs.records.length > 0, 'There should be at least one log entry');
    });

    it('should update an existing calorie log entry', async () => {
        const {record} = await repoLog.readOne({key: {id: LOG_ID}});
        record.product = 'Banana';

        const {updatedCount} = await repoLog.updateOne({key: {id: LOG_ID}, updates: {product: 'Banana'}});

        assert.strictEqual(updatedCount, 1, 'One calorie log entry should be updated');
        const {record: updated} = await repoLog.readOne({key: {id: LOG_ID}});
        assert.strictEqual(updated.product, 'Banana', 'Product name should be updated');
    });

    it('should delete an existing calorie log entry', async () => {
        const {deletedCount} = await repoLog.deleteOne({key: {id: LOG_ID}});

        assert.strictEqual(deletedCount, 1, 'One calorie log entry should be deleted');
    });
});
