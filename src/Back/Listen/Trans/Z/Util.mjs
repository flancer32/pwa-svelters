/**
 * Utilities to encode/decode authentication data.
 * @namespace Svelters_Back_Listen_Trans_Z_Util
 */
// MODULE'S IMPORT
import {b64UrlToBin} from '../../../Util/Codec.mjs';
import {decode} from 'cbor';

// DEFINE WORKING VARS
const NS = 'Svelters_Back_Listen_Trans_Z_Util';

/**
 * Decode ECDSA signature in ASN.1 DER (Distinguished Encoding Rules) format.
 * @see https://github.com/passwordless-id/webauthn/blob/main/src/server.ts#L182
 * @param {ArrayBuffer} buf
 * @returns {Uint8Array}
 * @memberOf Svelters_Back_Listen_Trans_Z_Util
 */
function asn1toRaw(buf) {
    // Convert signature from ASN.1 sequence to 'raw' format
    const uint = new Uint8Array(buf);
    const rStart = uint[4] === 0 ? 5 : 4;
    const rEnd = rStart + 32;
    const sStart = uint[rEnd + 2] === 0 ? rEnd + 3 : rEnd + 2;
    const r = uint.slice(rStart, rEnd);
    const s = uint.slice(sStart);
    return new Uint8Array([...r, ...s]);
}

/**
 * @param {Uint8Array} a
 * @param {Uint8Array} b
 * @returns {boolean}
 * @memberOf Svelters_Back_Listen_Trans_Z_Util
 */
function compareUint8Arrays(a, b) {
    if (a.length !== b.length) return false;
    return a.every((elem, index) => elem === b[index]);
}

/**
 * Convert attestation object from base64url to JS object.
 * @param {string} b64url
 * @returns {{attStmt: *, authData: *, fmt: *}}
 * @memberOf Svelters_Back_Listen_Trans_Z_Util
 */
function decodeAttestationObj(b64url) {
    const cbor = b64UrlToBin(b64url);
    const {fmt, attStmt, authData} = decode(cbor);
    return {fmt, attStmt, authData};
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorAssertionResponse/authenticatorData
 * @param {Buffer} data
 * @returns {{publicKeyCose:*}}
 * @memberOf Svelters_Back_Listen_Trans_Z_Util
 */
function decodeAuthData(data) {
    // A SHA256 hash of the relying party ID that was seen by the browser.
    const rpIdHash = data.slice(0, 32);
    // A bitfield that indicates various attributes that were asserted by the authenticator.
    const flagsBuf = data.slice(32, 33);
    const flags = flagsBuf[0];
    const flagsBin = flags.toString(2);
    // A signature count from the authenticator. The server will use this counter to detect authenticator cloning.
    const counterBuf = data.slice(33, 37);
    const counter = counterBuf.readUInt32BE(0);
    // Authenticator Attestation Globally Unique Identifier,
    const aaguid = data.slice(37, 53);
    if (aaguid.length === 0) {
        // there is no authentication data here
        return {rpIdHash};
    } else {
        //  The length of the credential ID that immediately follows these bytes.
        const credentialIdLengthBuf = data.slice(53, 55);
        const credentialIdLength = credentialIdLengthBuf.readUInt16BE(0);
        // A unique identifier for this credential so that it can be requested for future authentications.
        const credentialId = data.slice(55, 55 + credentialIdLength);
        // A COSE encoded public key (authenticatorData.attestedCredentialData.credentialPublicKey).
        const publicKeyCose = data.slice(55 + credentialIdLength);
        return {rpIdHash, publicKeyCose};
    }
}

/**
 * Convert client data JSON from base64url to JS object.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/AuthenticatorResponse/clientDataJSON
 * @param {string} b64url
 * @returns {{tokenBindingId: *, origin: *, challenge: *, type: *}}
 * @memberOf Svelters_Back_Listen_Trans_Z_Util
 */
function decodeClientDataJSON(b64url) {
    const bin = b64UrlToBin(b64url);
    const str = bin.toString();
    const {type, challenge, origin, tokenBindingId} = JSON.parse(str);
    return {type, challenge, origin, tokenBindingId};
}

// finalize code components for this es6-module
Object.defineProperty(asn1toRaw, 'namespace', {value: NS});
Object.defineProperty(compareUint8Arrays, 'namespace', {value: NS});
Object.defineProperty(decodeAttestationObj, 'namespace', {value: NS});
Object.defineProperty(decodeAuthData, 'namespace', {value: NS});
Object.defineProperty(decodeClientDataJSON, 'namespace', {value: NS});

export {
    asn1toRaw,
    compareUint8Arrays,
    decodeAttestationObj,
    decodeAuthData,
    decodeClientDataJSON,
}
