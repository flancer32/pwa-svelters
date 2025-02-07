/**
 * Plugin constants (hardcoded configuration) for shared code.
 */
export default class Svelters_Shared_Defaults {

    CFG_WEB_LOGS_AGG = 'logsAggregator';

    LOCALE = 'en';

    // should be the same as `name` property in `./package.json`
    NAME = '@flancer32/pwa-svelters';

    PASS_SALT_BYTES = 16;

    constructor() {
        Object.freeze(this);
    }
}
