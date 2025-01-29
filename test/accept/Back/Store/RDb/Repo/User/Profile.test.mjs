import assert from 'assert';
import {createContainer} from '@teqfw/test';
import {dbConnect, dbDisconnect, dbReset, initConfig} from '../../../../../common.mjs';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

// SETUP ENVIRONMENT
/** @type {Svelters_Back_Store_RDb_Repo_User_Profile} */
const repoUserProfile = await container.get('Svelters_Back_Store_RDb_Repo_User_Profile$');
/** @type {Svelters_Back_Store_RDb_Repo_User} */
const repoUser = await container.get('Svelters_Back_Store_RDb_Repo_User$');
const ATTR_USER = repoUser.getSchema().getAttributes();

// TEST CONSTANTS
let USER_REF;
const NAME = 'Test User';
const HEIGHT = 175;
const DATE_BIRTH = new Date('1990-01-01');
const DATE_UPDATED = new Date();

// Test Suite for User Profile Repository
describe('Svelters_Back_Store_RDb_Repo_User_Profile', () => {
    before(async () => {
        await dbReset(container);
        await dbConnect(container);
        const dto = repoUser.getSchema().createDto();
        dto.date_created = new Date();
        dto.uuid = 'uuid';
        const {primaryKey} = await repoUser.createOne({dto});
        USER_REF = primaryKey[ATTR_USER.ID];
    });

    after(async () => {
        await dbDisconnect(container);
    });

    it('should create a new user profile entry', async () => {
        /** @type {Svelters_Back_Store_RDb_Schema_User_Profile.Dto} */
        const dto = repoUserProfile.createDto();
        dto.user_ref = USER_REF;
        dto.name = NAME;
        dto.height = HEIGHT;
        dto.date_birth = DATE_BIRTH;
        dto.date_updated = DATE_UPDATED;

        const {primaryKey} = await repoUserProfile.createOne({dto});
        assert.ok(primaryKey, 'User profile should be created');
    });

    it('should read an existing user profile by User Reference', async () => {
        const {record} = await repoUserProfile.readOne({key: {user_ref: USER_REF}});

        assert.ok(record, 'User profile should exist');
        assert.strictEqual(record.user_ref, USER_REF, 'User Reference should match');
    });

    it('should list all user profiles', async () => {
        const profiles = await repoUserProfile.readMany({});

        assert.ok(profiles.records.length > 0, 'There should be at least one user profile');
    });

    it('should update an existing user profile', async () => {
        const {record} = await repoUserProfile.readOne({key: {user_ref: USER_REF}});
        record.name = 'Updated Name';

        const {updatedCount} = await repoUserProfile.updateOne({
            key: {user_ref: USER_REF},
            updates: {name: 'Updated Name'}
        });

        assert.strictEqual(updatedCount, 1, 'One user profile should be updated');
        const {record: updated} = await repoUserProfile.readOne({key: {user_ref: USER_REF}});
        assert.strictEqual(updated.name, 'Updated Name', 'User name should be updated');
    });

    it('should delete an existing user profile', async () => {
        const {deletedCount} = await repoUserProfile.deleteOne({key: {user_ref: USER_REF}});

        assert.strictEqual(deletedCount, 1, 'One user profile should be deleted');
    });
});
