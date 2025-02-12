import assert from 'assert';
import {createContainer} from '@teqfw/test';
import {dbConnect, dbCreateFkEntities, dbDisconnect, dbReset, initConfig} from '../../../../../../common.mjs';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

// SETUP ENVIRONMENT
/** @type {Svelters_Back_Store_RDb_Repo_Calorie_Log_Final} */
const repoFinal = await container.get('Svelters_Back_Store_RDb_Repo_Calorie_Log_Final$');
const ATTR = repoFinal.getSchema().getAttributes();

// TEST CONSTANTS
const DATE = new Date();
const TOTAL_CALORIES = 2000;
let FINAL_ID;
let USER_REF;

describe('Svelters_Back_Store_RDb_Repo_Calorie_Log_Final', () => {
    before(async () => {
        await dbReset(container);
        const {user} = await dbCreateFkEntities(container);
        USER_REF = user.id;
        await dbConnect(container);
    });

    after(async () => {
        await dbDisconnect(container);
    });

    it('should create a new final log entry', async () => {
        /** @type {Svelters_Back_Store_RDb_Schema_Calorie_Log_Final.Dto} */
        const dto = repoFinal.createDto();
        dto.date = DATE;
        dto.date_committed = DATE;
        dto.total_calories = TOTAL_CALORIES;
        dto.user_ref = USER_REF;

        const {primaryKey} = await repoFinal.createOne({dto});
        FINAL_ID = primaryKey[ATTR.ID];
        assert.ok(primaryKey, 'Final log should be created');
    });

    it('should read an existing final log by ID', async () => {
        const {record} = await repoFinal.readOne({key: {id: FINAL_ID}});

        assert.ok(record, 'Final log should exist');
        assert.strictEqual(record.id, FINAL_ID, 'Final log ID should match');
    });

    it('should list all final logs', async () => {
        const logs = await repoFinal.readMany({});

        assert.ok(logs.records.length > 0, 'There should be at least one final log');
    });

    it('should update an existing final log', async () => {
        const {record} = await repoFinal.readOne({key: {id: FINAL_ID}});
        record.total_calories = 2200;

        const {updatedCount} = await repoFinal.updateOne({
            key: {id: FINAL_ID},
            updates: {total_calories: record.total_calories}
        });

        assert.strictEqual(updatedCount, 1, 'One final log should be updated');
        const {record: updated} = await repoFinal.readOne({key: {id: FINAL_ID}});
        assert.strictEqual(updated.total_calories, 2200, 'Total calories should be updated');
    });

    it('should delete an existing final log', async () => {
        const {deletedCount} = await repoFinal.deleteOne({key: {id: FINAL_ID}});

        assert.strictEqual(deletedCount, 1, 'One final log should be deleted');
    });
});
