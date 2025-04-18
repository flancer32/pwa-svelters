/**
 * A class for generating new TeqFW-compliant Enum via Deepseek as part of CLI command.
 */
export default class Svelters_Back_Cli_Deepseek_A_New_Enum {
    /**
     * @param {typeof import('node:path')} path
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {Svelters_Back_Cli_Deepseek_A_Z_Helper} helper
     */
    constructor(
        {
            'node:path': path,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Svelters_Back_Cli_Deepseek_A_Z_Helper$: helper,
        }
    ) {
        // VARS
        const {join} = path;

        // MAIN
        /**
         * Generates a new TeqFW-compliant class
         * @param {string} rootWork
         * @param {string} rootDocs
         * @returns {Promise<void>}
         */
        this.run = async function (rootWork, rootDocs) {
            const pathDocs = join(rootDocs, 'new', 'enum');
            const pathWork = join(rootWork, 'new', 'enum');
            const [
                prompt,
                docSample,
            ] = await helper.readFiles([
                join(pathWork, 'prompt.md'),
                join(pathDocs, 'sample.md'),
            ]);

            // a user message to generate new ENUM module
            const msg = {
                role: 'user',
                content: `
## The samples:
---
${docSample}                
---
## The goal:
${prompt}                
`
            };
            debugger
            const fileResult = `${pathWork}/result.js`;
            logger.info(`Generate a new ENUM.`);
            await helper.chatAsFile(msg, fileResult);
        };
    }
}