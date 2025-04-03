import {strict as assert} from 'assert';

import {createContainer} from '@teqfw/test';
import {dbConnect, dbDisconnect, dbReset, initConfig} from '../../../../common.mjs';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

// VARS
const HOST = process.env.HOST || 'localhost';
const STATE_CODE = 'stateCode';

// Get runtime environment
/** @type {Fl64_OAuth2_Social_Back_Api_App_UserManager} */
const adapter = await container.get('Fl64_OAuth2_Social_Back_Api_App_UserManager$');


describe('Svelters_Back_Di_Replace_Social_UserManager', function () {
    this.timeout(100000);

    before(async function () {
        await dbReset(container);
        await dbConnect(container);
    });

    after(async function () {
        await dbDisconnect(container);
    });

    it('should create a new user', async function () {
        const identity = {}, extras = {};
        const {id, redirectUrl} = await adapter.createUser({identity, extras});
        assert.ok(typeof id === 'number', 'The user id is expected.');
        assert.ok(typeof redirectUrl === 'string', 'The redirect URL is expected.');
    });


});
