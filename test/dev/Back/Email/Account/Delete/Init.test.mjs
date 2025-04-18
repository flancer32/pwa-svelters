import {strict as assert} from 'assert';
import {createLocalContainer, stopApp} from '../../../../common.mjs';

// SETUP CONTAINER
const container = await createLocalContainer();

// VARS

// Get runtime environment
/** @type {Svelters_Back_Email_Account_Delete_Init} */
const service = await container.get('Svelters_Back_Email_Account_Delete_Init$');


describe('Svelters_Back_Email_Account_Delete_Init', function () {
    this.timeout(100000);

    before(async function () { });

    after(async function () {
        await stopApp();
    });

    it('should perform the service', async function () {
        await service.perform({userId: 3});
        assert.ok(true, 'The service is performed successfully.');
    });


});
