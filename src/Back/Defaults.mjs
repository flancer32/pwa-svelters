/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class Svelters_Back_Defaults {

    CLI_PREFIX = 'app';

    /** @type {Svelters_Shared_Defaults} */
    SHARED;

    constructor(spec) {
        this.SHARED = spec['Svelters_Shared_Defaults$'];
        Object.freeze(this);
    }
}
