/**
 * Route for new user registration.
 *
 * - User should give own data for registration (name, email, ...) and send it to the back.
 * - Back validates data, registers new user and returns user UUID.
 *
 * @namespace Svelters_Front_Ui_Route_User_Sign_Up
 */
// MODULE'S VARS
const NS = 'Svelters_Front_Ui_Route_User_Sign_Up';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Svelters_Front_Ui_Route_User_Sign_Up.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Svelters_Front_Defaults} */
    const DEF = spec['Svelters_Front_Defaults$'];
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
    /** @type {TeqFw_Ui_Quasar_Front_Lib_Spinner.vueCompTmpl} */
    const uiSpinner = spec['TeqFw_Ui_Quasar_Front_Lib_Spinner$'];
    /** @type {Svelters_Front_Mod_User_Sign_Up} */
    const modSignUp = spec['Svelters_Front_Mod_User_Sign_Up$'];
    /** @type {Svelters_Front_Mod_User_Attestation.Store} */
    const modStore = spec['Svelters_Front_Mod_User_Attestation.Store$'];
    /** @type {Svelters_Front_Mod_Data_Unique} */
    const modUnique = spec['Svelters_Front_Mod_Data_Unique$'];
    /** @type {Svelters_Front_Mod_WebAuthn} */
    const modAuthn = spec['Svelters_Front_Mod_WebAuthn$'];
    /** @type {typeof Svelters_Front_Mod_User_Attestation.Dto} */
    const DtoAtt = spec['Svelters_Front_Mod_User_Attestation.Dto'];
    /** @type {Svelters_Front_Util_WebAuthn.composeOptPkCreate|function} */
    const composeOptPkCreate = spec['Svelters_Front_Util_WebAuthn.composeOptPkCreate'];


    // VARS
    logger.setNamespace(NS);
    const template = `
<div>
    <navigator/>
    <q-card>
        <ui-spinner :loading="ifLoading"/>
        <q-card-section>
            <q-input v-model="fldName"
                     :label="$t('route.user.sign.up.fld.name')"
                     autocomplete="name"
                     outlined
                     type="text"
            />
            <q-input v-model="fldEmail"
                     :label="$t('route.user.sign.up.fld.email')"
                     autocomplete="email"
                     outlined
                     type="email"
                     v-on:change="onChangeEmail"
            />
            <q-input v-model="fldAge"
                     :label="$t('route.user.sign.up.fld.age')"
                     outlined
                     type="number"
            />
            <q-input v-model="fldHeight"
                     :label="$t('route.user.sign.up.fld.height')"
                     outlined
                     type="number"
            />
        </q-card-section>
        <q-card-section>
            <div>{{message}}</div>
        </q-card-section>
                <q-card-actions align="center">
            <q-btn :label="$t('btn.ok')"
                   color="${DEF.COLOR_Q_PRIMARY}"
                   v-on:click="onOk"
            />
        </q-card-actions>
    </q-card>
</div>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Svelters_Front_Ui_Route_User_Sign_Up
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {uiSpinner},
        data() {
            return {
                deferredEmail: null,
                fldAge: null,
                fldEmail: null,
                fldHeight: null,
                fldName: null,
                ifLoading: false,
                message: null,
            };
        },
        methods: {
            onChangeEmail() {
                // TODO: onChange is fired on focus out, not on key press.
                this.deferredEmail = new Date();
                const TIMEOUT = 0;
                const me = this;
                setTimeout(() => {
                    const now = new Date();
                    if ((now.getTime() - this.deferredEmail.getTime() > TIMEOUT)) {
                        me.ifLoading = true;
                        modUnique.email(this.fldEmail)
                            .then((isUnique) => {
                                me.ifLoading = false;
                                if (!isUnique)
                                    me.message = me.$t('route.user.sign.up.msg.emailNotUnique');
                                else
                                    me.message = me.$t('route.user.sign.up.msg.emailUnique');
                            });
                    }
                }, TIMEOUT);
            },
            async onOk() {
                this.ifLoading = true;
                const res = await modSignUp.register(this.fldAge, this.fldEmail, this.fldHeight, this.fldName);
                this.ifLoading = false;
                if (res.uuid) {
                    this.message = this.$t('route.user.sign.up.msg.registrationSucceed');
                    if (res.challenge) {
                        // attest current device and register publicKey on the back
                        const publicKey = composeOptPkCreate({
                            challenge: res.challenge,
                            rpName: 'Svelters PWA',
                            userName: `${this.fldEmail}`,
                            userUuid: res.uuid,
                        });
                        // noinspection JSValidateTypes
                        /** @type {PublicKeyCredential} */
                        const attestation = await navigator.credentials.create({publicKey});
                        this.ifLoading = true;
                        /** @type {Svelters_Shared_Web_Api_WebAuthn_Attest.Response} */
                        const resAttest = await modAuthn.attest(attestation);
                        this.ifLoading = false;
                        if (resAttest?.attestationId) {
                            const dto = new DtoAtt();
                            dto.attestationId = resAttest.attestationId;
                            modStore.write(dto);
                            this.message = this.$t('route.user.sign.up.msg.attestSucceed');
                        } else {
                            // TODO: error handling
                        }
                    } else {
                        // TODO: we need to create new password for the user
                    }
                } else {
                    this.message = this.$t('route.user.sign.up.msg.registrationFailed');
                }
            }
        },
    };
}
