/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class Svelters_Back_Defaults {

    CLI_PREFIX = 'app';

    /** @type {TeqFw_Core_Back_Defaults} */
    MOD_CORE;

    NAME;

    ROUTE_OPENAPI = 'openapi.json';

    /** @type {Svelters_Shared_Defaults} */
    SHARED;

    SUBSCRIPTION_CURRENCY = 'USD';
    SUBSCRIPTION_DAYS_DEFAULT = 7; // Default subscription period (7 days from the current date)
    SUBSCRIPTION_MONTHS_PROMO = 3; // Subscription period for promotion (3 months from the current date)
    SUBSCRIPTION_MONTHS_RENEW = 1; // Subscription period for renewal
    SUBSCRIPTION_USERS_MAX = 100; // Total number of users to get promo

    URI_401 = '/401.html';
    URI_403 = '/403.html';

    /**
     * @param {TeqFw_Core_Back_Defaults} MOD_CORE
     * @param {Svelters_Shared_Defaults} SHARED
     */
    constructor(
        {
            TeqFw_Core_Back_Defaults$: MOD_CORE,
            Svelters_Shared_Defaults$: SHARED
        }
    ) {
        this.MOD_CORE = MOD_CORE;
        this.SHARED = SHARED;

        this.NAME = SHARED.NAME;
        Object.freeze(this);
    }
}
