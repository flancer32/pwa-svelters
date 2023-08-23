/**
 * Plugin constants (hardcoded configuration) for frontend code.
 */
export default class Svelters_Front_Defaults {
    AUTH_REDIRECT = 'redirect';

    COLOR_Q_PRIMARY = 'primary';

    ROUTE_AUTH_IN = '/auth/in';
    ROUTE_AUTH_OUT = '/auth/out';
    ROUTE_AUTH_RESET = '/auth/password/reset';
    ROUTE_AUTH_UP = '/auth/up';
    ROUTE_CFG = '/cfg';
    ROUTE_FRIEND = '/friend';
    ROUTE_GROUP = '/group';
    ROUTE_HOME = '/';
    ROUTE_MY = '/my';
    ROUTE_NOT_FOUND = '/:pathMatch(.*)*';

    RP_NAME = 'Svelters 2';

    /** @type {Svelters_Shared_Defaults} */
    SHARED;

    TIMEOUT_REDIRECT = 1500; // 1.5 sec to redirect to other route
    TIMEOUT_RESPONSE = 12000;

    /**
     * @param {Svelters_Shared_Defaults} SHARED
     */
    constructor(
        {
            Svelters_Shared_Defaults$: SHARED,
        }
    ) {
        this.SHARED = SHARED;
        Object.freeze(this);
    }
}
