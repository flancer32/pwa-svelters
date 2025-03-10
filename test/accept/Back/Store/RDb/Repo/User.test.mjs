import assert from 'assert';
import {createContainer} from '@teqfw/test';
import {dbConnect, dbDisconnect, dbReset, initConfig} from '../../../../common.mjs';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

// SETUP ENVIRONMENT
/** @type {Svelters_Back_Store_RDb_Repo_User} */
const repoUser = await container.get('Svelters_Back_Store_RDb_Repo_User$');
const ATTR = repoUser.getSchema().getAttributes();

// TEST CONSTANTS
const UUID = 'test-uuid';
const DATE_CREATED = new Date();
const DATE_SUBSCRIPTION = new Date('2026-12-31');
let USER_ID;

// Test Suite for User Repository
describe('Svelters_Back_Store_RDb_Repo_User', () => {
    before(async () => {
        await dbReset(container);
        await dbConnect(container);
    });

    after(async () => {
        await dbDisconnect(container);
    });

    it('should create a new user entry', async () => {
        /** @type {Svelters_Back_Store_RDb_Schema_User.Dto} */
        const dto = repoUser.createDto();
        dto.date_created = DATE_CREATED;
        dto.date_subscription = DATE_SUBSCRIPTION;
        dto.uuid = UUID;

        const {primaryKey} = await repoUser.createOne({dto});
        USER_ID = primaryKey[ATTR.ID];
        assert.ok(primaryKey, 'User should be created');
    });

    it('should read an existing user by ID', async () => {
        const {record} = await repoUser.readOne({key: {id: USER_ID}});

        assert.ok(record, 'User should exist');
        assert.strictEqual(record.id, USER_ID, 'User ID should match');
    });

    it('should list all users', async () => {
        const users = await repoUser.readMany({});

        assert.ok(users.records.length > 0, 'There should be at least one user');
    });

    it('should update an existing user', async () => {
        const {record} = await repoUser.readOne({key: {id: USER_ID}});
        record.uuid = 'updated-uuid';

        const {updatedCount} = await repoUser.updateOne({key: {id: USER_ID}, updates: {uuid: 'updated-uuid'}});

        assert.strictEqual(updatedCount, 1, 'One user should be updated');
        const {record: updated} = await repoUser.readOne({key: {id: USER_ID}});
        assert.strictEqual(updated.uuid, 'updated-uuid', 'User UUID should be updated');
    });

    it('should delete an existing user', async () => {
        const {deletedCount} = await repoUser.deleteOne({key: {id: USER_ID}});

        assert.strictEqual(deletedCount, 1, 'One user should be deleted');
    });
});
