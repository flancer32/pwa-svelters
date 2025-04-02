/**
 * A class for generating new TeqFW-compliant schema via Deepseek as part of CLI command.
 */
export default class Svelters_Back_Cli_Deepseek_A_Rdb_Schema {
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
            const pathDocs = join(rootDocs, 'rdb', 'schema');
            const pathWork = join(rootWork, 'rdb', 'schema');
            const [
                fileDemSchema,
                fileSampleCode,
                fileSampleTest,
                filePromptCode,
                filePromptTest,
            ] = await helper.readFiles([
                `${pathDocs}/dem.schema.md`,
                `${pathDocs}/sample.code.md`,
                `${pathDocs}/sample.test.md`,
                `${pathWork}/prompt.code.md`,
                `${pathWork}/prompt.test.md`,
            ]);

            // Generate the schema code for the DEM structure
            const msgCode = {
                role: 'user',
                content: `
## The file with code samples:
---
${fileSampleCode}                
---
## The file DEM schema:
---
${fileDemSchema}                
---
## The goal
${filePromptCode}                
`
            };
            debugger
            const fileResultCode = `${pathWork}/result.code.js`;
            logger.info(`Generate a new schema code.`);
            const outContentCode = await helper.chatAsFile(msgCode, fileResultCode);

            // Generate the unit test for the generated schema
            const msgTest = {
                role: 'user',
                content: `
## The file with unit test samples:
---
${fileSampleTest}   
## The file with schema code:
---
${outContentCode}                
---
## The goal
${filePromptTest}                
`
            };
            debugger
            const fileResultTest = `${pathWork}/result.test.js`;
            logger.info(`Generate a new schema test.`);
            await helper.chatAsFile(msgTest, fileResultTest);
        };
    }
}