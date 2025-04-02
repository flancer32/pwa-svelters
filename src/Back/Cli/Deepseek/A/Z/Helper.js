/**
 * Helper for the `Svelters_Back_Cli_Deepseek_A_` namespace with code to interact with the LLM API.
 */
export default class Svelters_Back_Cli_Deepseek_A_Z_Helper {
    /**
     * @param {typeof import('node:fs/promises')} fs
     * @param {typeof import('openai')} openai
     * @param {Svelters_Back_Defaults} DEF
     * @param {TeqFw_Core_Back_Config} config
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     */
    constructor(
        {
            'node:fs/promises': fs,
            'node:openai': openai,
            Svelters_Back_Defaults$: DEF,
            TeqFw_Core_Back_Config$: config,
            TeqFw_Core_Shared_Api_Logger$$: logger,
        }
    ) {
        // VARIABLES
        const {default: OpenAI} = openai;
        /** OpenAI API client */
        let llm;

        const AI_MODEL = 'deepseek-chat';
        const SYSTEM_FILE = {
            role: 'system',
            content: `You generate one code file based on the provided files and the user’s request. Use the input files as instructions and examples.

Reply with the result in this exact format:

---FILE: filename.ext---
<file content>
---END FILE---

No explanations, comments, or extra text. Only the file block. Output must be complete and ready to save.`,
        };

        // FUNCTIONS
        function getOpenAI() {
            if (!llm) {
                const cfg = config.getLocal(DEF.SHARED.NAME);
                const apiKey = cfg['deepseekApi']; // TODO: temporary solution for API key
                llm = new OpenAI({
                    baseURL: 'https://api.deepseek.com',
                    apiKey,
                });
            }
            return llm;
        }

        // MAIN LOGIC

        this.chatAsFile = async function (message, pathResult) {
            const api = getOpenAI();
            logger.info(`Starting a request to LLM...`);
            const completion = await api.chat.completions.create({
                model: AI_MODEL,
                messages: [SYSTEM_FILE, message],
            });
            logger.info(`The LLM request is completed.`);
            const content = completion.choices[0].message.content;
            const match = content.match(/---FILE: (.+?)---\n([\s\S]+?)\n---END FILE---/);
            if (!match) {
                logger.error('Failed to extract generated file from response.');
                return;
            }
            const [, , textResult] = match;
            await fs.writeFile(pathResult, textResult, 'utf8');
            logger.info(`Generated result saved to '${pathResult}'`);
            return textResult;
        };

        /**
         * Reads multiple files and returns their contents.
         *
         * @param {Array<string>} filePaths - An array of file paths to read.
         * @returns {Promise<Array<string>>} A promise that resolves to an array of file contents.
         */
        this.readFiles = async function (filePaths) {
            return Promise.all(filePaths.map(async (path) => {
                return await fs.readFile(path, 'utf8');
            }));
        };

    }
}
