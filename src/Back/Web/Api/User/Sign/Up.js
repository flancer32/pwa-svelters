/**
 * Register new user in RDb and generate attest challenge (if requested).
 */
// MODULE'S IMPORTS
import {randomUUID} from 'node:crypto';

// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Svelters_Back_Web_Api_User_Sign_Up {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Core_Shared_Util_Codec.hexToBin|function} hexToBin
     * @param {Svelters_Shared_Web_Api_User_Sign_Up} endpoint
     * @param {TeqFw_Db_Back_RDb_IConnect} conn
     * @param {TeqFw_Db_Back_Api_RDb_CrudEngine} crud
     * @param {Svelters_Back_RDb_Schema_User} rdbUser
     * @param {Fl32_Auth_Back_Mod_Password} modPass
     * @param {Fl32_Auth_Back_Mod_PubKey} modPubKey
     * @param {Fl32_Auth_Back_Mod_Session} modSess
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            'TeqFw_Core_Shared_Util_Codec.hexToBin': hexToBin,
            Svelters_Shared_Web_Api_User_Sign_Up$: endpoint,
            TeqFw_Db_Back_RDb_IConnect$: conn,
            TeqFw_Db_Back_Api_RDb_CrudEngine$: crud,
            Svelters_Back_RDb_Schema_User$: rdbUser,
            Fl32_Auth_Back_Mod_Password$: modPass,
            Fl32_Auth_Back_Mod_PubKey$: modPubKey,
            Fl32_Auth_Back_Mod_Session$: modSess,
        }
    ) {

        // VARS
        logger.setNamespace(this.constructor.name);
        const A_USER = rdbUser.getAttributes();

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Svelters_Shared_Web_Api_User_Sign_Up.Request|Object} req
         * @param {Svelters_Shared_Web_Api_User_Sign_Up.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            // FUNCS

            async function addUser(trx, dateBirth, email, height, name, uuid) {
                const dto = rdbUser.createDto();
                dto.date_birth = dateBirth;
                dto.email = email;
                dto.height = height;
                dto.name = name;
                dto.uuid = uuid;
                const {[A_USER.BID]: bid} = await crud.create(trx, rdbUser, dto);
                return bid;
            }

            // MAIN
            const trx = await conn.startTransaction();
            try {
                // get and normalize input data
                const dateBirth = new Date(req.dateBirth);
                const email = req.email.trim().toLowerCase();
                const height = req.height;
                const name = req.name;
                const hash = hexToBin(req.passwordHash);
                const salt = hexToBin(req.passwordSalt);
                const usePubKey = req.usePubKey;
                // generate data
                const uuid = randomUUID();
                //
                const userBid = await addUser(trx, dateBirth, email, height, name, uuid);
                if (usePubKey) {
                    // generate attestation challenge for newly registered user
                    const {challenge} = await modPubKey.attestChallengeCreate({trx, userBid});
                    res.challenge = challenge;
                    res.userUuid = uuid;
                } else {
                    // there is no public key authenticator in a browser, just save password hash & salt
                    await modPass.create({trx, userBid, hash, salt});
                    // establish new session
                    const {sessionData} = await modSess.establish({
                        trx,
                        userBid,
                        request: context.request,
                        response: context.response
                    });
                    if (sessionData) {
                        // noinspection JSValidateTypes
                        res.sessionData = sessionData;
                    }
                }
                await trx.commit();
                res.uuid = uuid;
                logger.info(`${this.constructor.name}: ${JSON.stringify(res)}'.`);
            } catch (error) {
                logger.error(error);
                await trx.rollback();
            }
        };
    }

}
