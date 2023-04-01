/**
 * Plugin constants (hardcoded configuration) for frontend code.
 */
export default class Svelters_Front_Defaults {

    ROUTE_HOME = '/';

    /** @type {Svelters_Shared_Defaults} */
    SHARED;

    constructor(spec) {
        this.SHARED = spec['Svelters_Shared_Defaults$'];
        Object.freeze(this);
    }
}
