/**
 * Validate attestation data and save publicKey.
 */
// MODULE'S IMPORTS
import {subtle, createHash} from 'node:crypto';
import {Buffer} from 'node:buffer';
import {decode} from 'cbor';
import cosekey from 'parse-cosekey';

// MODULE'S CLASSES
export default class Svelters_Back_Listen_Trans_SignUp_Attestation {
    constructor(spec) {
        // DEPS
        /** @type {Svelters_Back_Defaults} */
        const DEF = spec['Svelters_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Svelters_Back_Listen_Trans_Z_Util.compareUint8Arrays|function} */
        const compareUint8Arrays = spec['Svelters_Back_Listen_Trans_Z_Util.compareUint8Arrays'];
        /** @type {Svelters_Back_Listen_Trans_Z_Util.decodeAttestationObj|function} */
        const decodeAttestationObj = spec['Svelters_Back_Listen_Trans_Z_Util.decodeAttestationObj'];
        /** @type {Svelters_Back_Listen_Trans_Z_Util.decodeAuthData|function} */
        const decodeAuthData = spec['Svelters_Back_Listen_Trans_Z_Util.decodeAuthData'];
        /** @type {Svelters_Back_Listen_Trans_Z_Util.decodeClientDataJSON|function} */
        const decodeClientDataJSON = spec['Svelters_Back_Listen_Trans_Z_Util.decodeClientDataJSON'];
        /** @type {TeqFw_Web_Event_Back_Mod_Channel} */
        const eventsBack = spec['TeqFw_Web_Event_Back_Mod_Channel$'];
        /** @type {TeqFw_Web_Event_Back_Mod_Portal_Front} */
        const portalFront = spec['TeqFw_Web_Event_Back_Mod_Portal_Front$'];
        /** @type {Svelters_Shared_Event_Front_SignUp_Attestation_Request} */
        const esfReq = spec['Svelters_Shared_Event_Front_SignUp_Attestation_Request$'];
        /** @type {Svelters_Shared_Event_Back_SignUp_Attestation_Response} */
        const esbRes = spec['Svelters_Shared_Event_Back_SignUp_Attestation_Response$'];
        /** @type {Svelters_Back_Listen_Trans_Z_Store} */
        const zStore = spec['Svelters_Back_Listen_Trans_Z_Store$'];

        // MAIN
        logger.setNamespace(this.constructor.name);
        eventsBack.subscribe(esfReq, handler);

        // FUNCS
        /**
         * @param {Svelters_Shared_Event_Front_SignUp_Attestation_Request.Dto} dataIn
         * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans.Dto} metaIn
         */
        async function handler({data: dataIn, meta: metaIn}) {
            const data = esbRes.createDto();
            const {meta} = portalFront.createMessage();
            meta.sessionUuid = metaIn.sessionUuid;
            meta.requestUuid = metaIn.uuid; // bind request UUID to response
            //
            try {
                // get and normalize input data
                const userName = dataIn.userName;
                const attestationObj = decodeAttestationObj(dataIn.attestationObj);
                const clientData = decodeClientDataJSON(dataIn.clientData);
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
                        dto.attestationId = dataIn.attestationId;
                        logger.info(`Public key is stored for user ${userName} and challenge '${challenge}' (attestation id: '${dto.attestationId}').`);
                        data.success = true;
                    }
                } else {
                    // cannot find user data by given challenge
                }

                // const getAuthenticatorData = b64UrlToBin(dataIn.getAuthenticatorData);
                // const getClientDataJSON = b64UrlToBin(dataIn.getClientDataJSON);
                // const getSignature = b64UrlToBin(dataIn.getSignature);
                //
                // // decode `create` data
                // const {
                //     fmt: createFmt,
                //     attStmt: createAttStmt,
                //     authData: createAuthData
                // } = decode(attestationObj);
                // const {publicKeyCose: createPkCose} = decodeAuthData(createAuthData);
                // const createPkRaw = decode(createPkCose);
                // const createPkJwk = cosekey.KeyParser.cose2jwk(createPkRaw);
                // const createPkPem = await cosekey.KeyParser.cose2pem(createPkRaw);
                //
                // // decode `get` data
                // const {rpIdHash: getRpIdHash, publicKeyCose: getPkCose} = decodeAuthData(getAuthenticatorData);
                // const jsonClientGet = decodeClientDataJSON(getClientDataJSON);
                //
                // // import public key
                // const cryptoKey = await subtle.importKey('jwk', createPkJwk, {
                //     name: 'ECDSA',
                //     namedCurve: 'P-256'
                // }, false, ['verify']);
                //
                // // verify signature
                // const clientDataJson = getClientDataJSON.toString();
                // const clientDataHash = createHash('sha256').update(clientDataJson).digest();
                // const algorithm = {name: 'ECDSA', hash: 'SHA-256'};
                // const sigRaw = convertASN1toRaw(getSignature);
                // const valid = await subtle.verify(
                //     algorithm,
                //     cryptoKey,
                //     sigRaw,
                //     Buffer.concat([getAuthenticatorData, clientDataHash])
                // );
                // if (valid) {
                //     console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
                // }
                /** @type {Buffer} */
                // const attestationId = b64UrlToBin(dataIn.attestationId);
                // const attestationObj = b64UrlToBin(dataIn.attestationObj);

                // const authData = decode(authDataCbor);

                // const clientData = b64UrlToBin(dataIn.clientData);
                // const publicKey = b64UrlToBin(dataIn.publicKey);
                // // convert binary data to objects
                // const json = clientData.toString();
                // console.log(json);
                // console.log(`attestationId: ${dataIn.attestationId}`);
                // const obj = JSON.parse(json);
                // const challenge64 = obj?.challenge;
                // /** @type {Buffer} */
                // const buf = Buffer.from(challenge64, 'base64');
                // const hex = buf.toString('hex');
                // logger.info(`challenge to verify: '${hex}'`);
                // const dto = zStore.get(userName);
                // dto.attestationId = dataIn.attestationId;
                // dto.publicKey = publicKey;
                logger.info(`${esbRes.constructor.name}: ${JSON.stringify(data)}'.`);
            } catch (error) {
                logger.error(error);
            }
            // publish response (if it exists) to front to break waiting on error
            // noinspection JSCheckFunctionSignatures
            await portalFront.publish({data, meta});
        }
    }
}
