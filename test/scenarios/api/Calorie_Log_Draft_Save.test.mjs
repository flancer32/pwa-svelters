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
/** @type {Svelters_Shared_Web_Api_Calorie_Log_Save} */
const endpoint = await container.get('Svelters_Shared_Web_Api_Calorie_Log_Save$');
const RESULT = endpoint.getResultCodes();

describe('Calorie_Log_Draft_Save', function () {

    this.timeout(100000);

    before(async function () {
        BEARER = await modUser.getBearerToken();
    });

    after(async function () {
        await stopApp();
    });

    it('should save a draft log with simple data', async function () {
        const payload = {
            date: (new Date()).toISOString().split('T')[0],
            items: [
                {
                    'food': 'Apple',
                    'quantity': 150,
                    'measure': 'GRAMS',
                    'unitCalories': 52,
                    'totalCalories': 78
                },
                {
                    'food': 'Rice',
                    'quantity': 200,
                    'measure': 'GRAMS',
                    'unitCalories': 365,
                    'totalCalories': 730
                },
                {
                    'food': 'Chicken Breast',
                    'quantity': 250,
                    'measure': 'GRAMS',
                    'unitCalories': 165,
                    'totalCalories': 412.5
                }
            ]
        };
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${BEARER}`
        };
        const {statusCode} = await helpWeb.post({
            hostname: HOST,
            path: '/app/api/calorie/log/draft/save/',
            payload,
            headers,
            timeout: 100000,
        });

        assert.strictEqual(statusCode, 200, 'Unexpected HTTP status code received.');
    });

    it('should save a draft log with wrong totals', async function () {
        const payload = {
            date: (new Date()).toISOString().split('T')[0],
            items: [
                {
                    'food': 'Apple',
                    'quantity': 150,
                    'measure': 'GRAMS',
                    'unitCalories': 52,
                    'totalCalories': 70
                },
                {
                    'food': 'Rice',
                    'quantity': 200,
                    'measure': 'GRAMS',
                    'unitCalories': 365,
                    'totalCalories': 20
                },
                {
                    'food': 'Chicken Breast',
                    'quantity': 250,
                    'measure': 'GRAMS',
                    'unitCalories': 165,
                    'totalCalories': 412.5
                }
            ]
        };
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${BEARER}`
        };
        const {statusCode, body} = await helpWeb.post({
            hostname: HOST,
            path: '/app/api/calorie/log/draft/save/',
            payload,
            headers,
            timeout: 100000,
        });
        /** @type {Svelters_Shared_Web_Api_Calorie_Log_Save.Response} */
        const response = JSON.parse(body);

        assert.strictEqual(statusCode, 200, 'Unexpected HTTP status code received.');
        assert.strictEqual(response.code, RESULT.WRONG_TOTALS, 'Unexpected result code received.');
    });
});
