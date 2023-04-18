/**
 * Plugin constants (hardcoded configuration) for frontend code.
 */
export default class Svelters_Front_Defaults {
    COLOR_Q_PRIMARY = 'primary';

    ROUTE_HOME = '/';

    /** @type {Svelters_Shared_Defaults} */
    SHARED;

    TIMEOUT_RESPONSE = 12000;

    constructor(spec) {
        this.SHARED = spec['Svelters_Shared_Defaults$'];
        Object.freeze(this);
    }
}
