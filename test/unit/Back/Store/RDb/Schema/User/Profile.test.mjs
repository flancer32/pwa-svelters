import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECTS FROM CONTAINER
/** @type {Svelters_Back_Defaults} */
const DEF = await container.get('Svelters_Back_Defaults$');
/** @type {Svelters_Back_Store_RDb_Schema_User_Profile} */
const schema = await container.get('Svelters_Back_Store_RDb_Schema_User_Profile$');
/** @type {typeof Svelters_Shared_Enum_Data_Measure_System} */
const MEASURE_SYSTEM = await container.get('Svelters_Shared_Enum_Data_Measure_System$');

describe('Svelters_Back_Store_RDb_Schema_User_Profile', () => {
    const ATTR = schema.getAttributes();
    const expectedProperties = [
        'date_birth',
        'date_updated',
        'goal',
        'height',
        'locale',
        'measure_system',
        'name',
        'prompt_start',
        'sex',
        'timezone',
        'user_ref',
    ];

    it('should create an RDB DTO with only the expected properties', () => {
        const dto = schema.createDto();
        const dtoKeys = Object.keys(dto).sort();

        // Verify that the DTO has only the expected properties
        assert.deepStrictEqual(dtoKeys, expectedProperties.sort(), 'DTO should contain only the expected properties');

        // Check that each property is initially undefined
        expectedProperties.forEach(prop => {
            assert.strictEqual(dto[prop], undefined, `Property ${prop} should initially be undefined`);
        });
    });

    it('ATTR should contain only the expected properties', () => {
        const attrKeys = Object.keys(ATTR).sort();
        const upperCaseExpectedProperties = expectedProperties.map(p => p.toUpperCase()).sort();

        // Check that ATTR has the expected properties in uppercase
        assert.deepStrictEqual(attrKeys, upperCaseExpectedProperties, 'ATTR should contain only the expected properties in uppercase format');

        // Verify that each uppercase property in ATTR maps correctly to its original property name
        expectedProperties.forEach(prop => {
            assert.strictEqual(ATTR[prop.toUpperCase()], prop, `ATTR.${prop.toUpperCase()} should map to ${prop}`);
        });
    });

    it('should have the correct ENTITY name and primary key', () => {
        assert.equal(schema.getEntityName(), `${DEF.NAME}/app/user/profile`, 'Entity name should match the expected path');
        assert.deepStrictEqual(schema.getPrimaryKey(), [ATTR.USER_REF], 'Primary key should be set to USER_REF');
    });

    describe('measure_system field validation', () => {
        it('should correctly implement measure_system field in the schema', () => {
            // Check field exists in DTO
            const dto = schema.createDto();
            assert('measure_system' in dto, 'measure_system should exist in DTO');

            // Check enum values are accepted
            const metricDto = schema.createDto({measure_system: MEASURE_SYSTEM.METRIC});
            assert.strictEqual(metricDto.measure_system, MEASURE_SYSTEM.METRIC, 'Should accept METRIC value');

            const imperialDto = schema.createDto({measure_system: MEASURE_SYSTEM.IMPERIAL});
            assert.strictEqual(imperialDto.measure_system, MEASURE_SYSTEM.IMPERIAL, 'Should accept IMPERIAL value');

            // Check invalid value is silently ignored (remains undefined)
            const invalidDto = schema.createDto({measure_system: 'INVALID'});
            assert.strictEqual(invalidDto.measure_system, undefined, 'Invalid value should result in undefined measure_system');
        });
    });
});