import {strict as assert} from 'assert';
import {createLocalContainer, stopApp} from '../../../../common.mjs';
import {after, describe, it} from 'mocha';

// SETUP CONTAINER
const container = await createLocalContainer();

// Get an action instance
/** @type {Svelters_Back_Act_Calorie_Log_GetLast} */
const action = await container.get('Svelters_Back_Act_Calorie_Log_GetLast$');

// Provide test userRef (replace with a real UUID if needed)
const USER_REF = 6;

describe('Svelters_Back_Act_Calorie_Log_GetLast', function () {
    this.timeout(10000);

    after(async function () {
        await stopApp();
    });

    it('should return the latest calorie log or null', async function () {
        const result = await action.run({userRef: USER_REF});
        assert.ok(
            result === null ||
            (
                typeof result === 'object' &&
                typeof result.log === 'object'
            ),
            'The action must return null or a valid result object'
        );
    });
});
