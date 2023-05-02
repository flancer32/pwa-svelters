/**
 * Verify attestation data and save public key to RDB.
 *
 * @namespace Svelters_Back_Act_WebAuthn_Attest
 */
// MODULE'S VARS
const NS = 'Svelters_Back_Act_WebAuthn_Attest';

// MODULE'S FUNCTIONS
export default function (spec) {
    // DEPS
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$']; // instance
    /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
    const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
    /** @type {Svelters_Back_RDb_Schema_User_Auth_Chlng_Attest} */
    const rdbChallenge = spec['Svelters_Back_RDb_Schema_User_Auth_Chlng_Attest$'];
    /** @type {Svelters_Back_Util_WebAuthn.createChallenge|function} */
    const createChallenge = spec['Svelters_Back_Util_WebAuthn.createChallenge'];

    // VARS
    logger.setNamespace(NS);

    // FUNCS
    /**
     * Generate a challenge to authenticate a new user and save the challenge in the database.
     * Return a base64 URL-encoded challenge.

     * @param {TeqFw_Db_Back_RDb_ITrans} trx
     * @param {number} userBid
     * @return {Promise<{challenge: string}>}
     * @memberOf Svelters_Back_Act_WebAuthn_Attest
     */
    async function act({trx, userBid}) {
        const challenge = createChallenge();
        const dto = rdbChallenge.createDto();
        dto.challenge = challenge;
        dto.user_ref = userBid;
        await crud.create(trx, rdbChallenge, dto);
        logger.info(`New attest challenge '${challenge}' is created for user #${userBid}.`);
        return {challenge};
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}