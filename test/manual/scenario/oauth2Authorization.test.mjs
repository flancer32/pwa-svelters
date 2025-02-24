import {strict as assert} from 'assert';
import {createLocalContainer, stopApp} from '../common.mjs';

// SETUP CONTAINER
const container = await createLocalContainer();

// VARS
const HOST = process.env.HOST || 'localhost';
const STATE_CODE = 'stateCode';

// Get runtime environment
/** @type {Svelters_Back_Helper_Web} */
const helpWeb = await container.get('Svelters_Back_Helper_Web$');
/** @type {AppTest_Mod_OAuth2_Client} */
const modClient = await container.get('AppTest_Mod_OAuth2_Client$');
/** @type {AppTest_Mod_User} */
const modUser = await container.get('AppTest_Mod_User$');
/** @type {Fl64_Web_Session_Back_Defaults} */
const DEF_SESS = await container.get('Fl64_Web_Session_Back_Defaults$');

describe('OAuth2 Authorization Request', function () {
    this.timeout(100000);

    before(async function () { });

    after(async function () {
        await stopApp();
    });

    it('should return an error for invalid response_type', async function () {
        const {statusCode, body} = await helpWeb.get({
            hostname: HOST,
            path: '/fl64-oauth2/authorize?response_type=code1&client_id=clientId' +
                '&redirect_uri=https://callback.com' +
                '&state=stateCode&scope=actions',
            headers: {},
            timeout: 100000,
        });
        assert.ok(body.includes('The response type is invalid. Expected "code".'), 'Response body does not contain the expected content.');
        assert.strictEqual(statusCode, 400, 'Unexpected HTTP status code received.');
    });

    it('should return a permissions screen for right request', async function () {
        const client = await modClient.getTestClient();
        const sessUuid = await modUser.getSessionUuid();
        const headers = {
            'Content-Type': 'application/json',
            'Cookie': `${DEF_SESS.COOKIE_SESSION}=${sessUuid}`,
        };
        const {statusCode, body} = await helpWeb.get({
            hostname: HOST,
            path: `/fl64-oauth2/authorize?response_type=code&client_id=${client.client_id}` +
                `&redirect_uri=${client.redirect_uri}` +
                `&state=${STATE_CODE}&scope=actions`,
            headers,
            timeout: 100000,
        });
        assert.ok(body.includes('<h2>Authorize Application</h2>'), 'Response body does not contain the expected content.');
        assert.strictEqual(statusCode, 200, 'Unexpected HTTP status code received.');
    });

});
