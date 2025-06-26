/**
 * Redirects all `/app/...` and `/{locale}/app/...` requests to `/` or `/{locale}/`.
 * @implements Fl32_Web_Back_Api_Handler
 */
export default class Svelters_Back_Web_Handler_App {
    /**
     * @param {typeof import('node:http2')} http2
     * @param {Svelters_Back_Defaults} DEF
     * @param {Fl32_Web_Back_Helper_Respond} respond
     * @param {Fl32_Web_Back_Dto_Handler_Info} dtoInfo
     * @param {typeof Fl32_Web_Back_Enum_Stage} STAGE
     * @param {Svelters_Back_Helper_Web} helpWeb
     */
    constructor(
        {
            'node:http2': http2,
            Svelters_Back_Defaults$: DEF,
            Fl32_Web_Back_Helper_Respond$: respond,
            Fl32_Web_Back_Dto_Handler_Info$: dtoInfo,
            Fl32_Web_Back_Enum_Stage$: STAGE,
            Svelters_Back_Helper_Web$: helpWeb,
        }
    ) {
        const {HTTP_STATUS_FOUND, HTTP2_HEADER_LOCATION} = http2.constants;
        const SPACE = DEF.SHARED.SPACE.toLowerCase();

        const _info = dtoInfo.create();
        _info.name = this.constructor.name;
        _info.stage = STAGE.PROCESS;
        _info.before = ['Fl32_Cms_Back_Web_Handler_Template'];
        Object.freeze(_info);

        /** @returns {Fl32_Web_Back_Dto_Handler_Info.Dto} */
        this.getRegistrationInfo = () => _info;

        /**
         * Redirects `/app/...` → `/`, `/ru/app/...` → `/ru/`
         *
         * @param {import('http').IncomingMessage|import('http2').Http2ServerRequest} req
         * @param {import('http').ServerResponse|import('http2').Http2ServerResponse} res
         * @returns {Promise<boolean>}
         */
        this.handle = async function (req, res) {
            if (!respond.isWritable(res)) return false;

            const rawPath = (req.url || '').split('?')[0];
            const parts = rawPath.split('/').filter(Boolean); // removes empty segments

            const isRedirect =
                parts[0]?.toLowerCase() === SPACE ||
                parts[1]?.toLowerCase() === SPACE;

            if (!isRedirect) return false;

            const {locale, cleanPath} = helpWeb.extractRoutingInfo(req);
            const location = locale ? `/${locale}${cleanPath}` : cleanPath;

            res.writeHead(HTTP_STATUS_FOUND, {[HTTP2_HEADER_LOCATION]: location});
            res.end();
            return true;
        };
    }
}
