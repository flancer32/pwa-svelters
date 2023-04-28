/**
 * Use invitation to register new device for a user.
 * This invitation should be verified and attestation challenge should be got from the back.
 */
// MODULE'S CLASSES

/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Svelters_Back_Web_Api_User_Device_Invite_Use {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Svelters_Shared_Web_Api_User_Device_Invite_Use} */
        const endpoint = spec['Svelters_Shared_Web_Api_User_Device_Invite_Use$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
        /** @type {Svelters_Back_RDb_Schema_User_Id_Email} */
        const rdbIdEmail = spec['Svelters_Back_RDb_Schema_User_Id_Email$'];
        /** @type {Svelters_Back_RDb_Schema_User} */
        const rdbUser = spec['Svelters_Back_RDb_Schema_User$'];
        /** @type {Svelters_Back_RDb_Schema_User_Device_Invite} */
        const rdbInvite = spec['Svelters_Back_RDb_Schema_User_Device_Invite$'];
        /** @type {Svelters_Back_RDb_Schema_User_Auth_Chlng_Attest} */
        const rdbChlng = spec['Svelters_Back_RDb_Schema_User_Auth_Chlng_Attest$'];
        /** @type {Svelters_Back_Util_WebAuthn.createChallenge|function} */
        const createChallenge = spec['Svelters_Back_Util_WebAuthn.createChallenge'];

        // VARS
        logger.setNamespace(this.constructor.name);
        const A_ID_EMAIL = rdbIdEmail.getAttributes();

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Svelters_Shared_Web_Api_User_Device_Invite_Use.Request|Object} req
         * @param {Svelters_Shared_Web_Api_User_Device_Invite_Use.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            const trx = await conn.startTransaction();
            try {
                // get and normalize input data
                const code = req.code.trim().toLowerCase();
                //
                /** @type {Svelters_Back_RDb_Schema_User_Device_Invite.Dto} */
                const invite = await crud.readOne(trx, rdbInvite, code);
                if (invite) {
                    // get user data for attestation request
                    const userBid = invite.user_ref;
                    /** @type {Svelters_Back_RDb_Schema_User.Dto} */
                    const user = await crud.readOne(trx, rdbUser, userBid);
                    /** @type {Svelters_Back_RDb_Schema_User_Id_Email.Dto} */
                    const email = await crud.readOne(trx, rdbIdEmail, {[A_ID_EMAIL.USER_REF]: userBid});
                    const challenge = createChallenge();
                    // save challenge to RDb
                    const dtoChlng = rdbChlng.createDto();
                    dtoChlng.challenge = challenge;
                    dtoChlng.user_ref = userBid;
                    await crud.create(trx, rdbChlng, dtoChlng);
                    // compose response
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
