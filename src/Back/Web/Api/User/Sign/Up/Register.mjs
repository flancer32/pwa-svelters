/**
 * Register new user in RDb and generate attest challenge (if requested).
 */
// MODULE'S IMPORTS
import {randomUUID} from 'node:crypto';
import {Buffer} from 'node:buffer';

// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Svelters_Back_Web_Api_User_Sign_Up_Register {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Core_Shared_Util_Codec.hexToBin|function} */
        const hexToBin = spec['TeqFw_Core_Shared_Util_Codec.hexToBin'];
        /** @type {Svelters_Shared_Web_Api_User_Sign_Up_Register} */
        const endpoint = spec['Svelters_Shared_Web_Api_User_Sign_Up_Register$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
        /** @type {Fl32_Auth_Back_RDb_Schema_Password} */
        const rdbPass = spec['Fl32_Auth_Back_RDb_Schema_Password$'];
        /** @type {Svelters_Back_RDb_Schema_User} */
        const rdbUser = spec['Svelters_Back_RDb_Schema_User$'];
        /** @type {Fl32_Auth_Back_Act_Attest_Challenge.act|function} */
        const actChallenge = spec['Fl32_Auth_Back_Act_Attest_Challenge$'];

        // VARS
        logger.setNamespace(this.constructor.name);
        const A_USER = rdbUser.getAttributes();

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Svelters_Shared_Web_Api_User_Sign_Up_Register.Request|Object} req
         * @param {Svelters_Shared_Web_Api_User_Sign_Up_Register.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            // FUNCS

            async function addUser(trx, age, email, height, name, uuid) {
                const dto = rdbUser.createDto();
                dto.age = age;
                dto.email = email;
                dto.height = height;
                dto.name = name;
                dto.uuid = uuid;
                const {[A_USER.BID]: bid} = await crud.create(trx, rdbUser, dto);
                return bid;
            }

            async function addPassword(trx, userBid, hash, salt) {
                const dto = rdbPass.createDto();
                dto.user_ref = userBid;
                dto.hash = Buffer.from(hash);
                dto.salt = Buffer.from(salt);
                await crud.create(trx, rdbPass, dto);
            }

            // MAIN
            const trx = await conn.startTransaction();
            try {
                // get and normalize input data
                const age = req.age;
                const email = req.email.trim().toLowerCase();
                const height = req.height;
                const name = req.name;
                const hash = hexToBin(req.passwordHash);
                const salt = hexToBin(req.passwordSalt);
                const useWebAuthn = req.useWebAuthn;
                // generate data
                const uuid = randomUUID();
                //
                const userBid = await addUser(trx, age, email, height, name, uuid);
                if (useWebAuthn) {
                    const {challenge} = await actChallenge({trx, userBid});
                    res.challenge = challenge;
                } else {
                    await addPassword(trx, userBid, hash, salt);
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
