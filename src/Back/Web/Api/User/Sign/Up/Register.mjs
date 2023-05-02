/**
 * Generate sign up challenge before new user registration.
 */
// MODULE'S IMPORTS
import {randomUUID} from 'node:crypto';

// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Svelters_Back_Web_Api_User_Sign_Up_Register {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Svelters_Shared_Web_Api_User_Sign_Up_Register} */
        const endpoint = spec['Svelters_Shared_Web_Api_User_Sign_Up_Register$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
        /** @type {Svelters_Back_RDb_Schema_User} */
        const rdbUser = spec['Svelters_Back_RDb_Schema_User$'];
        /** @type {Svelters_Back_Act_WebAuthn_Challenge_Attest.act|function} */
        const actChallenge = spec['Svelters_Back_Act_WebAuthn_Challenge_Attest$'];

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

            // MAIN
            const trx = await conn.startTransaction();
            try {
                // get and normalize input data
                const age = req.age;
                const email = req.email.trim().toLowerCase();
                const height = req.height;
                const name = req.name;
                const useWebAuthn = req.useWebAuthn;
                // generate data
                const uuid = randomUUID();
                //
                const userBid = await addUser(trx, age, email, height, name, uuid);
                if (useWebAuthn) {
                    const {challenge} = await actChallenge({trx, userBid});
                    res.challenge = challenge;
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
