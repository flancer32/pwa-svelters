import {createLocalContainer, stopApp} from '../common.mjs';

// SETUP CONTAINER
const container = await createLocalContainer();

// VARS
const HOST = 'svelters.dev.wiredgeese.com';

// Get runtime environment
/** @type {Svelters_Back_Helper_Web} */
const helpWeb = await container.get('Svelters_Back_Helper_Web$');
/** @type {AppTest_Mod_User} */
const modUser = await container.get('AppTest_Mod_User$');

try {
    const sessUuid = await modUser.getSessionUuid();

    const payload = {
        date: (new Date()).toISOString().split('T')[0],
        items: [
            {product: 'Apple', quantity: 150, measure: 'GRAMS', unitCalories: 52},
            {product: 'Rice', quantity: 200, measure: 'GRAMS', unitCalories: 365},
            {product: 'Chicken Breast', quantity: 250, measure: 'GRAMS', unitCalories: 165}
        ]
    };
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessUuid}`
    };
    const content = await helpWeb.post({
        hostname: HOST,
        path: '/app/api/calorie/log/draft/save/',
        payload,
        headers,
        timeout: 100000,
    });
    debugger
} finally {
    await stopApp();
}

