/**
 * User authentication with WebAuthn API.
 *
 * @namespace Svelters_Front_Ui_Route_User_Sign_In
 */
// MODULE'S IMPORTS

// MODULE'S VARS
const NS = 'Svelters_Front_Ui_Route_User_Sign_In';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Svelters_Front_Ui_Route_User_Sign_In.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Svelters_Front_Defaults} */
    const DEF = spec['Svelters_Front_Defaults$'];
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
    /** @type {Svelters_Front_Util_WebAuthn.composeOptPkGet|function} */
    const composeOptPkGet = spec['Svelters_Front_Util_WebAuthn.composeOptPkGet'];
    /** @type {TeqFw_Ui_Quasar_Front_Lib_Spinner.vueCompTmpl} */
    const uiSpinner = spec['TeqFw_Ui_Quasar_Front_Lib_Spinner$'];
    /** @type {Svelters_Front_Mod_User_Sign_In} */
    const modSignIn = spec['Svelters_Front_Mod_User_Sign_In$'];
    /** @type {Svelters_Front_Mod_User_Attestation.Store} */
    const modStore = spec['Svelters_Front_Mod_User_Attestation.Store$'];

    // VARS
    logger.setNamespace(NS);
    const template = `
<div>
    <navigator/>
    <q-card>
        <ui-spinner :loading="ifLoading"/>
        <q-card-section>
            <div>Attestation ID: {{attestationId}}</div>
            <div>{{message}}</div>
        <q-card-section>
    </q-card>
</div>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Svelters_Front_Ui_Route_User_Sign_In
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {uiSpinner},
        data() {
            return {
                attestationId: null,
                ifLoading: false,
                message: null,
            };
        },
        methods: {},
        async mounted() {
            this.ifLoading = true;
            const dto = modStore.read();
            if (dto?.attestationId) {
                this.attestationId = dto.attestationId;
                const resCh = await modSignIn.getChallenge(dto.attestationId);
                const publicKey = composeOptPkGet({challenge: resCh.challenge, attestationId: resCh.attestationId});
                const credGet = await navigator.credentials.get({publicKey});
                const resV = await modSignIn.validate(credGet.response);
                if (resV?.success) {
                    this.message = 'Authentication is succeed.';
                } else {
                    this.message = 'Authentication is failed.';
                }
            }
            this.ifLoading = false;
        },
    };
}
