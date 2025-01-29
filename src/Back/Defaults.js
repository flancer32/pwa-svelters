/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class Svelters_Back_Defaults {

    CLI_PREFIX = 'app';

    NAME;

    /**
     * @type {number}
     * @deprecated use Fl32_Auth_Back_Defaults.SESSION_COOKIE_LIFETIME
     */
    SESSION_COOKIE_LIFETIME = 31536000000;  // 3600 * 24 * 365 * 1000
    /**
     * @type {number}
     * @deprecated use Fl32_Auth_Back_Defaults.SESSION_COOKIE_NAME
     */
    SESSION_COOKIE_NAME = 'TEQ_SESSION_ID';

    /** @type {Svelters_Shared_Defaults} */
    SHARED;

    /**
     * @param {Svelters_Shared_Defaults} SHARED
     */
    constructor(
        {
            Svelters_Shared_Defaults$: SHARED
        }
    ) {
        this.SHARED = SHARED;
        this.NAME = SHARED.NAME;
        Object.freeze(this);
    }
}
