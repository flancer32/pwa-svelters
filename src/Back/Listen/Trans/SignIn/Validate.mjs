/**
 * Validate authentication results (signature).
 */
// MODULE'S IMPORTS
import {subtle, createHash} from 'node:crypto';
import {Buffer} from 'node:buffer';

// MODULE'S CLASSES
export default class Svelters_Back_Listen_Trans_SignIn_Validate {
    constructor(spec) {
        // DEPS
        /** @type {Svelters_Back_Defaults} */
        const DEF = spec['Svelters_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Svelters_Back_Util_Codec.b64UrlToBin|function} */
        const b64UrlToBin = spec['Svelters_Back_Util_Codec.b64UrlToBin'];
        /** @type {Svelters_Back_Listen_Trans_Z_Util.asn1toRaw|function} */
        const asn1toRaw = spec['Svelters_Back_Listen_Trans_Z_Util.asn1toRaw'];
        /** @type {Svelters_Back_Listen_Trans_Z_Util.decodeClientDataJSON|function} */
        const decodeClientDataJSON = spec['Svelters_Back_Listen_Trans_Z_Util.decodeClientDataJSON'];
        /** @type {TeqFw_Web_Event_Back_Mod_Channel} */
        const eventsBack = spec['TeqFw_Web_Event_Back_Mod_Channel$'];
        /** @type {TeqFw_Web_Event_Back_Mod_Portal_Front} */
        const portalFront = spec['TeqFw_Web_Event_Back_Mod_Portal_Front$'];
        /** @type {Svelters_Shared_Event_Front_SignIn_Validate_Request} */
        const esfReq = spec['Svelters_Shared_Event_Front_SignIn_Validate_Request$'];
        /** @type {Svelters_Shared_Event_Back_SignIn_Validate_Response} */
        const esbRes = spec['Svelters_Shared_Event_Back_SignIn_Validate_Response$'];
        /** @type {Svelters_Back_Listen_Trans_Z_Store} */
        const zStore = spec['Svelters_Back_Listen_Trans_Z_Store$'];

        // MAIN
        logger.setNamespace(this.constructor.name);
        eventsBack.subscribe(esfReq, handler)

        // FUNCS
        /**
         * @param {Svelters_Shared_Event_Front_SignIn_Validate_Request.Dto} dataIn
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
                const authenticatorData = b64UrlToBin(dataIn.authenticatorData);
                const clientData = decodeClientDataJSON(dataIn.clientDataJSON);
                const getClientDataJSON = b64UrlToBin(dataIn.clientDataJSON);
                const signature = b64UrlToBin(dataIn.signature);
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
                        data.success = true;
                    }
                }
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
