/**
 * Validate user authentication with WebAuthn API.
 */
// MODULE'S IMPORTS

// MODULE'S CLASSES
import {createHash, subtle} from 'node:crypto';
import {Buffer} from 'node:buffer';

/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Svelters_Back_Web_Api_User_Sign_In_Validate {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Svelters_Shared_Web_Api_User_Sign_In_Validate} */
        const endpoint = spec['Svelters_Shared_Web_Api_User_Sign_In_Validate$'];
        /** @type {Svelters_Back_Util_Codec.b64UrlToBin|function} */
        const b64UrlToBin = spec['Svelters_Back_Util_Codec.b64UrlToBin'];
        /** @type {Svelters_Back_Util_WebAuthn.decodeClientDataJSON|function} */
        const decodeClientDataJSON = spec['Svelters_Back_Util_WebAuthn.decodeClientDataJSON'];
        /** @type {Svelters_Back_Util_WebAuthn.asn1toRaw|function} */
        const asn1toRaw = spec['Svelters_Back_Util_WebAuthn.asn1toRaw'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
        /** @type {Svelters_Back_RDb_Schema_User_Auth_Chlng_Sign} */
        const rdbChlng = spec['Svelters_Back_RDb_Schema_User_Auth_Chlng_Sign$'];
        /** @type {Svelters_Back_RDb_Schema_User_Auth_Attest} */
        const rdbPk = spec['Svelters_Back_RDb_Schema_User_Auth_Attest$'];

        // VARS
        logger.setNamespace(this.constructor.name);
        const A_CHALLENGE = rdbChlng.getAttributes();

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
            const trx = await conn.startTransaction();
            try {
                // get and normalize input data
                const authenticatorData = b64UrlToBin(req.authenticatorData);
                const clientData = decodeClientDataJSON(req.clientDataJSON);
                const getClientDataJSON = b64UrlToBin(req.clientDataJSON);
                const signature = b64UrlToBin(req.signature);
                // load corresponded challenge
                const challenge = clientData.challenge;
                /** @type {Svelters_Back_RDb_Schema_User_Auth_Chlng_Sign.Dto} */
                const found = await crud.readOne(trx, rdbChlng, {[A_CHALLENGE.CHALLENGE]: challenge});
                if (found) {
                    const attestBid = found.attest_ref;
                    /** @type {Svelters_Back_RDb_Schema_User_Auth_Attest.Dto} */
                    const foundPk = await crud.readOne(trx, rdbPk, attestBid);
                    const pkeyJwk = JSON.parse(foundPk.public_key);
                    const publicKey = await subtle.importKey('jwk', pkeyJwk, {
                        name: 'ECDSA',
                        namedCurve: 'P-256'
                    }, false, ['verify']);
                    const clientDataJson = getClientDataJSON.toString();
                    const clientDataHash = createHash('sha256').update(clientDataJson).digest();
                    const algorithm = {name: 'ECDSA', hash: 'SHA-256'};
                    const sigRaw = asn1toRaw(signature);
                    const valid = await subtle.verify(
                        algorithm,
                        publicKey,
                        sigRaw,
                        Buffer.concat([authenticatorData, clientDataHash])
                    );
                    if (valid) {
                        logger.info(`User with attestation '${attestBid}' is authenticated.`);
                        res.success = true;
                    }
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
