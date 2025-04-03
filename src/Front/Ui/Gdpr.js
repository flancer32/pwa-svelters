/**
 * GDPR consent panel integration and TC string generation.
 */
export default class Svelters_Front_Ui_Gdpr {
    constructor() {
        // VARS
        const STORAGE_KEY = 'gdpr_consent_accepted'; // custom flag

        const elConsent = document.getElementById('tracking-consent');
        const elBtn = document.getElementById('consent-accept');

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

        /**
         * Shows the consent banner and binds the accept action.
         */
        function showConsentPanel() {
            requestAnimationFrame(() => {
                elConsent?.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
            });
            elBtn?.addEventListener('click', acceptConsent);
        }

        // MAIN
        /**
         * If consent was previously given, update the state immediately.
         * Otherwise, prompt the user.
         */
        const hasConsent = localStorage.getItem(STORAGE_KEY) === '1';
        if (hasConsent) {
            elConsent?.remove();
        } else {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', showConsentPanel);
            } else {
                showConsentPanel();
            }
        }
    }
}
