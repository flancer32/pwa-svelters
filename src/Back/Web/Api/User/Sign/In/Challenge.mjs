/**
 * Generate new challenge to validate user with WebAuthn API.
 */
// MODULE'S IMPORTS

// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Svelters_Back_Web_Api_User_Sign_In_Challenge {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Svelters_Shared_Web_Api_User_Sign_In_Challenge} */
        const endpoint = spec['Svelters_Shared_Web_Api_User_Sign_In_Challenge$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
        /** @type {Svelters_Back_RDb_Schema_User_Auth_Chlng_Sign} */
        const rdbChlng = spec['Svelters_Back_RDb_Schema_User_Auth_Chlng_Sign$'];
        /** @type {Svelters_Back_RDb_Schema_User_Id_Email} */
        const rdbIdEmail = spec['Svelters_Back_RDb_Schema_User_Id_Email$'];
        /** @type {Svelters_Back_RDb_Schema_User} */
        const rdbUser = spec['Svelters_Back_RDb_Schema_User$'];
        /** @type {Svelters_Back_RDb_Schema_User_Auth_Attest} */
        const rdbPk = spec['Svelters_Back_RDb_Schema_User_Auth_Attest$'];
        /** @type {Svelters_Back_Util_WebAuthn.createChallenge|function} */
        const createChallenge = spec['Svelters_Back_Util_WebAuthn.createChallenge'];

        // VARS
        logger.setNamespace(this.constructor.name);
        const A_ID_EMAIL = rdbIdEmail.getAttributes();
        const A_PK = rdbPk.getAttributes();

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Svelters_Shared_Web_Api_User_Sign_In_Challenge.Request|Object} req
         * @param {Svelters_Shared_Web_Api_User_Sign_In_Challenge.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            const trx = await conn.startTransaction();
            try {
                // get and normalize input data
                const attestationId = req.attestationId;
                //
                /** @type {Svelters_Back_RDb_Schema_User_Auth_Attest.Dto} */
                const found = await crud.readOne(trx, rdbPk, {[A_PK.ATTESTATION_ID]: attestationId});
                if (found) {
                    const userBid = found.user_ref;
                    /** @type {Svelters_Back_RDb_Schema_User.Dto} */
                    const user = await crud.readOne(trx, rdbUser, userBid);
                    /** @type {Svelters_Back_RDb_Schema_User_Id_Email.Dto} */
                    const email = await crud.readOne(trx, rdbIdEmail, {[A_ID_EMAIL.USER_REF]: userBid});
                    // generate challenge and save it to RDb
                    const challenge = createChallenge();
                    const dtoChlng = rdbChlng.createDto();
                    dtoChlng.attest_ref = found.bid;
                    dtoChlng.challenge = challenge;
                    await crud.create(trx, rdbChlng, dtoChlng);
                    // compose response
                    res.attestationId = attestationId;
                    res.challenge = challenge;
                    res.rpName = 'Svelters PWA';
                    res.userName = email.email;
                    res.userUuid = user.uuid;
                }
                await trx.commit();
                logger.info(`${this.constructor.name}: ${JSON.stringify(res)}'.`);
            } catch (error) {
                logger.error(error);
                await trx.rollback();
            }
        };
    }


}