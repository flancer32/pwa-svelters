/**
 * User authentication with WebAuthn API.
 *
 * @namespace Svelters_Front_Ui_Route_User_Sign_In
 */
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
    /** @type {Fl32_Auth_Front_Mod_PubKey} */
    const modPubKey = spec['Fl32_Auth_Front_Mod_PubKey$'];
    /** @type {Fl32_Auth_Front_Mod_Password} */
    const modPass = spec['Fl32_Auth_Front_Mod_Password$'];

    // VARS
    logger.setNamespace(NS);
    const template = `
<div>
    <navigator/>
    <q-card>
        <ui-spinner :loading="ifLoading"/>
        <q-card-section>
            <div class="text-center">{{$t('route.user.sign.in.title')}}</div>
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
                    <q-input v-model="fldPassword"
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
                fldPassword: null,
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
                    const resCh = await modPubKey.assertChallenge();
                    if (resCh?.challenge) {
                        const publicKey = modPubKey.composeOptPkGet({
                            challenge: resCh.challenge,
                            attestationId: resCh.attestationId
                        });
                        // noinspection JSValidateTypes
                        /** @type {PublicKeyCredential} */
                        const assertion = await navigator.credentials.get({publicKey});
                        // noinspection JSCheckFunctionSignatures
                        const resV = await modPubKey.validate(assertion.response);
                        if (resV?.success) {
                            this.message = this.$t('route.user.sign.in.msg.success');
                            setTimeout(redirect, DEF.TIMEOUT_REDIRECT);
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
                    const pass = this.fldPassword;
                    const res = await modPass.passwordValidate(email, pass);
                    if (res?.success) {
                        this.message = this.$t('route.user.sign.in.msg.success');
                        setTimeout(redirect, DEF.TIMEOUT_REDIRECT);
                    } else {
                        this.message = this.$t('route.user.sign.in.msg.fail');
                    }
                };

                const redirect = async () => {
                    // redirect to initial route
                    const query = this.$route?.query;
                    const to = query[DEF.AUTH_REDIRECT] ?? DEF.ROUTE_HOME;
                    this.$router.push(to);
                };

                // MAIN
                if (this.fldUsePubKey) await authPubKey();
                else await authPassword();
            },
        },
        async mounted() {
            // use public key authentication if available
            modPubKey.isPublicKeyAvailable()
                .then((available) => {
                    this.ifPubKeyAvailable = available;
                    this.fldUsePubKey = available;
                });
        },
    };
}
