/**
 * Validate user authentication with WebAuthn API.
 */
// MODULE'S CLASSES
import {constants as H2} from 'node:http2';

/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Svelters_Back_Web_Api_User_Sign_In_Validate {
    constructor(spec) {
        // DEPS
        /** @type {Svelters_Back_Defaults} */
        const DEF = spec['Svelters_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Web_Back_Util.cookieCreate|function} */
        const cookieCreate = spec['TeqFw_Web_Back_Util.cookieCreate'];
        /** @type {TeqFw_Web_Back_Mod_Address} */
        const mAddr = spec['TeqFw_Web_Back_Mod_Address$'];
        /** @type {Svelters_Shared_Web_Api_User_Sign_In_Validate} */
        const endpoint = spec['Svelters_Shared_Web_Api_User_Sign_In_Validate$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {Svelters_Back_Act_User_Read.act|function} */
        const actUserRead = spec['Svelters_Back_Act_User_Read$'];
        /** @type {Fl32_Auth_Back_Act_Password_Validate.act|function} */
        const actPassValid = spec['Fl32_Auth_Back_Act_Password_Validate$'];
        /** @type {Fl32_Auth_Back_Act_Assert_Validate.act|function} */
        const actPubKeyValid = spec['Fl32_Auth_Back_Act_Assert_Validate$'];
        /** @type {Fl32_Auth_Back_Act_Session_Open.act|function} */
        const actSessOpen = spec['Fl32_Auth_Back_Act_Session_Open$'];
        /** @type {Svelters_Shared_Dto_User} */
        const dtoUser = spec['Svelters_Shared_Dto_User$'];

        // VARS
        logger.setNamespace(this.constructor.name);

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {Svelters_Shared_Web_Api_User_Sign_In_Validate.Request|Object} req
         * @param {Svelters_Shared_Web_Api_User_Sign_In_Validate.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            let userBid;
            let userData = dtoUser.createDto();
            const trx = await conn.startTransaction();
            try {
                // get and normalize input data
                const email = req.email;
                const hashHex = req.passwordHash;
                const assertion = req.assert;
                //
                if (assertion?.authenticatorData) {
                    const {
                        /** @type {Fl32_Auth_Back_RDb_Schema_Attest.Dto} */
                        attestation,
                        success
                    } = await actPubKeyValid({trx, assertion});
                    userBid = attestation?.user_ref;
                    res.success = success;
                    const {
                        /** @type {Svelters_Back_RDb_Schema_User.Dto} */
                        user
                    } = await actUserRead({trx, userBid});
                    userData.uuid = user.uuid;
                } else {
                    const {
                        /** @type {Svelters_Back_RDb_Schema_User.Dto} */
                        user
                    } = await actUserRead({trx, email});
                    userBid = user.bid;
                    const {success} = await actPassValid({trx, userBid, hashHex});
                    res.success = success;
                    userData.uuid = user.uuid;
                }
                if (res?.success) {
                    const {code} = await actSessOpen({trx, userBid});

                    // set session cookie
                    const pathHttp = context?.request.url;
                    const parts = mAddr.parsePath(pathHttp);
                    const path = (parts.root)
                        ? (parts.door) ? `/${parts.root}/${parts.door}` : `/${parts.root}`
                        : `/`;
                    const cookie = cookieCreate({
                        name: DEF.SESSION_COOKIE_NAME,
                        value: code,
                        expires: DEF.SESSION_COOKIE_LIFETIME,
                        path
                    });
                    context.response.setHeader(H2.HTTP2_HEADER_SET_COOKIE, cookie);
                    // add user data to response
                    res.user = userData;
                    logger.info(`New session is opened for user #${userData.uuid}.`);
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
