/**
 * This is a code for an 'account/delete.html' template.
 */
export default class Svelters_Front_Ui_Page_Account_Delete {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {Svelters_Front_I18n} i18n
     * @param {Svelters_Shared_Web_End_Account_Delete} endpoint
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Svelters_Front_I18n$: i18n,
            Svelters_Shared_Web_End_Account_Delete$: endpoint,
        }
    ) {
        // VARS
        const elBtn = document.getElementById('btn-delete');
        const elChk = document.getElementById('chk-confirm');
        const elXsrf = document.getElementById('xsrf-token');

        // FUNCS

        function eventToast(type, message) {
            window.dispatchEvent(new CustomEvent('toast', {
                detail: {
                    type,
                    message,
                    duration: 4000,
                }
            }));
        }

        function onContentLoaded() {
            elChk.addEventListener('change', () => {
                elBtn.disabled = !elChk.checked;
            });

            elBtn.addEventListener('click', async () => {
                elBtn.disabled = true;
                try {
                    const req = endpoint.createReq();
                    req.xsrfToken = elXsrf.value;
                    const response = await fetch(endpoint.getRoute(), {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(req),
                    });

                    /** @type {Svelters_Shared_Web_End_Account_Delete.Response} */
                    const result = await response.json();
                    if (response.ok) {
                        if (result.meta) {
                            if (result.meta.code === endpoint.getResultCodes().SUCCESS) {
                                window.location.href = '/app/account/deleted';
                            } else {
                                const message = i18n.t('RESULT.' + result.meta.code);
                                eventToast('success', message);
                            }
                        }
                    } else {
                        if (result.meta) {
                            const message = i18n.t('RESULT.' + result.meta.code);
                            eventToast('error', message);
                        }
                    }
                } catch (error) {
                    // any error (back or front) is occurred
                    const message = i18n.t('RESULT.UNKNOWN');
                    eventToast('error', message);
                    logger.exception(error);
                } finally {
                    elChk.checked = false;
                }

            });
        }

        // MAIN
        i18n.loadLocale('/route/account/delete').catch(logger.exception);
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', onContentLoaded);
        } else {
            onContentLoaded();
        }
    }
}