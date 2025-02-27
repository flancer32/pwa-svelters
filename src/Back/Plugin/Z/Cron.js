/**
 * Class to manage the scheduling of the 'actLogFinalize' action.
 *
 * Initially, the action is executed after a random delay (between 10 and 20 minutes).
 * After the first execution, it is scheduled to run daily at 2:10 UTC.
 * The class also supports stopping the scheduled tasks, clearing all timeouts and intervals.
 */
export default class Svelters_Back_Plugin_Z_Cron {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {Svelters_Back_Act_Calorie_Log_Finalize} actLogFinalize
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Svelters_Back_Act_Calorie_Log_Finalize$: actLogFinalize,
        }
    ) {
        // VARS
        const DAY = 86400000; // 1000*3600*24
        const MIN_10 = 600000; // 10 minutes in milliseconds
        const MIN_20 = 1200000; // 20 minutes in milliseconds

        let intervalLogFinal = null;
        let timeoutLogFinal = null;
        let timeoutLogFinalNextRun = null;

        // MAIN
        this.start = function () {
            // Calculate the random delay between 10 and 20 minutes
            const randomDelay = Math.floor(Math.random() * (MIN_20 - MIN_10 + 1)) + MIN_10;

            // Schedule the first execution with a random delay
            timeoutLogFinal = setTimeout(() => {
                actLogFinalize.run().catch(logger.exception);
                logger.info(`First 'actLogFinalize' process executed after random delay in ${randomDelay} ms.`);

                // After the first execution, schedule it to run every day at 2:10 UTC
                const now = new Date();
                const nextRun = new Date(now);
                nextRun.setUTCHours(2, 10, 0, 0); // Set to 2:10 UTC
                if (now > nextRun) {
                    nextRun.setUTCDate(nextRun.getUTCDate() + 1); // Schedule for next day if it's already past 2:10
                }

                // Calculate the time difference to the next scheduled run at 2:10 UTC
                const timeUntilNextRun = nextRun.getTime() - now.getTime();

                // Use the calculated time for the next run
                timeoutLogFinalNextRun = setTimeout(() => {
                    actLogFinalize.run().catch(logger.exception);
                    logger.info(`'actLogFinalize' is now scheduled for 2:10 UTC every day.`);
                    // Now set an interval to repeat every 24 hours
                    intervalLogFinal = setInterval(actLogFinalize.run, DAY);
                    logger.info(`'actLogFinalize' will now run daily at 2:10 UTC.`);
                }, timeUntilNextRun);
            }, randomDelay);

            logger.info(`The 'actLogFinalize' process will first run after a random delay in ${randomDelay} ms.`);
        };

        this.stop = function () {
            // Clear all active timers to prevent them from running after the plugin is stopped
            if (intervalLogFinal) {
                clearInterval(intervalLogFinal);
                logger.info(`Cleanup process for 'actLogFinalize' is stopped (interval).`);
            }
            if (timeoutLogFinal) {
                clearTimeout(timeoutLogFinal);
                logger.info(`Cleanup process for 'actLogFinalize' is stopped (timeout for random delay).`);
            }
            if (timeoutLogFinalNextRun) {
                clearTimeout(timeoutLogFinalNextRun);
                logger.info(`Cleanup process for 'actLogFinalize' is stopped (timeout for next run at 2:10 UTC).`);
            }
        };
    }
}
