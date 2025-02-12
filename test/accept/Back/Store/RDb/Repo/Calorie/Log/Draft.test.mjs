import assert from 'assert';
import {createContainer} from '@teqfw/test';
import {dbConnect, dbCreateFkEntities, dbDisconnect, dbReset, initConfig} from '../../../../../../common.mjs';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

// SETUP ENVIRONMENT
/** @type {Svelters_Back_Store_RDb_Repo_Calorie_Log_Draft} */
const repoDraft = await container.get('Svelters_Back_Store_RDb_Repo_Calorie_Log_Draft$');
const ATTR = repoDraft.getSchema().getAttributes();

// TEST CONSTANTS
let USER_REF = 1;
const DATE = new Date();
const ITEMS = '{"food": "apple", "calories": 100}';
let DRAFT_ID;

describe('Svelters_Back_Store_RDb_Repo_Calorie_Log_Draft', () => {
    before(async () => {
        await dbReset(container);
        const {user} = await dbCreateFkEntities(container);
        USER_REF = user.id;
        await dbConnect(container);
    });

    after(async () => {
        await dbDisconnect(container);
    });

    it('should create a new draft entry', async () => {
        /** @type {Svelters_Back_Store_RDb_Schema_Calorie_Log_Draft.Dto} */
        const dto = repoDraft.createDto();
        dto.date = DATE;
        dto.date_created = DATE;
        dto.date_updated = DATE;
        dto.items = ITEMS;
        dto.user_ref = USER_REF;

        const {primaryKey} = await repoDraft.createOne({dto});
        DRAFT_ID = primaryKey[ATTR.ID];
        assert.ok(primaryKey, 'Draft should be created');
    });

    it('should read an existing draft by ID', async () => {
        const {record} = await repoDraft.readOne({key: {id: DRAFT_ID}});

        assert.ok(record, 'Draft should exist');
        assert.strictEqual(record.id, DRAFT_ID, 'Draft ID should match');
    });

    it('should list all drafts', async () => {
        const drafts = await repoDraft.readMany({});

        assert.ok(drafts.records.length > 0, 'There should be at least one draft');
    });

    it('should update an existing draft', async () => {
        const {record} = await repoDraft.readOne({key: {id: DRAFT_ID}});
        record.items = '{"food": "banana", "calories": 150}';

        const {updatedCount} = await repoDraft.updateOne({key: {id: DRAFT_ID}, updates: {items: record.items}});

        assert.strictEqual(updatedCount, 1, 'One draft should be updated');
        const {record: updated} = await repoDraft.readOne({key: {id: DRAFT_ID}});
        assert.strictEqual(updated.items, '{"food": "banana", "calories": 150}', 'Draft items should be updated');
    });

    it('should delete an existing draft', async () => {
        const {deletedCount} = await repoDraft.deleteOne({key: {id: DRAFT_ID}});

        assert.strictEqual(deletedCount, 1, 'One draft should be deleted');
    });
});
