/**
 * A class for generating new TeqFW-compliant query via Deepseek as part of CLI command.
 */
export default class Svelters_Back_Cli_Deepseek_A_Rdb_Query {
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
         * Generates a new TeqFW-compliant sources
         * @param {string} rootWork
         * @param {string} rootDocs
         * @returns {Promise<void>}
         */
        this.run = async function (rootWork, rootDocs) {
            // map the roots: working folder (variable data) and docs folder (persistent data)
            const pathDocs = join(rootDocs, 'rdb', 'query');
            const pathWork = join(rootWork, 'rdb', 'query');
            // read the content of the files
            const [
                filePromptDto,
                filePromptQuery,
                filePromptSql,
                fileSampleDto,
                fileSampleQuery,
            ] = await helper.readFiles([
                `${pathWork}/prompt.dto.md`,
                `${pathWork}/prompt.query.md`,
                `${pathWork}/prompt.sql.md`,
                `${pathDocs}/sample.dto.md`,
                `${pathDocs}/sample.query.md`,
            ]);

            // generate the code for the item DTO
            const msgCode = {
                role: 'user',
                content: `
## The file with DTO samples:
---
${fileSampleDto}                
---
## The file with the SQL query:
---
${filePromptSql}                
---
## The goal
${filePromptDto}                
`
            };
            const fileResultCode = `${pathWork}/result.dto.js`;
            logger.info(`Generate a new item DTO code.`);
            const outItemDto = await helper.chatAsFile(msgCode, fileResultCode);

            debugger

            // Generate the code for the query
            const msgTest = {
                role: 'user',
                content: `
## The file with the SQL query:
---
${filePromptSql}   
## The file with item DTO  code:
---
${outItemDto}   
## The file with item DTO  code:
---
${fileSampleQuery}                
---
## The goal
${filePromptQuery}                
`
            };
            debugger
            const fileResultTest = `${pathWork}/result.query.js`;
            logger.info(`Generate a new query.`);
            await helper.chatAsFile(msgTest, fileResultTest);
        };
    }
}