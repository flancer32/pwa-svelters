/**
 * GDPR consent panel integration and TC string generation.
 */
export default class Svelters_Front_Ui_App_Gdpr {
    constructor() {
        // VARS
        const STORAGE_KEY = 'nl_gdpr_consent_accepted'; // see `includes/htmlHead.html`

        const elConsent = document.getElementById('tracking-consent');
        const elBtn = document.getElementById('consent-accept');

        // FUNCS
        function onContentLoaded() {
            // FUNCS
            /**
             * Enables full consent and hides the banner.
             */
            function acceptConsent() {
                localStorage.setItem(STORAGE_KEY, '1');

                gtag('consent', 'update', {
                    ad_storage: 'granted',
                    analytics_storage: 'granted',
                    functionality_storage: 'granted',
                    personalization_storage: 'granted',
                    security_storage: 'granted'
                });

                elConsent?.remove();
            }

            // MAIN
            /**
             * If consent was previously given, update the state immediately.
             * Otherwise, prompt the user.
             */
            if (localStorage.getItem(STORAGE_KEY) === '1') {
                elConsent?.remove();
            } else {
                requestAnimationFrame(() => {
                    elConsent?.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
                });
                elBtn?.addEventListener('click', acceptConsent);
            }
        }

        // MAIN
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', onContentLoaded);
        } else {
            onContentLoaded();
        }

    }
}
