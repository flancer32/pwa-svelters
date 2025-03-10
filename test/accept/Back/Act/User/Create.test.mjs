import assert from 'assert';
import {createContainer} from '@teqfw/test';
import {dbConnect, dbDisconnect, dbReset, initConfig} from '../../../common.mjs';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

/** @type {Svelters_Back_Act_User_Create} */
const userCreateAction = await container.get('Svelters_Back_Act_User_Create$');

// Test Suite for User Creation Action
describe('Svelters_Back_Act_User_Create', () => {
    before(async () => {
        await dbReset(container);
        await dbConnect(container);
    });

    after(async () => {
        await dbDisconnect(container);
    });

    it('should create a new user profile with valid properties', async () => {
        const {user} = await userCreateAction.run();

        assert.ok(user, 'User should be created');
        assert.ok(user.uuid, 'User UUID should be set');
        assert.ok(user.date_created, 'User creation date should be set');
        assert.ok(user.date_subscription, 'User subscription date should be set');
    });

    it('should generate unique UUIDs for different users', async () => {
        const {user: firstUser} = await userCreateAction.run();
        const {user: secondUser} = await userCreateAction.run();

        assert.notStrictEqual(
            firstUser.uuid,
            secondUser.uuid,
            'Each user should have a unique UUID'
        );
    });

    it('should assign a reasonable subscription end date', async () => {
        const {user} = await userCreateAction.run();

        const now = new Date();
        const futureLimit = new Date();
        futureLimit.setFullYear(futureLimit.getFullYear() + 10); // Arbitrary future limit

        assert.ok(
            user.date_subscription > now && user.date_subscription < futureLimit,
            'Subscription date should be in a reasonable future range'
        );
    });
});
