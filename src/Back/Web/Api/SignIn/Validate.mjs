/**
 * Validate authentication results (signature).
 */
// MODULE'S IMPORTS
import {createHash,  subtle} from 'node:crypto';
import {Buffer} from 'node:buffer';

// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Svelters_Back_Web_Api_SignIn_Validate {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Svelters_Shared_Web_Api_SignIn_Validate} */
        const endpoint = spec['Svelters_Shared_Web_Api_SignIn_Validate$'];
        /** @type {Svelters_Back_Util_Codec.b64UrlToBin|function} */
        const b64UrlToBin = spec['Svelters_Back_Util_Codec.b64UrlToBin'];
        /** @type {Svelters_Back_Listen_Trans_Z_Util.asn1toRaw|function} */
        const asn1toRaw = spec['Svelters_Back_Listen_Trans_Z_Util.asn1toRaw'];
        /** @type {Svelters_Back_Listen_Trans_Z_Util.decodeClientDataJSON|function} */
        const decodeClientDataJSON = spec['Svelters_Back_Listen_Trans_Z_Util.decodeClientDataJSON'];
        /** @type {Svelters_Back_Listen_Trans_Z_Store} */
        const zStore = spec['Svelters_Back_Listen_Trans_Z_Store$'];

        // VARS
        logger.setNamespace(this.constructor.name);

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         *
         * @param {Svelters_Shared_Web_Api_SignIn_Validate.Request|Object} req
         * @param {Svelters_Shared_Web_Api_SignIn_Validate.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            try {
                // get and normalize input data
                const authenticatorData = b64UrlToBin(req.authenticatorData);
                const clientData = decodeClientDataJSON(req.clientDataJSON);
                const getClientDataJSON = b64UrlToBin(req.clientDataJSON);
                const signature = b64UrlToBin(req.signature);
                // parse attestation and client data properties
                const challenge = clientData.challenge;
                // validate input data
                const dto = zStore.getByChallenge(challenge);
                if (dto) {
                    //
                    console.log(`Validate authentication signature for user '${dto.userName}'.`);
                    // get user data from internal store
                    const publicKey = dto.publicKey;
                    console.log(`There is public key for user '${dto.userName}'.`);
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
                        logger.info(`User '${dto.userName}' is authenticated.`);
                        res.success = true;
                    }
                }
                logger.info(`${this.constructor.name}: ${JSON.stringify(res)}'.`);
            } catch (error) {
                logger.error(error);
            }
        };
    }


}
