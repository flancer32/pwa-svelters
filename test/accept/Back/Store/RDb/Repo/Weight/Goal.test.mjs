import assert from 'assert';
import {createContainer} from '@teqfw/test';
import {dbConnect, dbCreateFkEntities, dbDisconnect, dbReset, initConfig} from '../../../../../common.mjs';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

// SETUP ENVIRONMENT
/** @type {Svelters_Back_Store_RDb_Repo_Weight_Goal} */
const repoWeightGoal = await container.get('Svelters_Back_Store_RDb_Repo_Weight_Goal$');
/** @type {Svelters_Shared_Helper_Cast} */
const helpCast = await container.get('Svelters_Shared_Helper_Cast$');

// TEST CONSTANTS
const WEIGHT = 75500;
const DATE = helpCast.dateString(new Date());
let GOAL_PK, USER_REF;

// Test Suite for Weight Goal Repository
describe('Svelters_Back_Store_RDb_Repo_Weight_Goal', () => {
    before(async () => {
        await dbReset(container);
        const {user} = await dbCreateFkEntities(container);
        USER_REF = user.id;
        await dbConnect(container);
    });

    after(async () => {
        await dbDisconnect(container);
    });

    it('should create a new weight goal entry', async () => {
        /** @type {Svelters_Back_Store_RDb_Schema_Weight_Goal.Dto} */
        const dto = repoWeightGoal.createDto();
        dto.date = DATE;
        dto.user_ref = USER_REF;
        dto.value = WEIGHT;

        const {primaryKey} = await repoWeightGoal.createOne({dto});
        GOAL_PK = primaryKey;
        assert.ok(primaryKey, 'Weight goal should be created');
    });

    it('should read an existing weight goal by ID', async () => {
        const {record} = await repoWeightGoal.readOne({key: GOAL_PK});

        assert.ok(record, 'Weight goal should exist');
        assert.strictEqual(record.date, DATE, 'Weight goal date should match');
        assert.strictEqual(record.user_ref, USER_REF, 'Weight goal user should match');
    });

    it('should list all weight goals', async () => {
        const goals = await repoWeightGoal.readMany({});

        assert.ok(goals.records.length > 0, 'There should be at least one weight goal');
    });

    it('should update an existing weight goal', async () => {
        const WEIGHT_NEW = 80000;
        const {record} = await repoWeightGoal.readOne({key: GOAL_PK});
        record.value = WEIGHT_NEW;

        const {updatedCount} = await repoWeightGoal.updateOne({key: GOAL_PK, updates: record});

        assert.strictEqual(updatedCount, 1, 'One weight goal should be updated');
        const {record: updated} = await repoWeightGoal.readOne({key: GOAL_PK});
        assert.strictEqual(updated.value, WEIGHT_NEW, 'Target weight should be updated');
    });

    it('should delete an existing weight goal', async () => {
        const {deletedCount} = await repoWeightGoal.deleteOne({key: GOAL_PK});

        assert.strictEqual(deletedCount, 1, 'One weight goal should be deleted');
    });
});