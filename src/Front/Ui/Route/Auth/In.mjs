/**
 * Sign in.
 *
 * @namespace Svelters_Front_Ui_Route_Auth_In
 */
// MODULE'S VARS
const NS = 'Svelters_Front_Ui_Route_Auth_In';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Svelters_Front_Ui_Route_Auth_In.vueCompTmpl}
 */
/**
 * @param {Svelters_Front_Defaults} DEF
 * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
 * @param {TeqFw_Ui_Quasar_Front_Lib_Spinner.vueCompTmpl} uiSpinner
 * @param {Fl32_Auth_Front_Mod_PubKey} modPubKey
 * @param {Fl32_Auth_Front_Mod_Password} modPass
 */
export default function (
    {
        Svelters_Front_Defaults$: DEF,
        TeqFw_Core_Shared_Api_Logger$$: logger,
        TeqFw_Ui_Quasar_Front_Lib_Spinner$: uiSpinner,
        Fl32_Auth_Front_Mod_PubKey$: modPubKey,
        Fl32_Auth_Front_Mod_Password$: modPass,
    }) {
    // VARS
    logger.setNamespace(NS);
    const template = `
<div>
    <navigator/>
    <q-card>
        <ui-spinner :loading="ifLoading"/>
        
        <q-card-section>
            <div>
                <q-icon name="meeting_room" color="${DEF.COLOR_Q_PRIMARY}" size="md"/>
                <span class="text-subtitle1 q-pa-md">{{$t('route.auth.in.title')}}</span>
            </div>
        </q-card-section>

        <q-separator/>

        <q-card-section>
            <q-form class="column q-gutter-sm">
                <q-toggle v-model="fldUsePubKey" v-if="ifPubKeyAvailable"
                          :label="$t('route.auth.in.fld.toggleAuth')"/>            
                <template v-if="!fldUsePubKey">
                    <q-input v-model="fldEmail"
                             :label="$t('route.auth.in.fld.email')"
                             autocomplete="username"
                             outlined
                             type="email"
                    />
                    <q-input v-model="fldPassword"
                             :label="$t('route.auth.in.fld.password')"
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
        
        <q-separator/>
        
        <q-card-actions align="center">
            <q-btn :label="$t('btn.ok')"
                   color="${DEF.COLOR_Q_PRIMARY}"
                   v-on:click="onOk"
            />
        </q-card-actions>
        
        <q-separator v-if="message"/>
        
        <q-card-section v-if="message">
            <div>{{message}}</div>
        </q-card-section>
        
        <q-separator/>
        
        <q-card-section class="row justify-around">
            <q-btn to="${DEF.ROUTE_AUTH_UP}"
                   :label="$t('route.auth.in.register')"
                   color="${DEF.COLOR_Q_PRIMARY}"
                   flat 
            />
            <q-btn to="${DEF.ROUTE_AUTH_RESET}"
                   :label="$t('route.auth.in.resetPassword')"
                   color="${DEF.COLOR_Q_PRIMARY}"
                   flat 
            />
        </q-card-section>        
        
    </q-card>
</div>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf Svelters_Front_Ui_Route_Auth_In
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
                            this.message = this.$t('route.auth.in.msg.success');
                            redirect();
                        } else {
                            this.message = this.$t('route.auth.in.msg.fail');
                        }
                    } else {
                        this.message = this.$t('route.auth.in.msg.failChallenge');
                    }
                    this.ifLoading = false;
                };

                const authPassword = async () => {
                    const email = this.fldEmail;
                    const pass = this.fldPassword;
                    const res = await modPass.passwordValidate(email, pass);
                    if (res?.success) {
                        this.message = this.$t('route.auth.in.msg.success');
                        redirect();
                    } else {
                        this.message = this.$t('route.auth.in.msg.fail');
                    }
                };

                const redirect = () => {
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
