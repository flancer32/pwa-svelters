/**
 * Plugin constants (hardcoded configuration) for shared code.
 */
export default class Svelters_Shared_Defaults {

    CFG_WEB_LOGS_AGG = 'logsAggregator';

    LOCALE = 'en'; // default locale for the app
    LOCALE_AVAILABLE = ['en', 'ru'];

    // should be the same as `name` property in `./package.json`
    NAME = '@flancer32/pwa-svelters';

    PASS_SALT_BYTES = 16;

    ROUTE_API = 'api';
    ROUTE_REGISTER = 'register';

    SPACE = 'app';

    constructor() {
        Object.freeze(this);
    }
}
