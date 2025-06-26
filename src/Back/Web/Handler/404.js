/**
 * Handles requests when no other handler can process the request (404 - Not Found).
 * @implements Fl32_Web_Back_Api_Handler
 */
export default class Svelters_Back_Web_Handler_404 {
    /**
     * Initializes the handler with required dependencies.
     *
     * @param {typeof import('node:http2')} http2
     * @param {Svelters_Back_Defaults} DEF
     * @param {Fl32_Web_Back_Helper_Respond} respond
     * @param {Fl32_Tmpl_Back_Service_Load} servTmplLoad
     * @param {Fl32_Tmpl_Back_Service_Render} servTmplRender
     * @param {Svelters_Back_Di_Replace_Cms_Adapter} adapter
     * @param {Fl32_Cms_Back_Config} cfgCms
     * @param {Fl32_Web_Back_Dto_Handler_Info} dtoInfo
     * @param {Svelters_Back_Helper_Web} helpWeb
     * @param {Fl32_Tmpl_Back_Dto_Target} dtoTarget
     * @param {typeof Fl32_Web_Back_Enum_Stage} STAGE
     * @param {typeof Fl32_Tmpl_Back_Enum_Type} TMPL_TYPE
     */
    constructor(
        {
            'node:http2': http2,
            Svelters_Back_Defaults$: DEF,
            Fl32_Web_Back_Helper_Respond$: respond,
            Fl32_Tmpl_Back_Service_Load$: servTmplLoad,
            Fl32_Tmpl_Back_Service_Render$: servTmplRender,
            Fl32_Cms_Back_Api_Adapter$: adapter,
            Fl32_Cms_Back_Config$: cfgCms,
            Fl32_Web_Back_Dto_Handler_Info$: dtoInfo,
            Svelters_Back_Helper_Web$: helpWeb,
            Fl32_Tmpl_Back_Dto_Target$: dtoTarget,
            Fl32_Web_Back_Enum_Stage$: STAGE,
            Fl32_Tmpl_Back_Enum_Type$: TMPL_TYPE,
        }
    ) {
        // VARS
        const {
            HTTP2_HEADER_CONTENT_ENCODING,
            HTTP2_HEADER_CONTENT_LENGTH,
            HTTP2_HEADER_CONTENT_TYPE,
        } = http2.constants;

        const _info = dtoInfo.create();
        _info.name = this.constructor.name;
        _info.stage = STAGE.PROCESS;
        _info.after = ['Fl32_Web_Back_Handler_Static'];
        Object.freeze(_info);

        // MAIN

        /** @returns {Fl32_Web_Back_Dto_Handler_Info.Dto} */
        this.getRegistrationInfo = () => _info;

        /**
         * Processes HTTP requests and renders a 404 page if no other handler can process it.
         *
         * @param {import('http').IncomingMessage|import('http2').Http2ServerRequest} req
         * @param {import('http').ServerResponse|import('http2').Http2ServerResponse} res
         * @returns {Promise<boolean>}
         */
        this.handle = async function (req, res) {
            if (!respond.isWritable(res)) return false;

            const locale = helpWeb.getLocale(req);
            const target = dtoTarget.create();
            target.locales = target.locales || {};
            target.locales.app = cfgCms.getLocaleBaseWeb();
            target.locales.user = locale;
            target.name = `404.html`;
            target.type = TMPL_TYPE.WEB;
            const {template} = await servTmplLoad.perform({target});

            const fullPath = req.url.split('?')[0];
            const baseIndex = fullPath.indexOf(DEF.SHARED.SPACE);
            const relativePath = fullPath.slice(baseIndex + DEF.SHARED.SPACE.length + 1);
            let body;
            const {data, options} = await adapter.get404Data({req});
            const {content} = await servTmplRender.perform({
                target,
                template,
                data,
                options,
            });
            const headers = {
                [HTTP2_HEADER_CONTENT_TYPE]: 'text/html; charset=utf-8',
                [HTTP2_HEADER_CONTENT_ENCODING]: 'utf-8',
            };
            if (content) {
                body = content;
                const bodyBuffer = Buffer.from(content, 'utf-8');
                headers[HTTP2_HEADER_CONTENT_LENGTH] = bodyBuffer.length;
            }
            respond.code404_NotFound({
                res, body, headers: {
                    [HTTP2_HEADER_CONTENT_TYPE]: 'text/html; charset=utf-8',
                }
            });
            return true;
        };
    }
}
