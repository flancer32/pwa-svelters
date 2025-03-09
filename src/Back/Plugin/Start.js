export default class Svelters_Back_Plugin_Start {
    /**
     * @param {Svelters_Back_Plugin_Z_Cron} cron
     */
    constructor(
        {
            Svelters_Back_Plugin_Z_Cron$: cron,
        }
    ) {
        return function () {
            cron.start();
        };
    }
}