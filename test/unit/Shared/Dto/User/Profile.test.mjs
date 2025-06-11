import {describe, it} from 'node:test';
import assert from 'node:assert';
import {container} from '@teqfw/test';

// GET OBJECTS FROM CONTAINER
/** @type {Svelters_Shared_Dto_User_Profile} */
const factory = await container.get('Svelters_Shared_Dto_User_Profile$');

describe('Svelters_Shared_Dto_User_Profile', () => {
    const expectedProperties = [
        'dateBirth',
        'dateCreated',
        'dateSubscriptionEnd',
        'dateUpdated',
        'email',
        'goal',
        'height',
        'lastCaloriesDate',
        'lastCaloriesLog',
        'lastCaloriesTotal',
        'locale',
        'measureSystem',
        'name',
        'promptStart',
        'sex',
        'timezone',
        'uuid',
        'weight',
        'weightGoal',
    ];


    it('should create DTO with only expected properties', () => {
        const dto = factory.create({});
        const dtoKeys = Object.keys(dto).sort();

        assert.deepStrictEqual(
            dtoKeys,
            expectedProperties.sort(),
            'DTO should contain only the expected properties'
        );

        expectedProperties.forEach((prop) => {
            assert.strictEqual(
                dto[prop],
                undefined,
                `Property "${prop}" should initially be undefined`
            );
        });
    });
});
