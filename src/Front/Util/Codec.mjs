/**
 * Encoding/decoding utilities for strings and binary data.
 * @namespace Svelters_Front_Util_Codec
 */
// DEFINE WORKING VARS
const NS = 'Svelters_Front_Util_Codec';

/**
 * Convert base64url string to binary.
 * @param {string} data
 * @returns {Uint8Array}
 * @memberOf Svelters_Front_Util_Codec
 */
function b64UrlToBin(data) {
    const base64 = b64UrlToBase64(data);
    return base64ToBin(base64);
}

/**
 * Convert base64url string to regular base64 string
 * @param {string} data
 * @returns {string}
 * @memberOf Svelters_Front_Util_Codec
 */
function b64UrlToBase64(data) {
    const buf = data.replace(/-/g, '+').replace(/_/g, '/');
    return buf.padEnd(buf.length + (4 - buf.length % 4) % 4, '=');
}

/**
 * Convert base64 encoded data to binary.
 * @param {string} data
 * @returns {Uint8Array}
 * @memberOf Svelters_Front_Util_Codec
 */
function base64ToBin(data) {
    return new Uint8Array([...atob(data)].map(c => c.charCodeAt(0)));
}

/**
 * Convert base64 encoded data to base64url encoded data.
 * @param {string} base64
 * @returns {string}
 * @memberOf Svelters_Front_Util_Codec
 */
function base64ToB64Url(base64) {
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Convert binary data to base64 string.
 * @param {ArrayBuffer} data
 * @returns {string}
 * @memberOf Svelters_Front_Util_Codec
 */
function binToBase64(data) {
    const binaryArray = new Uint8Array(data);
    return btoa(String.fromCharCode.apply(null, binaryArray));
}

/**
 * Convert binary data to base64url string.
 * @param {ArrayBuffer} data
 * @returns {string}
 * @memberOf Svelters_Front_Util_Codec
 */
function binToB64Url(data) {
    const buf = binToBase64(data);
    return base64ToB64Url(buf);
}

/**
 * Convert binary data to hex string.
 * @param {ArrayBuffer} data
 * @returns {string}
 * @memberOf Svelters_Front_Util_Codec
 */
function binToHex(data) {
    const uint = new Uint8Array(data);
    return Array.prototype.map.call(uint, x => ('00' + x.toString(16)).slice(-2)).join('');
}

/**
 * Convert JSON data encoded as a binary to JS Object.
 * @param {ArrayBuffer} data
 * @returns {Object}
 * @memberOf Svelters_Front_Util_Codec
 */
function binToJson(data) {
    const jsonString = binToUtf8(data);
    return JSON.parse(jsonString);
}

/**
 * Convert UTF8 string encoded as a binary to string.
 * @param {ArrayBuffer} data
 * @returns {String}
 * @memberOf Svelters_Front_Util_Codec
 */
function binToUtf8(data) {
    return new TextDecoder('utf-8').decode(data);
}

// finalize code components for this es6-module
Object.defineProperty(b64UrlToBase64, 'namespace', {value: NS});
Object.defineProperty(b64UrlToBin, 'namespace', {value: NS});
Object.defineProperty(base64ToB64Url, 'namespace', {value: NS});
Object.defineProperty(base64ToBin, 'namespace', {value: NS});
Object.defineProperty(binToB64Url, 'namespace', {value: NS});
Object.defineProperty(binToBase64, 'namespace', {value: NS});
Object.defineProperty(binToHex, 'namespace', {value: NS});
Object.defineProperty(binToJson, 'namespace', {value: NS});
Object.defineProperty(binToUtf8, 'namespace', {value: NS});


export {
    b64UrlToBase64,
    b64UrlToBin,
    base64ToB64Url,
    base64ToBin,
    binToB64Url,
    binToBase64,
    binToHex,
    binToJson,
    binToUtf8,
}
