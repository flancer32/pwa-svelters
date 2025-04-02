import assert from 'assert';
import {createContainer} from '@teqfw/test';
import {dbConnect, dbCreateFkEntities, dbDisconnect, dbReset, initConfig} from '../../../../../common.mjs';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

// SETUP ENVIRONMENT
/** @type {Svelters_Back_Store_RDb_Repo_Feedback_Inbox} */
const repoFeedback = await container.get('Svelters_Back_Store_RDb_Repo_Feedback_Inbox$');
const ATTR = repoFeedback.getSchema().getAttributes();

// TEST CONSTANTS
const DATE_CREATED = new Date();
const LANG = 'ru';
const MSG_EN = 'Test Message';
const MSG_RU = 'Тестовое сообщение';
const SUBJECT = 'Test Subject';
let FEEDBACK_ID, USER_REF;

// Test Suite for Feedback Inbox Repository
describe('Svelters_Back_Store_RDb_Repo_Feedback_Inbox', () => {
    before(async () => {
        await dbReset(container);
        const {user} = await dbCreateFkEntities(container);
        USER_REF = user.id;
        await dbConnect(container);
    });

    after(async () => {
        await dbDisconnect(container);
    });

    it('should create a new feedback entry', async () => {
        /** @type {Svelters_Back_Store_RDb_Schema_Feedback_Inbox.Dto} */
        const dto = repoFeedback.createDto();
        dto.date_created = DATE_CREATED;
        dto.lang = LANG;
        dto.subject = SUBJECT;
        dto.text_en = MSG_EN;
        dto.text_origin = MSG_RU;
        dto.user_ref = USER_REF;

        const {primaryKey} = await repoFeedback.createOne({dto});
        FEEDBACK_ID = primaryKey[ATTR.ID];
        assert.ok(primaryKey, 'Feedback should be created');
    });

    it('should read an existing feedback by ID', async () => {
        const {record} = await repoFeedback.readOne({key: {id: FEEDBACK_ID}});

        assert.ok(record, 'Feedback should exist');
        assert.strictEqual(record.id, FEEDBACK_ID, 'Feedback ID should match');
    });

    it('should list all feedbacks', async () => {
        const feedbacks = await repoFeedback.readMany({});

        assert.ok(feedbacks.records.length > 0, 'There should be at least one feedback');
    });

    it('should update an existing feedback', async () => {
        const {record} = await repoFeedback.readOne({key: {id: FEEDBACK_ID}});
        record.subject = 'Updated Subject';

        const {updatedCount} = await repoFeedback.updateOne({
            key: {id: FEEDBACK_ID},
            updates: {subject: 'Updated Subject'}
        });

        assert.strictEqual(updatedCount, 1, 'One feedback should be updated');
        const {record: updated} = await repoFeedback.readOne({key: {id: FEEDBACK_ID}});
        assert.strictEqual(updated.subject, 'Updated Subject', 'Feedback subject should be updated');
    });

    it('should delete an existing feedback', async () => {
        const {deletedCount} = await repoFeedback.deleteOne({key: {id: FEEDBACK_ID}});

        assert.strictEqual(deletedCount, 1, 'One feedback should be deleted');
    });
});