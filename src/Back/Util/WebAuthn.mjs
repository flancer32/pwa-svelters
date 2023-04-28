/**
 * Utility functions for WebAuthn processes.
 * @namespace Svelters_Back_Util_WebAuthn
 */
// MODULE'S IMPORTS
import {decode} from 'cbor';
import {randomBytes} from 'node:crypto';
import {b64UrlToBin, bin2b64Url} from './Codec.mjs';

// MODULE'S VARS
const NS = 'Svelters_Back_Util_WebAuthn';
const SIZE_CHALLENGE = 32;

// MODULE'S FUNCTIONS
/**
 * Generate challenge for WebAuthn processes (32 bytes 'base64url' encoded).
 * @returns {string}
 * @memberOf Svelters_Back_Util_WebAuthn
 */
function createChallenge() {
    return bin2b64Url(randomBytes(SIZE_CHALLENGE));
}

/**
 * Convert attestation object from base64url to JS object.
 * @param {string} b64url
 * @returns {{attStmt: *, authData: *, fmt: *}}
 * @memberOf Svelters_Back_Util_WebAuthn
 */
function decodeAttestationObj(b64url) {
    const cbor = b64UrlToBin(b64url);
    const {fmt, attStmt, authData} = decode(cbor);
    return {fmt, attStmt, authData};
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorAssertionResponse/authenticatorData
 * @param {Buffer} data
 * @returns {{publicKeyCose:*, rpIdHash:*}}
 * @memberOf Svelters_Back_Util_WebAuthn
 */
function decodeAuthData(data) {
    // A SHA256 hash of the relying party ID that was seen by the browser.
    const rpIdHash = data.subarray(0, 32);
    // A bitfield that indicates various attributes that were asserted by the authenticator.
    const flagsBuf = data.subarray(32, 33);
    const flags = flagsBuf[0];
    const flagsBin = flags.toString(2);
    // A signature count from the authenticator. The server will use this counter to detect authenticator cloning.
    const counterBuf = data.subarray(33, 37);
    const counter = counterBuf.readUInt32BE(0);
    // Authenticator Attestation Globally Unique Identifier,
    const aaguid = data.subarray(37, 53);
    if (aaguid.length === 0) {
        // there is no authentication data here
        return {rpIdHash};
    } else {
        //  The length of the credential ID that immediately follows these bytes.
        const credentialIdLengthBuf = data.subarray(53, 55);
        const credentialIdLength = credentialIdLengthBuf.readUInt16BE(0);
        // A unique identifier for this credential so that it can be requested for future authentications.
        const credentialId = data.subarray(55, 55 + credentialIdLength);
        // A COSE encoded public key (authenticatorData.attestedCredentialData.credentialPublicKey).
        const publicKeyCose = data.subarray(55 + credentialIdLength);
        return {rpIdHash, publicKeyCose};
    }
}


/**
 * Convert client data JSON from base64url to JS object.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorResponse/clientDataJSON
 * @param {string} b64url
 * @returns {{tokenBindingId: *, origin: *, challenge: *, type: *}}
 * @memberOf Svelters_Back_Util_WebAuthn
 */
function decodeClientDataJSON(b64url) {
    const bin = b64UrlToBin(b64url);
    const str = bin.toString();
    const {type, challenge, origin, tokenBindingId} = JSON.parse(str);
    return {type, challenge, origin, tokenBindingId};
}

// finalize code components for this es6-module
Object.defineProperty(createChallenge, 'namespace', {value: NS});
Object.defineProperty(decodeAttestationObj, 'namespace', {value: NS});
Object.defineProperty(decodeClientDataJSON, 'namespace', {value: NS});

export {
    createChallenge,
    decodeAttestationObj,
    decodeAuthData,
    decodeClientDataJSON,
};
