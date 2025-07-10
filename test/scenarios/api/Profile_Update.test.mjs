import {createLocalContainer, stopApp} from '../common.mjs';
import {strict as assert} from 'assert';

// SETUP CONTAINER
const container = await createLocalContainer();

// VARS
const HOST = process.env.HOST || 'localhost';
let BEARER;

// Get runtime environment
/** @type {Svelters_Back_Helper_Web} */
const helpWeb = await container.get('Svelters_Back_Helper_Web$');
/** @type {AppTest_Mod_User} */
const modUser = await container.get('AppTest_Mod_User$');
/** @type {Svelters_Shared_Web_Api_Profile_Update} */
const endpoint = await container.get('Svelters_Shared_Web_Api_Profile_Update$');
const RESULT = endpoint.getResultCodes();

describe('Profile_Update', function () {

    this.timeout(100000);

    before(async function () {
        BEARER = await modUser.getBearerToken();
    });

    after(async function () {
        await stopApp();
    });

    it('should update data', async function () {
        const payload = {
            profile: {
                dateBirth: '1990-01-01',
                dateCreated: new Date().toISOString(),
                dateUpdated: new Date().toISOString(),
                goal: 'weight_loss',
                height: 180,
                locale: 'en',
                name: 'John Doe',
                timezone: 'Europe/Riga',
                uuid: '550e8400-e29b-41d4-a716-446655440000',
                weight: 75000
            }
        };
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${BEARER}`
        };
        const {statusCode, body} = await helpWeb.post({
            hostname: HOST,
            path: '/app/api/profile/update',
            payload,
            headers,
            timeout: 100000,
        });
        assert.strictEqual(statusCode, 200, 'Unexpected HTTP status code received.');
        /** @type {Svelters_Shared_Web_Api_Profile_Update.Response} */
        const response = JSON.parse(body);
        assert.strictEqual(response.meta.ok, true, 'Unexpected response code received.');
    });
});
