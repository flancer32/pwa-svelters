/**
 * A class for generating new TeqFW-compliant DEM via Deepseek as part of CLI command.
 */
export default class Svelters_Back_Cli_Deepseek_A_Rdb_Dem {
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
            const pathDocs = join(rootDocs, 'rdb', 'dem');
            const pathWork = join(rootWork, 'rdb', 'dem');
            const [
                filePrompt,
                fileDemSchema,
                fileDemOverview,
            ] = await helper.readFiles([
                `${pathWork}/prompt.md`,
                `${pathDocs}/dem.schema.md`,
                `${pathDocs}/overview.md`,
            ]);

            // prompt to generate DEM code
            const msg = {
                role: 'user',
                content: `
## The file with DEM overview:
---
${fileDemOverview}                
---
## The file with DEM schema:
---
${fileDemSchema}                
---
## The goal
${filePrompt}                
`
            };
            debugger
            const fileResult = `${pathWork}/result.json`;
            logger.info(`Generate a new DEM.`);
            await helper.chatAsFile(msg, fileResult);
        };
    }
}