export default class Svelters_Back_Plugin_Stop {
    /**
     * @param {Fl64_Auth_Otp_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {Svelters_Back_Plugin_Z_Cron} cron
     */
    constructor(
        {
            Fl64_Auth_Otp_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Svelters_Back_Plugin_Z_Cron$: cron,
        }
    ) {
        return function () {
            cron.stop();
        };
    }
}