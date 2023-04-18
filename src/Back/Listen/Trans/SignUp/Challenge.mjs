/**
 * Generate sign up challenge before new user registration.
 */
// MODULE'S IMPORTS
import {randomBytes, randomUUID} from 'node:crypto';

// MODULE'S CLASSES
export default class Svelters_Back_Listen_Trans_SignUp_Challenge {
    constructor(spec) {
        // DEPS
        /** @type {Svelters_Back_Defaults} */
        const DEF = spec['Svelters_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {Svelters_Back_Util_Codec.bin2b64Url|function} */
        const bin2b64Url = spec['Svelters_Back_Util_Codec.bin2b64Url'];
        /** @type {TeqFw_Web_Event_Back_Mod_Channel} */
        const eventsBack = spec['TeqFw_Web_Event_Back_Mod_Channel$'];
        /** @type {TeqFw_Web_Event_Back_Mod_Portal_Front} */
        const portalFront = spec['TeqFw_Web_Event_Back_Mod_Portal_Front$'];
        /** @type {Svelters_Shared_Event_Front_SignUp_Challenge_Request} */
        const esfReq = spec['Svelters_Shared_Event_Front_SignUp_Challenge_Request$'];
        /** @type {Svelters_Shared_Event_Back_SignUp_Challenge_Response} */
        const esbRes = spec['Svelters_Shared_Event_Back_SignUp_Challenge_Response$'];
        /** @type {Svelters_Back_Listen_Trans_Z_Store} */
        const zStore = spec['Svelters_Back_Listen_Trans_Z_Store$'];
        /** @type {Svelters_Back_Listen_Trans_Z_Dto} */
        const zDto = spec['Svelters_Back_Listen_Trans_Z_Dto$'];

        // MAIN
        logger.setNamespace(this.constructor.name);
        eventsBack.subscribe(esfReq, handler)

        // FUNCS
        /**
         * @param {Svelters_Shared_Event_Front_SignUp_Challenge_Request.Dto} dataIn
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
                // generate or select data for sign up challenge
                const challenge = bin2b64Url(randomBytes(32));
                const userUuid = randomUUID();
                // compose DTO with challenge data to store internally
                const dto = zDto.createDto();
                dto.challenge = challenge;
                dto.userName = userName;
                dto.userUuid = userUuid;
                zStore.put(dto);
                // compose response
                data.challenge = challenge;
                data.relyingPartyName = 'Svelters PWA';
                data.userName = userName;
                data.userUuid = userUuid;
                logger.info(`new challenge is created: '${challenge}' to sign up new user '${userName}' (uuid: ${userUuid}).`);
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
