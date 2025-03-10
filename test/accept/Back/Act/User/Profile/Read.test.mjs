import assert from 'assert';
import {createContainer} from '@teqfw/test';
import {dbConnect, dbDisconnect, dbCreateFkEntities, dbReset, initConfig} from '../../../../common.mjs';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

/** @type {Svelters_Back_Act_User_Profile_Read} */
const actProfileRead = await container.get('Svelters_Back_Act_User_Profile_Read$');

/** @type {Svelters_Back_Store_RDb_Repo_User_Profile} */
const repoProfile = await container.get('Svelters_Back_Store_RDb_Repo_User_Profile$');
/** @type {typeof Svelters_Shared_Enum_Data_Type_Sex} */
const SEX = await container.get('Svelters_Shared_Enum_Data_Type_Sex.default');

// VARS
const DATE_BIRTH = '1973-01-01';
const GOAL = 'Goal';
const HEIGHT = 175;
const LOCALE = 'en';
const NAME = 'John Doe';
const TIMEZONE = 'Europe/Riga';
let USER_REF, USER_UUID;
/** @type {Date} */
let USER_SUBSCRIPT;

describe('Svelters_Back_Act_User_Profile_Read', () => {
    before(async () => {
        await dbReset(container);
        const {user} = await dbCreateFkEntities(container);
        USER_REF = user.id;
        USER_UUID = user.uuid;
        USER_SUBSCRIPT = user.date_subscription;
        await dbConnect(container);
    });

    after(async () => {
        await dbDisconnect(container);
    });

    it('should return null for a non-existent user', async () => {
        const {profile} = await actProfileRead.run({userId: -1});
        assert.strictEqual(profile, null, 'Profile should be null if not created');
    });

    it('should return user data for a non-existent profile', async () => {
        const {profile} = await actProfileRead.run({userId: USER_REF});
        assert.strictEqual(profile.uuid, USER_UUID, 'UUID should match user UUID');
        assert.strictEqual(profile.dateSubscriptionEnd.getTime(), USER_SUBSCRIPT.getTime(), 'Subscription date should match');
    });

    it('should create and read an existing profile', async () => {
        // Create profile
        const dto = repoProfile.createDto();
        dto.date_birth = DATE_BIRTH;
        dto.date_updated = new Date();
        dto.goal = GOAL;
        dto.height = HEIGHT;
        dto.locale = LOCALE;
        dto.name = NAME;
        dto.sex = SEX.MALE;
        dto.timezone = TIMEZONE;
        dto.user_ref = USER_REF;

        const savedProfile = await repoProfile.createOne({dto});
        assert(savedProfile, 'Profile should be created successfully');

        // Read profile
        const {profile} = await actProfileRead.run({userId: USER_REF});
        assert(profile, 'Profile should exist');
        assert.strictEqual(profile.dateBirth, DATE_BIRTH, 'Birthdate should match');
        assert.strictEqual(profile.dateSubscriptionEnd.getTime(), USER_SUBSCRIPT.getTime(), 'Subscription date should match');
        assert.strictEqual(profile.goal, GOAL, 'Goal should match');
        assert.strictEqual(profile.height, HEIGHT, 'Height should match');
        assert.strictEqual(profile.locale, LOCALE, 'Locale should match');
        assert.strictEqual(profile.name, NAME, 'Name should match');
        assert.strictEqual(profile.sex, SEX.MALE, 'Sex should match');
        assert.strictEqual(profile.timezone, TIMEZONE, 'Timezone should match');
        assert.strictEqual(profile.uuid, USER_UUID, 'UUID should match user UUID');
    });
});
