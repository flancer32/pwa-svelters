import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECTS FROM CONTAINER
/** @type {Svelters_Shared_Web_Api_Calorie_Log_Save} */
const endpoint = await container.get('Svelters_Shared_Web_Api_Calorie_Log_Save$');

describe('Svelters_Shared_Web_Api_Calorie_Log_Save', () => {

    it('RESULT should contain only the expected codes', () => {
        const expKeys = [
            'SUBSCRIPTION_EXPIRED',
            'SUCCESS',
            'UNKNOWN',
            'WRONG_TOTALS',
        ];
        const RESULT = endpoint.getResultCodes();
        const actualKeys = Object.keys(RESULT).sort();
        assert.deepStrictEqual(actualKeys, expKeys, 'RESULT should contain only the expected codes');
        expKeys.forEach(code => {
            assert.strictEqual(RESULT[code], code, `RESULT.${code} should map to ${code}`);
        });
    });

    it('Request DTO should contain only the expected properties', () => {
        const expProps = [
            'date',
            'items',
        ];
        const dto = endpoint.createReq();
        const actualKeys = Object.keys(dto).sort();
        assert.deepStrictEqual(actualKeys, expProps, 'Request DTO should contain only the expected properties');
    });

    it('Response DTO should contain only the expected properties', () => {
        const expProps = [
            'meta',
        ];
        const dto = endpoint.createRes();
        const actualKeys = Object.keys(dto).sort();
        assert.deepStrictEqual(actualKeys, expProps, 'Response DTO should contain only the expected properties');
    });

});
