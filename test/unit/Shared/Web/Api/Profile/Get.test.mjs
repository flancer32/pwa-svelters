import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECTS FROM CONTAINER
/** @type {Svelters_Shared_Web_Api_Profile_Get} */
const endpoint = await container.get('Svelters_Shared_Web_Api_Profile_Get$');

describe('Svelters_Shared_Web_Api_Profile_Get', () => {

    it('RESULT should contain only the expected codes', () => {
        const expKeys = [
            'SUCCESS',
            'UNKNOWN',
        ];
        const RESULT = endpoint.getResultCodes();
        const actualKeys = Object.keys(RESULT).sort();
        assert.deepStrictEqual(actualKeys, expKeys, 'RESULT should contain only the expected codes');
        expKeys.forEach(code => {
            assert.strictEqual(RESULT[code], code, `RESULT.${code} should map to ${code}`);
        });
    });

    it('Request DTO should contain only the expected properties', () => {
        const expProps = [];
        const dto = endpoint.createReq();
        const actualKeys = Object.keys(dto).sort();
        assert.deepStrictEqual(actualKeys, expProps, 'Request DTO should contain only the expected properties');
    });

    it('Response DTO should contain only the expected properties', () => {
        const expProps = [
            'meta',
            'profile',
        ];
        const dto = endpoint.createRes();
        const actualKeys = Object.keys(dto).sort();
        assert.deepStrictEqual(actualKeys, expProps, 'Response DTO should contain only the expected properties');
    });

});
