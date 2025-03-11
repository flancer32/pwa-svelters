/**
 * Plugin constants (hardcoded configuration) for shared code.
 */
export default class Svelters_Shared_Defaults {
    LOCALE = 'en'; // default locale for the app
    LOCALE_AVAILABLE = ['en', 'ru'];

    // should be the same as `name` property in `./package.json`
    NAME = '@flancer32/pwa-svelters';

    ROUTE_API = 'api';
    ROUTE_DASHBOARD = 'dashboard';
    ROUTE_LOGIN = 'login';
    ROUTE_REGISTER = 'register';
    ROUTE_SUBSCRIBE = 'subscribe';

    SPACE = 'app';

    constructor() {
        Object.freeze(this);
    }
}
