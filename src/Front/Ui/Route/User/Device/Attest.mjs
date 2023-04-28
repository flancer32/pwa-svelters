/**
 * Screen to use invitation for WebAuthn attestation.
 *
 * @namespace Svelters_Front_Ui_Route_User_Device_Attest
 */
// MODULE'S IMPORTS

// MODULE'S VARS
const NS = 'Svelters_Front_Ui_Route_User_Device_Attest';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Svelters_Front_Ui_Route_User_Device_Attest.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Svelters_Front_Defaults} */
    const DEF = spec['Svelters_Front_Defaults$'];
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
    /** @type {TeqFw_Ui_Quasar_Front_Lib_Spinner.vueCompTmpl} */
    const uiSpinner = spec['TeqFw_Ui_Quasar_Front_Lib_Spinner$'];
    /** @type {Svelters_Front_Mod_User_Device} */
    const modDev = spec['Svelters_Front_Mod_User_Device$'];
    /** @type {Svelters_Front_Util_WebAuthn.composeOptPkCreate|function} */
    const composeOptPkCreate = spec['Svelters_Front_Util_WebAuthn.composeOptPkCreate'];

    // VARS
    logger.setNamespace(NS);
    const template = `
<div>
    <navigator/>
    <q-card>
        <ui-spinner :loading="ifLoading"/>
        <div>Invitation code: {{code}}</div>
        <div>Attestation challenge: {{resUse?.challenge}}</div>
        <div>User name: {{resUse?.userName}}</div>
        <div>User UUID: {{resUse?.userUuid}}</div>
        <div>Relying party name: {{resUse?.rpName}}</div>
    </q-card>
</div>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Svelters_Front_Ui_Route_User_Device_Attest
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {uiSpinner},
        data() {
            return {
                ifLoading: false,
                /** @type {Svelters_Shared_Web_Api_User_Device_Invite_Use.Response} */
                resUse: null,
            };
        },
        props: {
            code: null,
        },
        methods: {},
        async mounted() {
            // get attestation data from the back
            this.ifLoading = true;
            const resUse = await modDev.inviteUse(this.code);
            this.resUse = resUse;
            this.ifLoading = false;
            // compose publicKey options to attest current device
            const challenge = resUse.challenge;
            const rpName = resUse.rpName;
            const userName = resUse.userName;
            const userUuid = resUse.userUuid;
            const publicKey = composeOptPkCreate({challenge, rpName, userName, userUuid});
            // attest current device and register publicKey on the back
            /** @type {PublicKeyCredential|Credential} */
            const attestation = await navigator.credentials.create({publicKey});
            this.ifLoading = true;
            const resAttest = await modDev.attest(attestation);
            this.ifLoading = false;
            debugger
        },
    };
}
