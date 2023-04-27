/**
 * Screen for application's homepage.
 *
 * @namespace Svelters_Front_Ui_Route_Home
 */
// MODULE'S IMPORTS

// MODULE'S VARS
const NS = 'Svelters_Front_Ui_Route_Home';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Svelters_Front_Ui_Route_Home.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Svelters_Front_Defaults} */
    const DEF = spec['Svelters_Front_Defaults$'];
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
    /** @type {Svelters_Front_Util_Codec.b64UrlToBin|function} */
    const b64UrlToBin = spec['Svelters_Front_Util_Codec.b64UrlToBin'];
    /** @type {Svelters_Front_Mod_Authn} */
    const modAuthn = spec['Svelters_Front_Mod_Authn$'];
    /** @type {TeqFw_Web_Api_Front_Web_Connect} */
    const webApi = spec['TeqFw_Web_Api_Front_Web_Connect$'];
    /** @type {Svelters_Shared_Web_Api_SignUp_Challenge} */
    const apiSignUpChallenge = spec['Svelters_Shared_Web_Api_SignUp_Challenge$'];

    // VARS
    logger.setNamespace(NS);
    const _textEncoder = new TextEncoder();
    const template = `
<div>
    <navigator/>
    <div class="row q-gutter-xs">
        <q-btn label="Test" color="${DEF.COLOR_Q_PRIMARY}" v-on:click="onTest"/>
        <q-btn label="Sign Up" color="${DEF.COLOR_Q_PRIMARY}" v-on:click="onSignUp"/>
        <q-btn label="Verify" color="${DEF.COLOR_Q_PRIMARY}" v-on:click="onVerify"/>
    </div>
    <div>user: {{userName}}</div>
    <div style="max-width: 100vw;">
        <div v-for="one in info">{{one}}</div>
    </div>
</div>
`;

    // FUNCS

    /**
     * Compose `publicKey` options for CredentialsContainer.create() method.
     * @param {Svelters_Shared_Event_Back_SignUp_Challenge_Response.Dto} dto
     * @returns {Object}
     * @see https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/create (publicKey)
     */
    function composeOptCreate(dto) {
        const userIdBytes = _textEncoder.encode(dto.userUuid);
        const user = {
            id: userIdBytes,
            name: dto.userName,
            displayName: dto.userName,
        };
        const challenge = b64UrlToBin(dto.challenge);
        return {
            // Relying Party:
            rp: {
                // id: RELYING_PARTY_ID, // origin for Relying Party - host.com
                name: dto.relyingPartyName,
            },
            // User:
            user,
            challenge, // The challenge is produced by the server
            pubKeyCredParams: [  // This Relying Party will accept an ES256 credential
                {
                    type: 'public-key',
                    alg: -7 // 'ES256' as registered in the IANA COSE Algorithms registry
                }
            ],
            timeout: 360000,  // 6 minutes
            excludeCredentials: [],
            authenticatorSelection: {
                authenticatorAttachment: 'platform',
                // Try to use UV if possible. This is also the default.
                userVerification: 'preferred'
            },
        };

    }

    /**
     *
     * @returns {CredentialRequestOptions}
     * @see https://developer.mozilla.org/en-US/docs/Web/API/CredentialsContainer/get
     */
    function composeOptGet(challenge, rawId) {
        return {
            publicKey: {
                challenge,
                allowCredentials: [{
                    id: rawId,
                    type: 'public-key',
                    transports: ['internal']
                }],
            }
        };
    }

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Svelters_Front_Ui_Route_Home
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {},
        data() {
            return {
                info: [],
                userName: 'alex',
            };
        },
        methods: {
            log(msg) {
                this.info.unshift(msg);
            },
            async onSignUp() {
                try {
                    this.log(`Start authentication registration for user '${this.userName}'.`);
                    const dto = await modAuthn.challengeUp(this.userName);
                    this.log(`Get sign up challenge from the back: '${dto.challenge}' for user '${dto.userName}' (uuid: ${dto.userUuid}). Relaying party: ${dto.relyingPartyName}.`);
                    const publicKey = composeOptCreate(dto);
                    // noinspection JSValidateTypes
                    /** @type {PublicKeyCredential} */
                    const attestation = await navigator.credentials.create({publicKey});
                    const resp = await modAuthn.attestation(this.userName, attestation);
                    if (resp.success) {
                        this.log(`Attestation public key is registered on the back (attestationId: ${attestation.id}).`);
                    } else {
                        this.log(`Cannot register new public key for user '${this.userName}' on backend.`);
                    }
                } catch (e) {
                    logger.error(`Cannot create PK credentials. Error: ${e?.message}`);
                    console.error(e);
                }
            },
            async onVerify() {
                this.log(`Authentication is started for user '${this.userName}'.`);
                const dto = await modAuthn.challengeIn(this.userName);
                this.log(`Authentication challenge is received from the back: '${dto.challenge}'.`);
                this.log(`Attestation ID to use in authentication: '${dto.attestationId}'.`);
                const challenge = b64UrlToBin(dto.challenge);
                const rawId = b64UrlToBin(dto.attestationId);
                const opts = composeOptGet(challenge, rawId);
                // noinspection JSValidateTypes
                /** @type {PublicKeyCredential} */
                const credGet = await navigator.credentials.get(opts);
                this.log(`Authenticator assertion is composed. Attestation ID = '${credGet.id}'.`);
                // noinspection JSValidateTypes
                /** @type {AuthenticatorAssertionResponse} */
                const resp = credGet.response;
                this.log(`Assertion response user handle = '${resp.userHandle}'.`);
                this.log(`Assertion response signature = '${resp.signature}'.`);
                const auth = await modAuthn.validate(this.userName, resp);
                if (auth.success)
                    this.log(`User is authenticated on backend. Sign in is succeed.`);
                else
                    this.log(`User is NOT authenticated on backend.`);
            },
            async onTest() {
                const req = apiSignUpChallenge.createReq({userName: 'alex'});
                const res = await webApi.send(req, apiSignUpChallenge, {});
                console.log(JSON.stringify(res));
            },
        },
        mounted() { },
    };
}
