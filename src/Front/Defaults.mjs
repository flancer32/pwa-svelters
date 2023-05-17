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

    RP_NAME = 'Svelters 2';

    /** @type {Svelters_Shared_Defaults} */
    SHARED;

    TIMEOUT_REDIRECT = 1500; // 1.5 sec to redirect to other route
    TIMEOUT_RESPONSE = 12000;

    constructor(spec) {
        this.SHARED = spec['Svelters_Shared_Defaults$'];
        Object.freeze(this);
    }
}
