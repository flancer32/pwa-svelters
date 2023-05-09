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
    /** @type {TeqFw_Ui_Quasar_Front_Lib_Spinner.vueCompTmpl} */
    const uiSpinner = spec['TeqFw_Ui_Quasar_Front_Lib_Spinner$'];
    /** @type {Svelters_Front_Mod_User_Sign_In} */
    const modSignIn = spec['Svelters_Front_Mod_User_Sign_In$'];
    /** @type {Fl32_Auth_Front_Mod_Store_Attestation.Store} */
    const modStore = spec['Fl32_Auth_Front_Mod_Store_Attestation.Store$'];
    /** @type {Fl32_Auth_Front_Mod_PubKey} */
    const modAuthKey = spec['Fl32_Auth_Front_Mod_PubKey$'];
    /** @type {Fl32_Auth_Front_Mod_Password} */
    const modAuthPass = spec['Fl32_Auth_Front_Mod_Password$'];
    /** @type {Svelters_Front_Mod_User_Session} */
    const modSess = spec['Svelters_Front_Mod_User_Session$'];

    // VARS
    logger.setNamespace(NS);
    const template = `
<div>
    <navigator/>
    <q-card>
        <ui-spinner :loading="ifLoading"/>
        <q-card-section>
            <q-form class="column">
                <q-toggle v-model="fldUsePubKey" v-if="ifPubKeyAvailable"
                          :label="$t('route.user.sign.in.fld.toggleAuth')"/>            
                <template v-if="!fldUsePubKey">
                    <q-input v-model="fldEmail"
                             :label="$t('route.user.sign.in.fld.email')"
                             autocomplete="username"
                             outlined
                             type="email"
                    />
                    <q-input v-model="fldPass"
                             :label="$t('route.user.sign.in.fld.password')"
                             :type="typePass"
                             autocomplete="current-password"
                             outlined
                    >
                        <template v-slot:append>
                            <q-icon
                                    :name="iconPass"
                                    class="cursor-pointer"
                                    @click="ifPassHidden = !ifPassHidden"
                            />
                        </template>
                    </q-input>
                </template>
            </q-form>
        </q-card-section>
        <q-card-actions align="center">
            <q-btn :label="$t('btn.ok')"
                   color="${DEF.COLOR_Q_PRIMARY}"
                   v-on:click="onOk"
            />
        </q-card-actions>
        <q-card-section>
            <div>{{message}}</div>
        </q-card-section>
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
                fldEmail: null,
                fldPass: null,
                fldUsePubKey: false,
                ifLoading: false,
                ifPassHidden: true,
                ifPubKeyAvailable: false,
                message: null,
            };
        },
        computed: {
            iconPass() {
                return this.ifPassHidden ? 'visibility_off' : 'visibility';
            },
            typePass() {
                return this.ifPassHidden ? 'password' : 'text';
            },
        },
        methods: {
            async onOk() {
                // FUNCS
                const authPubKey = async () => {
                    this.ifLoading = true;
                    // define authentication mode: password or publicKey
                    /** @type {Fl32_Auth_Front_Mod_Store_Attestation.Dto} */
                    const dto = modStore.read();
                    const resCh = await modAuthKey.assertChallenge(dto.attestationId);
                    if (resCh?.challenge) {
                        const publicKey = modAuthKey.composeOptPkGet({
                            challenge: resCh.challenge,
                            attestationId: resCh.attestationId
                        });
                        const credGet = await navigator.credentials.get({publicKey});
                        const resV = await modSignIn.validatePubKey(credGet.response);
                        if (resV?.success) {
                            this.message = this.$t('route.user.sign.in.msg.success');
                            modSess.setData(resV.user);
                        } else {
                            this.message = this.$t('route.user.sign.in.msg.fail');
                        }
                    } else {
                        this.message = this.$t('route.user.sign.in.msg.failChallenge');
                    }
                    this.ifLoading = false;
                };

                const authPassword = async () => {
                    const email = this.fldEmail;
                    const salt = await modSignIn.getPasswordSalt(email);
                    const hash = await modAuthPass.hash(this.fldPass, salt);
                    const res = await modSignIn.validatePassword(email, hash);
                    if (res?.success) {
                        this.message = this.$t('route.user.sign.in.msg.success');
                        modSess.setData(res.user);
                    } else {
                        this.message = this.$t('route.user.sign.in.msg.fail');
                    }
                };

                // MAIN
                if (this.fldUsePubKey) await authPubKey();
                else await authPassword();
                // redirect to initial route
                const query = this.$route?.query;
                const to = query[DEF.AUTH_REDIRECT] ?? DEF.ROUTE_HOME;
                this.$router.push(to);
            },
        },
        async mounted() {
            /** @type {Fl32_Auth_Front_Mod_Store_Attestation.Dto} */
            const dto = modStore.read();
            this.ifPubKeyAvailable = Boolean(dto?.attestationId);
            this.fldUsePubKey = this.ifPubKeyAvailable;
        },
    };
}
