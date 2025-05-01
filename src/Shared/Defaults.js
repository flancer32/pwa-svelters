/**
 * Plugin constants (hardcoded configuration) for shared code.
 */
export default class Svelters_Shared_Defaults {

    COOKIE_LOCALE = 'locale';

    LOCALE = 'en'; // default locale for the app
    LOCALE_AVAILABLE = ['en', 'ru'];

    // should be the same as the ` name ` property in `./package.json`
    NAME = '@flancer32/pwa-svelters';

    ROUTE_ACCOUNT = 'account';
    ROUTE_ACCOUNT_DELETE = 'delete';
    ROUTE_ACCOUNT_DASHBOARD = 'dashboard';
    ROUTE_API = 'api';
    ROUTE_DASHBOARD = 'dashboard';
    ROUTE_LOGIN = 'login';
    ROUTE_REGISTER = 'register';
    ROUTE_REGISTERED = 'registered';
    ROUTE_SUBSCRIBE = 'subscribe';

    SPACE = 'app';

    SUBSCRIPTION_PRICE_MONTH = 6;
    SUBSCRIPTION_PRICE_YEAR = 40;

    constructor() {
        Object.freeze(this);
    }
}
