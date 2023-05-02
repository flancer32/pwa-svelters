/**
 * Model to store attestation data on the front.
 * @namespace Svelters_Front_Mod_User_Attestation
 * TODO: move it to WebAuthn plugin
 */
// MODULE'S VARS
const NS = 'Svelters_Front_Mod_User_Attestation';

// MODULE'S CLASSES
/**
 * @memberOf Svelters_Front_Mod_User_Attestation
 */
export class Dto {
    static namespace = NS;
    /** @type {string} */
    attestationId;
}

/**
 * @memberOf Svelters_Front_Mod_User_Attestation
 */
export class Store {
    constructor(spec) {
        // DEPS
        /** @type {Svelters_Front_Defaults} */
        const DEF = spec['Svelters_Front_Defaults$'];

        // VARS
        const STORE_KEY = `${DEF.SHARED.NAME}/user/attestation`;

        // INSTANCE METHODS
        /**
         * Load attestation data from the store.
         * @returns {Svelters_Front_Mod_User_Attestation.Dto}
         */
        this.read = function () {
            const stored = self.window.localStorage.getItem(STORE_KEY);
            const res = new Dto();
            return stored ? Object.assign(res, JSON.parse(stored)) : res;
        };

        /**
         * Save attestation data to the store.
         * @param {Svelters_Front_Mod_User_Attestation.Dto} data
         * @returns {string}
         */
        this.write = function (data) {
            window.localStorage.setItem(STORE_KEY, JSON.stringify(data));
        };

    }
}
