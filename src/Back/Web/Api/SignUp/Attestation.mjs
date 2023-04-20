/**
 * Save new attestation with `publicKey` on backend.
 */
// MODULE'S IMPORTS
import {subtle, createHash} from 'node:crypto';
import {decode} from 'cbor';
import cosekey from 'parse-cosekey';

// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class Svelters_Back_Web_Api_SignUp_Attestation {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Svelters_Shared_Web_Api_SignUp_Attestation} */
        const endpoint = spec['Svelters_Shared_Web_Api_SignUp_Attestation$'];
        /** @type {Svelters_Back_Listen_Trans_Z_Util.compareUint8Arrays|function} */
        const compareUint8Arrays = spec['Svelters_Back_Listen_Trans_Z_Util.compareUint8Arrays'];
        /** @type {Svelters_Back_Listen_Trans_Z_Util.decodeAttestationObj|function} */
        const decodeAttestationObj = spec['Svelters_Back_Listen_Trans_Z_Util.decodeAttestationObj'];
        /** @type {Svelters_Back_Listen_Trans_Z_Util.decodeAuthData|function} */
        const decodeAuthData = spec['Svelters_Back_Listen_Trans_Z_Util.decodeAuthData'];
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
         * @param {Svelters_Shared_Web_Api_SignUp_Attestation.Request|Object} req
         * @param {Svelters_Shared_Web_Api_SignUp_Attestation.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            try {
                // get and normalize input data
                const userName = req.userName;
                const attestationObj = decodeAttestationObj(req.attestationObj);
                const clientData = decodeClientDataJSON(req.clientData);
                // parse attestation and client data properties
                const challenge = clientData.challenge;
                // validate input data
                const dto = zStore.getByChallenge(challenge);
                if (dto) {
                    // validate hash for 'relying party ID'
                    const source = clientData.origin.replace('https://', '');
                    const actual = createHash('sha256').update(source).digest();
                    const authData = decodeAuthData(attestationObj.authData);
                    const expected = new Uint8Array(authData.rpIdHash);
                    if (compareUint8Arrays(expected, actual)) {
                        // extract public key and store it internally
                        const pkeyDecoded = decode(authData.publicKeyCose);
                        const pkeyJwk = cosekey.KeyParser.cose2jwk(pkeyDecoded);
                        // const createPkPem = await cosekey.KeyParser.cose2pem(createPkRaw);
                        dto.publicKey = await subtle.importKey('jwk', pkeyJwk, {
                            name: 'ECDSA',
                            namedCurve: 'P-256'
                        }, false, ['verify']);
                        dto.attestationId = req.attestationId;
                        logger.info(`Public key is stored for user ${userName} and challenge '${challenge}' (attestation id: '${dto.attestationId}').`);
                        res.success = true;
                    }
                } else {
                    // cannot find user data by given challenge
                }
                logger.info(`${this.constructor.name}: ${JSON.stringify(res)}'.`);
            } catch (error) {
                logger.error(error);
            }
        };
    }


}
