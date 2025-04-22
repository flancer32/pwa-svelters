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

        const AI_MODEL_DS_CHAT = 'deepseek-chat';
        const AI_MODEL_OAI_4_1 = 'gpt-4.1';
        const SYSTEM_FILE = {
            role: 'system',
            content: `You generate one code file based on the provided files and the user’s request. Use the input files as instructions and examples.

Reply with the result in this exact format:

---FILE: filename.ext---
<file content>
---END FILE---

No explanations, comments, or extra text. Only the file block. Output must be complete and ready to save.`,
        };
        const SYSTEM_GENERAL = {
            role: 'system',
            content: `
You are a **System Analyst AI** specialized in verifying **internal consistency** across complex documentation sets intended for **Large Language Models (LLMs)**. Your primary goal is to analyze a corpus of documents—such as architectural guidelines, coding standards, integration protocols, and DI rules—and identify:

1. **Logical contradictions or conflicting statements.**
2. **Inconsistencies in terminology, format, or conceptual structure.**
3. **Overlaps or ambiguities in responsibilities between described components or principles.**
4. **Gaps in reasoning, where steps or justifications are missing.**
5. **Incoherence between general principles and specific examples.**

### Your evaluation should:

- Take a **system-level view**: Consider how parts relate to each other and form a coherent whole.
- Be **precise and technical**, using accurate terminology from the domain (e.g., ESModules, DI containers, late binding).
- Highlight **both minor and major inconsistencies**, prioritizing those that could lead to confusion for an LLM agent or downstream developer.
- Include **suggestions for resolution**, such as reformulation, merging of redundant sections, or clarification of ambiguous rules.

You must assume the audience includes **automated agents (LLMs)** and **human developers** using the documents for implementation and training. Therefore, strive for clarity, predictability, and structural integrity across all texts.

If no inconsistencies are found, confirm coherence and explain briefly **why the documentation set appears consistent**, citing aligned principles, shared conventions, and absence of semantic conflict.            
            `,
        };

        // FUNCTIONS
        function getOpenAI() {
            if (!llm) {
                const cfg = config.getLocal(DEF.SHARED.NAME);
                const apiKey = cfg['deepseekApi']; // TODO: temporary solution for API key
                // const apiKey = cfg['openaiApi'];
                llm = new OpenAI({
                    baseURL: 'https://api.deepseek.com',
                    apiKey,
                });
                // llm = new OpenAI({apiKey});
            }
            return llm;
        }

        // MAIN LOGIC

        this.chatAsFile = async function (message, pathResult) {
            try {
                const api = getOpenAI();
                logger.info(`Starting a request to LLM...`);
                const completion = await api.chat.completions.create({
                    model: AI_MODEL_DS_CHAT,
                    // model: AI_MODEL_OAI_4_1,
                    // messages: [SYSTEM_GENERAL, message],
                    messages: [SYSTEM_FILE, message],
                });
                logger.info(`The LLM request is completed.`);
                const content = completion.choices[0].message.content;
                logger.info(`LLM usage: ${JSON.stringify(completion.usage)}`)
                const match = content.match(/---FILE: (.+?)---\n([\s\S]+?)\n---END FILE---/);
                if (!match) {
                    logger.error('Failed to extract generated file from response.');
                    await fs.writeFile(pathResult, content, 'utf8');
                    return;
                }
                const [, , textResult] = match;
                await fs.writeFile(pathResult, textResult, 'utf8');
                logger.info(`Generated result saved to '${pathResult}'`);
                return textResult;
            } catch (e) {
                logger.exception(e);
                throw e;
            }

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
