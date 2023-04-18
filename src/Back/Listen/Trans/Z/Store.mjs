/**
 * Store to save intermediate data between challenge generation and attestation verification.
 */
export default class Svelters_Back_Listen_Trans_Z_Store {
    constructor(spec) {
        // DEPS
        /** @type {Svelters_Back_Defaults} */
        const DEF = spec['Svelters_Back_Defaults$'];

        // VARS
        const _byChallenge = {};
        const _store = {};

        // INSTANCE METHODS
        /**
         * @param {string} userName
         * @returns {Svelters_Back_Listen_Trans_Z_Dto.Dto}
         */
        this.get = function (userName) {
            return _store[userName];
        }

        /**
         * @param {string} challenge
         * @returns {Svelters_Back_Listen_Trans_Z_Dto.Dto}
         */
        this.getByChallenge = function (challenge) {
            const userName = _byChallenge[challenge];
            return _store[userName];
        }

        /**
         * @param {Svelters_Back_Listen_Trans_Z_Dto.Dto} dto
         */
        this.put = function (dto) {
            _store[dto.userName] = dto;
            _byChallenge[dto.challenge] = dto.userName;
        }

    }
}
