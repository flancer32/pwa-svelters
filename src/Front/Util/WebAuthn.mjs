/**
 * Utility functions for WebAuthn processes.
 * @namespace Svelters_Front_Util_WebAuthn
 */
// MODULE'S IMPORTS
import {b64UrlToBin} from './Codec.mjs';

// MODULE'S VARS
const NS = 'Svelters_Front_Util_WebAuthn';
const CRED_ALG = -7; // 'ES256' as registered in the IANA COSE Algorithms registry
const CRED_TRANS_INT = 'internal';
const CRED_TYPE = 'public-key';
const TIMEOUT = 360000;  // 6 minutes
const TXT_ENCODER = new TextEncoder();

// MODULE'S FUNCTIONS
/**
 * Compose `publicKey` options for CredentialsContainer.create() method.
 * @param {string} challenge base64 url encoded binary (32 bytes)
 * @param {string} rpName relying party name
 * @param {string} userName
 * @param {string} userUuid
 * @returns {Object}
 * @memberOf Svelters_Front_Util_WebAuthn
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/create (publicKey)
 * TODO: move it to Svelters_Front_Mod_WebAuthn
 */
function composeOptPkCreate({challenge, rpName, userName, userUuid}) {
    const userIdBytes = TXT_ENCODER.encode(userUuid);
    const user = {
        id: userIdBytes,
        name: userName,
        displayName: userName,
    };
    const challengeBin = b64UrlToBin(challenge);
    return {
        // Relying Party:
        rp: {
            // id: RELYING_PARTY_ID, // origin for Relying Party - host.com
            name: rpName,
        },
        // User:
        user,
        challenge: challengeBin, // The challenge is produced by the server
        pubKeyCredParams: [  // This Relying Party will accept an ES256 credential
            {
                type: CRED_TYPE,
                alg: CRED_ALG,
            }
        ],
        timeout: TIMEOUT,
        excludeCredentials: [],
        authenticatorSelection: {
            authenticatorAttachment: 'platform',
            // Try to use UV if possible. This is also the default.
            userVerification: 'preferred'
        },
    };

}

/**
 * Compose `publicKey` options for CredentialsContainer.create() method.
 * @param {string} challenge base64 url encoded binary (32 bytes)
 * @param {string} attestationId
 * @returns {Object}
 * @memberOf Svelters_Front_Util_WebAuthn
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/get
 * TODO: move it to Svelters_Front_Mod_WebAuthn
 */
function composeOptPkGet({challenge, attestationId}) {
    const challengeBin = b64UrlToBin(challenge);
    const rawId = b64UrlToBin(attestationId);
    return {
        challenge: challengeBin,
        allowCredentials: [{
            id: rawId,
            type: CRED_TYPE,
            transports: [CRED_TRANS_INT]
        }],
    };

}

/**
 * @memberOf Svelters_Front_Util_WebAuthn
 * @return {Promise<boolean>}
 * TODO: move it to Svelters_Front_Mod_WebAuthn
 */
async function isPublicKeyAvailable() {
    return await window?.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
}

// finalize code components for this es6-module
Object.defineProperty(composeOptPkCreate, 'namespace', {value: NS});
Object.defineProperty(composeOptPkGet, 'namespace', {value: NS});
Object.defineProperty(isPublicKeyAvailable, 'namespace', {value: NS});

export {
    composeOptPkCreate,
    composeOptPkGet,
    isPublicKeyAvailable,
};
