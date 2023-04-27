/**
 * Create invite to register new device for user.
 */
// MODULE'S IMPORTS
import {randomUUID} from 'node:crypto';

// MODULE'S CLASSES

/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Svelters_Back_Web_Api_User_Device_Invite_Create {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Svelters_Shared_Web_Api_User_Device_Invite_Create} */
        const endpoint = spec['Svelters_Shared_Web_Api_User_Device_Invite_Create$'];
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

        // VARS
        logger.setNamespace(this.constructor.name);
        const A_ID_EMAIL = rdbIdEmail.getAttributes();
        const A_USER = rdbUser.getAttributes();
        const A_INV = rdbInvite.getAttributes();

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Svelters_Shared_Web_Api_User_Device_Invite_Create.Request|Object} req
         * @param {Svelters_Shared_Web_Api_User_Device_Invite_Create.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            const trx = await conn.startTransaction();
            try {
                // get and normalize input data
                const email = req.email.trim().toLowerCase();
                //
                /** @type {Svelters_Back_RDb_Schema_User_Id_Email.Dto} */
                const found = await crud.readOne(trx, rdbIdEmail, email);
                if (found) {
                    const dto = rdbInvite.createDto();
                    dto.user_ref = found.user_ref;
                    dto.code = randomUUID();
                    await crud.create(trx, rdbInvite, dto);
                    res.code = dto.code;
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
