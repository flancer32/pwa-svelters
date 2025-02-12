import assert from 'assert';
import {createContainer} from '@teqfw/test';
import {dbConnect, dbCreateFkEntities, dbDisconnect, dbReset, initConfig} from '../../../../../../../common.mjs';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

// SETUP ENVIRONMENT
/** @type {Svelters_Back_Store_RDb_Repo_Calorie_Log_Final_Item} */
const repoItem = await container.get('Svelters_Back_Store_RDb_Repo_Calorie_Log_Final_Item$');
const ATTR = repoItem.getSchema().getAttributes();

// TEST CONSTANTS
let LOG_REF = 1;
const PRODUCT = 'Apple';
const MEASURE = 'GRAMS';
const QUANTITY = 150;
const UNIT_CALORIES = 52;
let ITEM_ID;

describe('Svelters_Back_Store_RDb_Repo_Calorie_Log_Final_Item', () => {
    before(async () => {
        await dbReset(container);
        const {user} = await dbCreateFkEntities(container);
        await dbConnect(container);
        /** @type {Svelters_Back_Store_RDb_Repo_Calorie_Log_Final} */
        const repoFinal = await container.get('Svelters_Back_Store_RDb_Repo_Calorie_Log_Final$');
        const dto = repoFinal.createDto();
        dto.date = new Date();
        dto.date_committed = new Date();
        dto.total_calories = 100;
        dto.user_ref = user.id;
        const {primaryKey} = await repoFinal.createOne({dto});
        LOG_REF = primaryKey.id;
    });

    after(async () => {
        await dbDisconnect(container);
    });

    it('should create a new final log item', async () => {
        /** @type {Svelters_Back_Store_RDb_Schema_Calorie_Log_Final_Item.Dto} */
        const dto = repoItem.createDto();
        dto.log_ref = LOG_REF;
        dto.product = PRODUCT;
        dto.measure = MEASURE;
        dto.quantity = QUANTITY;
        dto.unit_calories = UNIT_CALORIES;

        const {primaryKey} = await repoItem.createOne({dto});
        ITEM_ID = primaryKey[ATTR.ID];
        assert.ok(primaryKey, 'Final log item should be created');
    });

    it('should read an existing final log item by ID', async () => {
        const {record} = await repoItem.readOne({key: {id: ITEM_ID}});

        assert.ok(record, 'Final log item should exist');
        assert.strictEqual(record.id, ITEM_ID, 'Final log item ID should match');
    });

    it('should list all final log items', async () => {
        const items = await repoItem.readMany({});

        assert.ok(items.records.length > 0, 'There should be at least one final log item');
    });

    it('should update an existing final log item', async () => {
        const {record} = await repoItem.readOne({key: {id: ITEM_ID}});
        record.quantity = 200;

        const {updatedCount} = await repoItem.updateOne({key: {id: ITEM_ID}, updates: {quantity: record.quantity}});

        assert.strictEqual(updatedCount, 1, 'One final log item should be updated');
        const {record: updated} = await repoItem.readOne({key: {id: ITEM_ID}});
        assert.strictEqual(updated.quantity, 200, 'Final log item quantity should be updated');
    });

    it('should delete an existing final log item', async () => {
        const {deletedCount} = await repoItem.deleteOne({key: {id: ITEM_ID}});

        assert.strictEqual(deletedCount, 1, 'One final log item should be deleted');
    });
});
