import assert from 'assert';
import {createContainer} from '@teqfw/test';
import {
    dbConnect,
    dbCreateFkEntities,
    dbDisconnect,
    dbReset,
    initConfig
} from '../../../../../common.mjs';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

// SETUP ENVIRONMENT
/** @type {Svelters_Back_Store_RDb_Repo_User_Delete} */
const repoUserDelete = await container.get('Svelters_Back_Store_RDb_Repo_User_Delete$');
const ATTR = repoUserDelete.getSchema().getAttributes();
/** @type {typeof Svelters_Shared_Enum_User_Delete_State} */
const STATE = await container.get('Svelters_Shared_Enum_User_Delete_State$');

// TEST CONSTANTS
const DATE_CREATED = new Date();
const DATE_UPDATED = new Date();
let USER_REF;

// Test Suite for User Delete Repository
describe('Svelters_Back_Store_RDb_Repo_User_Delete', () => {
    before(async () => {
        await dbReset(container);
        const {user} = await dbCreateFkEntities(container);
        USER_REF = user.id;
        await dbConnect(container);
    });

    after(async () => {
        await dbDisconnect(container);
    });

    it('should create a new user delete record', async () => {
        /** @type {Svelters_Back_Store_RDb_Schema_User_Delete.Dto} */
        const dto = repoUserDelete.createDto();
        dto.date_created = DATE_CREATED;
        dto.date_updated = DATE_UPDATED;
        dto.state = STATE.ACTIVE;
        dto.user_ref = USER_REF;

        const {primaryKey} = await repoUserDelete.createOne({dto});
        assert.strictEqual(primaryKey[ATTR.USER_REF], USER_REF, 'User delete record should use user_ref as primary key');
    });

    it('should read the user delete record by user_ref', async () => {
        const {record} = await repoUserDelete.readOne({key: {[ATTR.USER_REF]: USER_REF}});
        assert.ok(record, 'User delete record should exist');
        assert.strictEqual(record.user_ref, USER_REF, 'Primary key should match user_ref');
    });

    it('should update the state of user delete record', async () => {
        const {updatedCount} = await repoUserDelete.updateOne({
            key: {[ATTR.USER_REF]: USER_REF},
            updates: {state: STATE.LOCKED}
        });
        assert.strictEqual(updatedCount, 1, 'User delete record should be updated');

        const {record} = await repoUserDelete.readOne({key: {[ATTR.USER_REF]: USER_REF}});
        assert.strictEqual(record.state, STATE.LOCKED, 'State should be updated to LOCKED');
    });

    it('should return user delete records list', async () => {
        const {records} = await repoUserDelete.readMany({});
        assert.ok(records.length > 0, 'There should be at least one user delete record');
    });

    it('should delete the user delete record by user_ref', async () => {
        const {deletedCount} = await repoUserDelete.deleteOne({key: {[ATTR.USER_REF]: USER_REF}});
        assert.strictEqual(deletedCount, 1, 'User delete record should be deleted');
    });
});
