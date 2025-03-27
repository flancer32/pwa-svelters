import assert from 'assert';
import {createContainer} from '@teqfw/test';
import {dbConnect, dbCreateFkEntities, dbDisconnect, dbReset, initConfig} from '../../../../../common.mjs';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

// SETUP ENVIRONMENT
/** @type {Svelters_Back_Store_RDb_Repo_Weight_Log} */
const repoWeightLog = await container.get('Svelters_Back_Store_RDb_Repo_Weight_Log$');
/** @type {Svelters_Shared_Helper_Cast} */
const helpCast = await container.get('Svelters_Shared_Helper_Cast$');

// TEST CONSTANTS
const WEIGHT = 75500;
const DATE = helpCast.dateString(new Date());
let LOG_PK, USER_REF;

// Test Suite for Weight Log Repository
describe('Svelters_Back_Store_RDb_Repo_Weight_Log', () => {
    before(async () => {
        await dbReset(container);
        const {user} = await dbCreateFkEntities(container);
        USER_REF = user.id;
        await dbConnect(container);
    });

    after(async () => {
        await dbDisconnect(container);
    });

    it('should create a new weight log entry', async () => {
        /** @type {Svelters_Back_Store_RDb_Schema_Weight_Log.Dto} */
        const dto = repoWeightLog.createDto();
        dto.value = WEIGHT;
        dto.date = DATE;
        dto.user_ref = USER_REF;

        const {primaryKey} = await repoWeightLog.createOne({dto});
        LOG_PK = primaryKey;
        assert.ok(primaryKey, 'Weight log should be created');
    });

    it('should read an existing weight log by ID', async () => {
        const {record} = await repoWeightLog.readOne({key: LOG_PK});

        assert.ok(record, 'Weight log should exist');
        assert.strictEqual(record.date, DATE, 'Weight log date should match');
        assert.strictEqual(record.user_ref, USER_REF, 'Weight log user should match');
    });

    it('should list all weight logs', async () => {
        const weightLogs = await repoWeightLog.readMany({});

        assert.ok(weightLogs.records.length > 0, 'There should be at least one weight log');
    });

    it('should update an existing weight log', async () => {
        const WEIGHT_NEW = 76000;
        const {record} = await repoWeightLog.readOne({key: LOG_PK});
        record.value = WEIGHT_NEW;

        const {updatedCount} = await repoWeightLog.updateOne({key: LOG_PK, updates: record});

        assert.strictEqual(updatedCount, 1, 'One weight log should be updated');
        const {record: updated} = await repoWeightLog.readOne({key: LOG_PK});
        assert.strictEqual(updated.value, WEIGHT_NEW, 'Weight should be updated');
    });

    it('should delete an existing weight log', async () => {
        const {deletedCount} = await repoWeightLog.deleteOne({key: LOG_PK});

        assert.strictEqual(deletedCount, 1, 'One weight log should be deleted');
    });
});