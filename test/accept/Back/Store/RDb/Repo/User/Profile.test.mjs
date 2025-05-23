import assert from 'assert';
import {createContainer} from '@teqfw/test';
import {dbConnect, dbDisconnect, dbReset, initConfig, dbCreateFkEntities} from '../../../../../common.mjs';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

// SETUP ENVIRONMENT
/** @type {Svelters_Back_Store_RDb_Repo_User_Profile} */
const repoUserProfile = await container.get('Svelters_Back_Store_RDb_Repo_User_Profile$');

// TEST CONSTANTS
const DATE_BIRTH = new Date('1990-01-01');
const DATE_UPDATED = new Date();
const HEIGHT = 175;
const LOCALE = 'es-ES';
const NAME = 'Test User';
const SEX = 'FEMALE';
const TZ = 'Europe/Riga';
let USER_REF;

// Test Suite for User Profile Repository
describe('Svelters_Back_Store_RDb_Repo_User_Profile', () => {
    before(async () => {
        await dbReset(container);
        const {user} = await dbCreateFkEntities(container);
        USER_REF = user.id;
        await dbConnect(container);
    });

    after(async () => {
        await dbDisconnect(container);
    });

    it('should create a new user profile entry', async () => {
        /** @type {Svelters_Back_Store_RDb_Schema_User_Profile.Dto} */
        const dto = repoUserProfile.createDto();
        dto.date_birth = DATE_BIRTH;
        dto.date_updated = DATE_UPDATED;
        dto.height = HEIGHT;
        dto.locale = LOCALE;
        dto.name = NAME;
        dto.sex = SEX;
        dto.timezone = TZ;
        dto.user_ref = USER_REF;

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
            updates: {name: 'Updated Name', timezone: 'Europe/Madrid'}
        });

        assert.strictEqual(updatedCount, 1, 'One user profile should be updated');
        const {record: updated} = await repoUserProfile.readOne({key: {user_ref: USER_REF}});
        assert.strictEqual(updated.name, 'Updated Name', 'User name should be updated');
        assert.strictEqual(updated.timezone, 'Europe/Madrid', 'Timezone should be updated');
    });

    it('should delete an existing user profile', async () => {
        const {deletedCount} = await repoUserProfile.deleteOne({key: {user_ref: USER_REF}});

        assert.strictEqual(deletedCount, 1, 'One user profile should be deleted');
    });
});
