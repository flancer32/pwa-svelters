/**
 * UI module responsible for handling language switching on the web page.
 *
 * Attaches click event listeners to language buttons (EN and RU),
 * sets the corresponding cookie (`locale`) with a 1-year expiration,
 * and reloads the page to apply the language change.
 *
 * @see tmpl/web/en/includes/lang.html
 */
export default class Svelters_Front_Ui_App_Lang {
    /**
     * @param {Svelters_Shared_Defaults} DEF
     */
    constructor(
        {
            Svelters_Shared_Defaults$: DEF,
        }
    ) {
        // VARS
        const elRu = document.getElementById('lang-ru');
        const elEn = document.getElementById('lang-en');

        // FUNCS
        function onContentLoaded() {
            // FUNCS
            function changeLanguage(lang) {
                document.documentElement.lang = lang;
                document.cookie = `${DEF.COOKIE_LOCALE}=${lang}; path=/; max-age=31536000`; // 1 year
                location.reload();
            }

            // MAIN
            elRu.addEventListener('click', () => changeLanguage('ru'));
            elEn.addEventListener('click', () => changeLanguage('en'));
        }

        // MAIN
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', onContentLoaded);
        } else {
            onContentLoaded();
        }
    }
}