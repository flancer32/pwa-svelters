/**
 * Plugin constants (hardcoded configuration) for shared code.
 */
export default class Svelters_Shared_Defaults {
    // should be the same as `name` property in `./package.json`
    NAME = '@flancer32/pwa-svelters';

    LOGS_AGG = 'logsAggregator';

    PASS_SALT_BYTES = 16;

    constructor() {
        Object.freeze(this);
    }
}
