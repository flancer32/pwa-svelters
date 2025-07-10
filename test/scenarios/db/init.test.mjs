import {createLocalContainer, dbReset, stopApp} from '../common.mjs';
import {strict as assert} from 'assert';
import {describe, it, after} from 'node:test';

// SETUP CONTAINER
const container = await createLocalContainer();

// TESTS
describe('db/init', {timeout: 4000}, function () {

    after(async function () {
        await stopApp();
        process.exit(0);
    });

    it('should re-create the DB', async function () {
        try {
            await dbReset(container);
            assert.ok(true);
        } catch (err) {
            assert.ok(false);
        }
    });

});
