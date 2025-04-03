import {strict as assert} from 'assert';
import {createLocalContainer, stopApp} from '../../../../common.mjs';

// SETUP CONTAINER
const container = await createLocalContainer();

// VARS
const HOST = process.env.HOST || 'localhost';
const STATE_CODE = 'stateCode';

// Get runtime environment
/** @type {Fl64_Paypal_Back_Api_Adapter} */
const adapter = await container.get('Fl64_Paypal_Back_Api_Adapter$');


describe('Svelters_Back_Di_Replace_Paypal_Adapter', function () {
    this.timeout(100000);

    before(async function () { });

    after(async function () {
        await stopApp();
    });

    it('should process the successful payment', async function () {
        const orderId = 24;
        const paypalResponse = {};
        await adapter.processSuccessfulPayment({orderId, paypalResponse});
        assert.ok(true, 'The function is done.');
    });


});
