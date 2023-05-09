/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class Svelters_Back_Defaults {

    CLI_PREFIX = 'app';

    SESSION_COOKIE_LIFETIME = 31536000000;  // 3600 * 24 * 365 * 1000
    SESSION_COOKIE_NAME = 'TEQ_SESSION_ID';

    /** @type {Svelters_Shared_Defaults} */
    SHARED;

    constructor(spec) {
        this.SHARED = spec['Svelters_Shared_Defaults$'];
        Object.freeze(this);
    }
}
