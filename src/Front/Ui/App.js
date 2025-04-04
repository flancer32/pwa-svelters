/**
 * TODO
 */
export default class Svelters_Front_Ui_App {
    /**
     * @param {Svelters_Front_Ui_App_Gdpr}  appGdpr
     */
    constructor(
        {
            Svelters_Front_Ui_App_Gdpr$, // just import the module
        }
    ) {
        // VARS
        const CSS_GPT_LINK = 'nl-gpt-chat-link';
        const GTAG_GPT_OPENED = 'evt_gpt_opened';
        const STORAGE_KEY = 'nl_ads_gpt_opened';

        // FUNCS
        function onContentLoaded() {
            // FUNCS
            function handleClickOnce() {
                if (!localStorage.getItem(STORAGE_KEY)) {
                    gtag('event', GTAG_GPT_OPENED, {method: 'link_click'});
                    localStorage.setItem(STORAGE_KEY, '1');
                }
            }

            // MAIN
            if (!localStorage.getItem(STORAGE_KEY)) {
                // add click handlers to all GPT links
                const links = document.querySelectorAll(`a.${CSS_GPT_LINK}`);
                links.forEach(link => {
                    link.addEventListener('click', handleClickOnce, {once: true});
                });
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
