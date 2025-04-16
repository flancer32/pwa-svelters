export default class Svelters_Back_Web_Handler_A_Z_Helper {
    /**
     * @param {typeof import('node:http2')} http2
     * @param {typeof import('node:url')} url
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper
     * @param {Svelters_Back_Store_RDb_Schema_User} rdbUser
     * @param {Svelters_Shared_Helper_Cast} helpCast
     * @param {Svelters_Back_Act_User_Profile_Read} actProfileRead
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
        }
    ) {
        // VARS
        const {
            HTTP2_HEADER_CONTENT_TYPE,
            HTTP2_METHOD_POST,
        } = http2.constants;
        const {URLSearchParams} = url;
        const MONTHS_RENEW = DEF.SUBSCRIPTION_MONTHS_RENEW;

        // MAIN

        /**
         *
         * @param {Date|string} dateSubscriptionEnd
         * @returns {boolean}
         */
        this.calcUserCanSubscribe = function ({dateSubscriptionEnd}) {
            if (dateSubscriptionEnd) {
                const renew = new Date();
                const end = new Date(dateSubscriptionEnd);
                renew.setMonth(renew.getMonth() + MONTHS_RENEW);
                return (renew > end);
            } else
                return false;
        };

        this.castDate = helpCast.dateString;

        /**
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @returns {Promise<number>}
         */
        this.getUsersCount = async function ({trx: trxOuter} = {}) {
            return await trxWrapper.execute(trxOuter, async (trx) => {
                const table = trx.getTableName(rdbUser);
                /** @type {Knex.QueryBuilder} */
                const query = trx.createQuery();
                query.table(table);
                query.count('*');
                const [{count}] = await query;
                return 100 - Number.parseInt(count);
            });
        };

        /**
         * Parses the GET parameters from the URL query string.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request.
         * @return {*} Parsed GET parameters as an object.
         */
        this.parseGetParams = function (req) {
            const url = new URL(req.url, `http://${req.headers.host}`);
            return Object.fromEntries(url.searchParams.entries());
        };

        /**
         * Parses the request body, supporting both JSON and x-www-form-urlencoded formats.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request.
         * @return {Promise<*>} Parsed request body as an object.
         */
        this.parsePostedData = async function (req) {
            let body = {};
            if (req.method === HTTP2_METHOD_POST) {
                const shares = req[DEF.MOD_WEB.HNDL_SHARE];

                // Check if the request body is already available in shared memory
                if (shares?.[DEF.MOD_WEB.SHARE_REQ_BODY_JSON]) {
                    body = shares[DEF.MOD_WEB.SHARE_REQ_BODY_JSON];
                } else {
                    const buffers = [];
                    for await (const chunk of req) {
                        buffers.push(chunk);
                    }
                    const rawBody = Buffer.concat(buffers).toString();

                    // Detect content type and parse accordingly
                    const contentType = req.headers[HTTP2_HEADER_CONTENT_TYPE] || '';

                    if (contentType.includes('application/json')) {
                        body = JSON.parse(rawBody);
                    } else if (contentType.includes('application/x-www-form-urlencoded')) {
                        body = Object.fromEntries(new URLSearchParams(rawBody));
                    }
                }
            }
            return body;
        };

        /**
         * The action is wrapped as a function with complex input and simple output arguments.
         *
         * @param {Object} params
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx]
         * @param {number} params.userId
         * @returns {Promise<Svelters_Shared_Dto_User_Profile.Dto>}
         */
        this.readProfile = async function ({trx, userId}) {
            const {profile} = await actProfileRead.run({trx, userId});
            return profile;
        };

    }
}
