/**
 * Helper class that provides backend functionalities for handling user data,
 * profiles, and requests in a Svelters-based application.
 */
export default class Svelters_Back_Web_Handler_A_Z_Helper {
    /* eslint-disable jsdoc/require-param-description,jsdoc/check-param-names */
    /**
     * @param {typeof import('node:http2')} http2
     * @param {typeof import('node:url')} url
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper
     * @param {Svelters_Back_Store_RDb_Schema_User} rdbUser
     * @param {Svelters_Shared_Helper_Cast} helpCast
     * @param {Svelters_Back_Act_User_Profile_Read} actProfileRead
     * @param {typeof Svelters_Shared_Enum_User_State} STATE
     */
    constructor(
        {
            'node:http2': http2,
            'node:url': url,
            Svelters_Back_Defaults$: DEF,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            Svelters_Back_Store_RDb_Schema_User$: rdbUser,
            Svelters_Shared_Helper_Cast$: helpCast,
            Svelters_Back_Act_User_Profile_Read$: actProfileRead,
            Svelters_Shared_Enum_User_State$: STATE,
        }
    ) {
        /* eslint-enable jsdoc/require-param-description */
        // VARS
        const {
            HTTP2_HEADER_CONTENT_TYPE,
            HTTP2_METHOD_POST,
        } = http2.constants;
        const {URLSearchParams} = url;
        const MONTHS_RENEW = DEF.SUBSCRIPTION_MONTHS_RENEW;
        const A_USER = rdbUser.getAttributes();

        // MAIN

        /**
         * Check if the user is allowed to renew their subscription.
         *
         * @param {object} params - Parameters object.
         * @param {Date|string} params.dateSubscriptionEnd - Current subscription expiration date.
         * @returns {boolean} `true` if the user can renew now, otherwise `false`.
         */
        this.calcUserCanSubscribe = function ({dateSubscriptionEnd}) {
            if (dateSubscriptionEnd) {
                const renew = new Date();
                const end = new Date(dateSubscriptionEnd);
                renew.setMonth(renew.getMonth() + MONTHS_RENEW);
                return (renew > end);
            } else {return false;}
        };

        this.castDate = helpCast.dateString;

        /**
         * Get the number of available subscription slots (out of 100),
         * counting only users with the ACTIVE state.
         *
         * @param {object} params - Parameters object.
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx] - Optional transaction context.
         * @returns {Promise<number>} Number of available slots.
         */
        this.getUsersCount = async function ({trx: trxOuter} = {}) {
            return await trxWrapper.execute(trxOuter, async (trx) => {
                const table = trx.getTableName(rdbUser);
                /** @type {Knex.QueryBuilder} */
                const query = trx.createQuery();
                query.table(table);
                query.where(A_USER.STATE, STATE.ACTIVE);
                query.count('*');
                const [{count}] = await query;
                return 100 - Number.parseInt(count);
            });
        };

        /**
         * Parse GET parameters from the request URL.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request.
         * @returns {object} Parsed query parameters as a key-value object.
         */
        this.parseGetParams = function (req) {
            const url = new URL(req.url, `https://${req.headers.host}`);
            return Object.fromEntries(url.searchParams.entries());
        };

        /**
         * Parse POST body data from the request.
         * Supports JSON and URL-encoded form data.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request.
         * @returns {Promise<object>} Parsed body content.
         */
        this.parsePostedData = async function (req) {
            let body = {};
            if (req.method === HTTP2_METHOD_POST) {
                const buffers = [];
                for await (const chunk of req) buffers.push(chunk);
                const rawBody = Buffer.concat(buffers).toString();
                // Detect content type and parse accordingly
                const contentType = req.headers[HTTP2_HEADER_CONTENT_TYPE] || '';
                if (contentType.includes('application/json')) {
                    body = JSON.parse(rawBody);
                } else if (contentType.includes('application/x-www-form-urlencoded')) {
                    body = Object.fromEntries(new URLSearchParams(rawBody));
                }
            }
            return body;
        };

        /**
         * Read the user profile from the database using the internal action.
         *
         * @param {object} params - Parameters object.
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx] - Optional transaction context.
         * @param {number} params.userId - ID of the user.
         * @returns {Promise<Svelters_Shared_Dto_User_Profile.Dto>} User profile DTO.
         */
        this.readProfile = async function ({trx, userId}) {
            const {profile} = await actProfileRead.run({trx, userId});
            return profile;
        };

        /**
         * Read and normalize the user profile for UI presentation.
         *
         * @param {object} params - Parameters object.
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx] - Optional transaction context.
         * @param {number} params.userId - ID of the user.
         * @returns {Promise<Svelters_Shared_Dto_User_Profile.Dto>} Normalized user profile DTO.
         */
        this.readProfileUi = async function ({trx, userId}) {
            const {profile} = await actProfileRead.run({trx, userId});
            if (profile) {
                profile.dateBirth = helpCast.dateString(profile.dateBirth);
                profile.dateCreated = helpCast.dateString(profile.dateCreated);
                profile.dateSubscriptionEnd = helpCast.dateString(profile.dateSubscriptionEnd);
                profile.dateUpdated = helpCast.dateString(profile.dateUpdated);
                if (profile?.lastCaloriesLog?.date)
                    profile.lastCaloriesLog.date = helpCast.dateString(profile.lastCaloriesLog.date);
            }
            return profile;
        };

    }
}
