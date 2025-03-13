import {strict as assert} from 'assert';
import {createLocalContainer, stopApp} from '../../../../common.mjs';

// SETUP CONTAINER
const container = await createLocalContainer();

// VARS
const HOST = process.env.HOST || 'localhost';
const STATE_CODE = 'stateCode';

// Get runtime environment
/** @type {Svelters_Back_Act_User_Subscription_Info} */
const action = await container.get('Svelters_Back_Act_User_Subscription_Info$');


describe('Svelters_Back_Act_User_Subscription_Info', function () {
    this.timeout(100000);

    before(async function () { });

    after(async function () {
        await stopApp();
    });

    it('should perform the action', async function () {
        await action.run({});
        assert.ok(true, 'The action is done.');
    });


});
