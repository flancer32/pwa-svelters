/**
 * A class for generating some test response via Deepseek as part of CLI command.
 */
export default class Svelters_Back_Cli_Deepseek_A_Test {
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
         * @returns {Promise<void>}
         */
        this.run = async function (rootWork) {
            const pathWork = join(rootWork, 'test');
            const [
                prompt,
                docTxt,
            ] = await helper.readFiles([
                join(pathWork, 'prompt.md'),
                join(pathWork, 'input.txt'),
            ]);

            // a user message to generate shared data for a Web API endpoint
            const msg = {
                role: 'user',
                content: `
## The input text:
---
${docTxt}                
---
## The goal:
${prompt}                
`
            };
            debugger
            const fileResult = `${pathWork}/result.txt`;
            logger.info(`Generate an output data.`);
            await helper.chatAsFile(msg, fileResult);
        };
    }
}