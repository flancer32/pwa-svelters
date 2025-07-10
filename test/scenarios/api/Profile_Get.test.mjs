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
/** @type {Svelters_Shared_Web_Api_Profile_Get} */
const endpoint = await container.get('Svelters_Shared_Web_Api_Profile_Get$');
const RESULT = endpoint.getResultCodes();

describe('Profile_Get', function () {

    this.timeout(100000);

    before(async function () {
        BEARER = await modUser.getBearerToken();
    });

    after(async function () {
        await stopApp();
    });

    it('should retrieve data', async function () {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${BEARER}`
        };
        const {statusCode, body} = await helpWeb.get({
            hostname: HOST,
            path: '/app/api/profile/get',
            headers,
            timeout: 100000,
        });
        assert.strictEqual(statusCode, 200, 'Unexpected HTTP status code received.');
        /** @type {Svelters_Shared_Web_Api_Profile_Get.Response} */
        const response = JSON.parse(body);
        assert.strictEqual(response.meta.ok, true, 'Unexpected response code received.');
    });
});
