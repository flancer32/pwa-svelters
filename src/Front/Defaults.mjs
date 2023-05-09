/**
 * Plugin constants (hardcoded configuration) for frontend code.
 */
export default class Svelters_Front_Defaults {
    AUTH_REDIRECT = 'redirect';

    COLOR_Q_PRIMARY = 'primary';

    ROUTE_HOME = '/';
    ROUTE_USER_SIGN_IN = '/user/sign/in';
    ROUTE_USER_SIGN_OUT = '/user/sign/out';
    ROUTE_USER_SIGN_UP = '/user/sign/up';

    /** @type {Svelters_Shared_Defaults} */
    SHARED;

    TIMEOUT_RESPONSE = 12000;

    constructor(spec) {
        this.SHARED = spec['Svelters_Shared_Defaults$'];
        Object.freeze(this);
    }
}
