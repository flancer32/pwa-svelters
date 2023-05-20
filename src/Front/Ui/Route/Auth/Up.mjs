/**
 * Route for new user registration.
 *
 * - User should give own data for registration (name, email, ...) and send it to the back.
 * - Back validates data, registers new user and returns user UUID.
 *
 * @namespace Svelters_Front_Ui_Route_Auth_Up
 */
// MODULE'S VARS
const NS = 'Svelters_Front_Ui_Route_Auth_Up';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {Svelters_Front_Ui_Route_Auth_Up.vueCompTmpl}
 */
export default function (spec) {
    /** @type {Svelters_Front_Defaults} */
    const DEF = spec['Svelters_Front_Defaults$'];
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
    /** @type {TeqFw_Core_Shared_Util_Date.parseAsUtc|function} */
    const parseAsUtc = spec['TeqFw_Core_Shared_Util_Date.parseAsUtc'];
    /** @type {TeqFw_Ui_Quasar_Front_Lib_Spinner.vueCompTmpl} */
    const uiSpinner = spec['TeqFw_Ui_Quasar_Front_Lib_Spinner$'];
    /** @type {Svelters_Front_Mod_User} */
    const modUser = spec['Svelters_Front_Mod_User$'];
    /** @type {Svelters_Front_Mod_Data_Unique} */
    const modUnique = spec['Svelters_Front_Mod_Data_Unique$'];
    /** @type {Fl32_Auth_Front_Mod_PubKey} */
    const modPubKey = spec['Fl32_Auth_Front_Mod_PubKey$'];

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
                <span class="text-subtitle1 q-pa-md">{{$t('route.auth.up.title')}}</span>
            </div>
        </q-card-section>
                
        <q-separator/>
                
        <q-card-section>
            <q-form class="column q-gutter-sm">
                <q-input v-model="fldName"
                         :label="$t('route.auth.up.fld.name')"
                         autocomplete="name"
                         outlined
                         type="text"
                />
                <q-input v-model="fldEmail"
                         :label="$t('route.auth.up.fld.email')"
                         autocomplete="email"
                         outlined
                         type="email"
                         v-on:change="onChangeEmail"
                />
                
                <q-input v-model="fldHeight"
                         :label="$t('route.auth.up.fld.height')"
                         outlined
                         type="number"
                />
                
                <q-input  v-model="fldDob"
                           :label="$t('route.auth.up.fld.dob')"
                          :rules="['date']"
                          mask="date" 
                          outlined
                >
                    <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-date v-model="fldDob">
                                    <div class="row items-center justify-end">
                                        <q-btn v-close-popup :label="$t('btn.close')" color="${DEF.COLOR_Q_PRIMARY}"
                                               flat/>
                                    </div>
                                </q-date>
                            </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>
                                
                <q-toggle v-model="fldUsePubKey" v-if="ifPubKeyAvailable"
                          :label="$t('route.auth.up.fld.toggleAuth')"/>
                          
                <q-input v-model="fldPassword"
                         :label="$t('route.auth.up.fld.password')"
                         :type="typePass"
                         autocomplete="new-password"
                         outlined
                         v-if="!fldUsePubKey"
                >
                    <template v-slot:append>
                        <q-icon :name="iconPass"
                                @click="ifPassHidden = !ifPassHidden"
                                class="cursor-pointer"
                        />
                    </template>
                </q-input>
                
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
            <q-btn to="${DEF.ROUTE_AUTH_IN}"
                   :label="$t('route.auth.up.signIn')"
                   color="${DEF.COLOR_Q_PRIMARY}"
                   flat 
            />
            <q-btn to="${DEF.ROUTE_AUTH_RESET}"
                   :label="$t('route.auth.up.resetPassword')"
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
     * @memberOf Svelters_Front_Ui_Route_Auth_Up
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {uiSpinner},
        data() {
            return {
                deferredEmail: null,
                fldDob: '2000/01/01',
                fldEmail: null,
                fldHeight: 150,
                fldName: null,
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
                                    me.message = me.$t('route.auth.up.msg.emailNotUnique');
                                else
                                    me.message = me.$t('route.auth.up.msg.emailUnique');
                            });
                    }
                }, TIMEOUT);
            },
            async onOk() {
                // FUNCS
                const redirect = () => {
                    const query = this.$route?.query;
                    const to = query[DEF.AUTH_REDIRECT] ?? DEF.ROUTE_HOME;
                    this.$router.push(to);
                };

                // MAIN
                this.ifLoading = true;
                const res = await modUser.signUp({
                    dob: parseAsUtc(this.fldDob),
                    email: this.fldEmail,
                    height: this.fldHeight,
                    name: this.fldName,
                    password: (!this.ifPubKeyAvailable || !this.fldUsePubKey) ? this.fldPassword : null
                });
                this.ifLoading = false;
                if (res?.sessionData?.uuid) {
                    // regular password sign up is done, redirect to home
                    this.message = this.$t('route.auth.up.msg.registrationSucceed');
                    setTimeout(redirect, DEF.TIMEOUT_REDIRECT);
                } else if (res?.challenge) {
                    // continue public key sign up
                    this.message = this.$t('route.auth.up.msg.registrationSucceed');
                    // attest current device and register publicKey on the back
                    const publicKey = modPubKey.composeOptPkCreate({
                        challenge: res.challenge,
                        rpName: DEF.RP_NAME,
                        userName: `${this.fldEmail}`,
                        userUuid: res.uuid,
                    });
                    // noinspection JSValidateTypes
                    /** @type {PublicKeyCredential} */
                    const attestation = await navigator.credentials.create({publicKey});
                    this.ifLoading = true;
                    /** @type {Fl32_Auth_Shared_Web_Api_Attest.Response} */
                    const resAttest = await modPubKey.attest({attestation});
                    this.ifLoading = false;
                    if (resAttest?.attestationId) {
                        this.message = this.$t('route.auth.up.msg.attestSucceed');
                        setTimeout(redirect, DEF.TIMEOUT_REDIRECT);
                    } else {
                        this.message = this.$t('route.auth.up.msg.attestError');
                    }
                } else {
                    this.message = this.$t('route.auth.up.msg.registrationFailed');
                }
            }
        },
        mounted() {
            modPubKey.isPublicKeyAvailable()
                .then((available) => {
                    this.ifPubKeyAvailable = available;
                    this.fldUsePubKey = available;
                });
        },
    };
}