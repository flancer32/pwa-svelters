export default class Svelters_Shared_Helper_Cast {
    constructor() {
        /**
         * Cast input data into a 'Date' data type if the input is defined.
         * The date part is returned as a string in 'YYYY-MM-DD' format.
         * This cast is required to convert PostgreSQL date-only data into a string, accounting for the local timezone.
         *
         * @param {Date|string|number} data
         * @param {string} [sep]
         * @returns {string|undefined}
         */
        this.dateString = function (data, sep = '-') {
            if (data instanceof Date || typeof data === 'string' || typeof data === 'number') {
                let date;

                // If input is a string in 'YYYY-MM-DD' format, create UTC date
                if (typeof data === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data)) {
                    // Create date in UTC by appending 'T00:00:00Z'
                    date = new Date(`${data}T00:00:00Z`);
                } else {
                    // Otherwise create a Date object and ensure it works in UTC
                    date = new Date(data);
                }

                // Return undefined if the date is invalid
                if (isNaN(date)) return undefined;

                // Manually extract the UTC date without time part
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
                const day = String(date.getDate()).padStart(2, '0');

                // Return date in 'YYYY-MM-DD' format
                return `${year}${sep}${month}${sep}${day}`;
            }
            return undefined;
        };

    }
}



