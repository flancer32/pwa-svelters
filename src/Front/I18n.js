/**
 * Handles internationalization (i18n) for the application.
 *
 * This class is responsible for loading locale-specific resources based on the user's language preference.
 * It determines the language from a cookie or the `<html lang="">` attribute, falls back to a default language if necessary,
 * and caches loaded resources for performance optimization.
 */
export default class Svelters_Front_I18n {
    /**
     * @param {Svelters_Shared_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     */
    constructor(
        {
            Svelters_Shared_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
        }
    ) {
        // VARS
        const CACHE = {};
        let current = {};

        // FUNCS
        function getLangCode() {
            // Extract language from a cookie using the configured cookie name
            const cookiePattern = new RegExp(`(?:^|;\\s*)${DEF.COOKIE_LOCALE}=([a-zA-Z-]+)`);
            const match = document.cookie.match(cookiePattern);
            if (match) return match[1].slice(0, 2).toLowerCase();
            // Fallback: use <html lang="">
            const raw = document.documentElement.lang || 'en';
            return raw.slice(0, 2).toLowerCase();
        }


        // MAIN
        /**
         * Loads a locale resource for the current language.
         * @param {string} resource - The name of the resource to load ('/route/name').
         * @returns {Promise<void>}
         */
        this.loadLocale = async function (resource) {
            const lang = getLangCode();
            const fallback = DEF.LOCALE;

            if (CACHE[lang]) {
                current = CACHE[lang];
                return;
            }

            const path = (code) => `/i18n/${code}/${resource}.json`;

            let data = null;

            // Try primary lang
            const res = await fetch(path(lang));
            if (res.ok) {
                data = await res.json();
            } else {
                // Try fallback
                const fallbackRes = await fetch(path(fallback));
                if (fallbackRes.ok) {
                    data = await fallbackRes.json();
                }
            }

            if (!data) {
                logger.error(`Failed to load locale '${lang}' and fallback '${fallback}' for resource '${resource}'`);
                data = {}; // fallback to an empty object
            }

            CACHE[lang] = data;
            current = data;
        };

        this.t = function (key, fallback = '') {
            const parts = key.split('.');
            let value = current;
            for (const part of parts) {
                if (value && typeof value === 'object' && part in value) {
                    value = value[part];
                } else {
                    return fallback || `[${key}]`;
                }
            }
            return value;
        };
    }
}
