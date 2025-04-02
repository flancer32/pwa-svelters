/**
 * Persistent DTO with metadata for the RDB entity: Feedback Inbox.
 * @namespace Svelters_Back_Store_RDb_Schema_Feedback_Inbox
 */

// MODULE'S VARS

/**
 * Path to the entity in the plugin's DEM.
 *
 * @type {string}
 */
const ENTITY = '/app/feedback/inbox';

/**
 * Attribute mappings for the entity.
 * @memberOf Svelters_Back_Store_RDb_Schema_Feedback_Inbox
 */
const ATTR = {
    DATE_CREATED: 'date_created',
    DATE_RESOLVED: 'date_resolved',
    ID: 'id',
    IS_RESOLVED: 'is_resolved',
    LANG: 'lang',
    META: 'meta',
    RESOLVED_BY: 'resolved_by',
    SUBJECT: 'subject',
    TEXT_EN: 'text_en',
    TEXT_ORIGIN: 'text_origin',
    USER_REF: 'user_ref',
};
Object.freeze(ATTR);

// MODULE'S CLASSES

/**
 * DTO class representing the persistent structure of the Feedback Inbox entity.
 * @memberOf Svelters_Back_Store_RDb_Schema_Feedback_Inbox
 */
class Dto {
    /**
     * Timestamp when feedback was created.
     *
     * @type {Date}
     */
    date_created;

    /**
     * Timestamp when feedback was resolved.
     *
     * @type {Date|null}
     */
    date_resolved;

    /**
     * Auto-incremented primary key.
     *
     * @type {number}
     */
    id;

    /**
     * Resolution status flag.
     *
     * @type {boolean}
     */
    is_resolved;

    /**
     * Original language code.
     *
     * @type {string}
     */
    lang;

    /**
     * Additional metadata in JSON format.
     *
     * @type {Object|null}
     */
    meta;

    /**
     * ID of user who resolved the feedback.
     *
     * @type {number|null}
     */
    resolved_by;

    /**
     * Short summary for UI/email display.
     *
     * @type {string}
     */
    subject;

    /**
     * Translated text (or original if English).
     *
     * @type {string}
     */
    text_en;

    /**
     * Original feedback text in user's language.
     *
     * @type {string|null}
     */
    text_origin;

    /**
     * Reference to the user.
     *
     * @type {number}
     */
    user_ref;
}

/**
 * Implements metadata and utility methods for the Feedback Inbox entity.
 * @implements TeqFw_Db_Back_Api_RDb_Schema_Object
 */
export default class Svelters_Back_Store_RDb_Schema_Feedback_Inbox {
    /**
     * Constructor for the Feedback Inbox persistent DTO class.
     *
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     */
    constructor(
        {
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Util_Cast$: cast
        }
    ) {
        // INSTANCE METHODS

        /**
         * @param {Svelters_Back_Store_RDb_Schema_Feedback_Inbox.Dto|Object} [data]
         * @returns {Svelters_Back_Store_RDb_Schema_Feedback_Inbox.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            if (data) {
                res.date_created = cast.date(data.date_created);
                res.date_resolved = data.date_resolved ? cast.date(data.date_resolved) : null;
                res.id = cast.int(data.id);
                res.is_resolved = cast.boolean(data.is_resolved);
                res.lang = cast.string(data.lang);
                res.meta = data.meta ? cast.object(data.meta) : null;
                res.resolved_by = data.resolved_by ? cast.int(data.resolved_by) : null;
                res.subject = cast.string(data.subject);
                res.text_en = cast.string(data.text_en);
                res.text_origin = data.text_origin ? cast.string(data.text_origin) : null;
                res.user_ref = cast.int(data.user_ref);
            }
            return res;
        };

        // noinspection JSCheckFunctionSignatures
        /**
         * Returns the attribute map for the entity.
         *
         * @returns {typeof Svelters_Back_Store_RDb_Schema_Feedback_Inbox.ATTR}
         */
        this.getAttributes = () => ATTR;

        /**
         * Returns the entity's path in the DEM.
         *
         * @returns {string}
         */
        this.getEntityName = () => `${DEF.NAME}${ENTITY}`;

        /**
         * Returns the primary key attributes for the entity.
         *
         * @returns {Array<string>}
         */
        this.getPrimaryKey = () => [ATTR.ID];
    }
}