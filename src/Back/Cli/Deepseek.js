/**
 * A test command to touch AI agents
 * @namespace Svelters_Back_Cli_Deepseek
 */

// VARS
const OPT_MODE = 'mode';

const MODE = {
    RDB_SCHEMA: 'RDB_SCHEMA',
    RDB_REPO: 'RDB_REPO',
};

// MAIN
/**
 * Factory for a CLI command.
 *
 * @param {typeof import('node:fs/promises')} fsPromises
 * @param {typeof import('node:path')} path
 * @param {typeof import('openai')} openai
 * @param {Svelters_Back_Defaults} DEF
 * @param {TeqFw_Core_Back_Config} config
 * @param {TeqFw_Core_Shared_Api_Logger} logger
 * @param {TeqFw_Core_Back_Api_Dto_Command.Factory} fCommand
 * @param {TeqFw_Core_Back_Api_Dto_Command_Option.Factory} fOpt
 * @param {TeqFw_Core_Back_App} app - Provides lifecycle management for the application
 *
 * @returns {TeqFw_Core_Back_Api_Dto_Command}
 */
export default function Factory(
    {
        'node:fs/promises': fs,
        'node:path': path,
        'node:openai': openai,
        Svelters_Back_Defaults$: DEF,
        TeqFw_Core_Back_Config$: config,
        TeqFw_Core_Shared_Api_Logger$$: logger,
        'TeqFw_Core_Back_Api_Dto_Command.Factory$': fCommand,
        'TeqFw_Core_Back_Api_Dto_Command_Option.Factory$': fOpt,
        TeqFw_Core_Back_App$: app,
    }
) {
    // VARS
    const {default: OpenAI} = openai;
    const {join} = path;

    let API_KEY;

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

    // FUNCS
    function getApiKey() {
        if (!API_KEY) {
            const boo = config.getLocal(DEF.SHARED.NAME);
            API_KEY = boo['deepseekApi'];
        }
        return API_KEY;
    }

    /**
     * Reads multiple files and returns their contents.
     *
     * @param {Array<string>} filePaths - An array of file paths to read.
     * @returns {Promise<Array<string>>} A promise that resolves to an array of file contents.
     */
    async function readFiles(filePaths) {
        return Promise.all(filePaths.map(async (path) => {
            return await fs.readFile(path, 'utf8');
        }));
    }

    async function runRdbRepo(root, openai) {
        const path = join(root, 'rdb', 'repo');
        const [
            filePromptCode,
            filePromptTest,
            fileSampleCode,
            fileSampleTest,
        ] = await readFiles([
            `${path}/prompt.code.md`,
            `${path}/prompt.test.md`,
            `${path}/sample.code.md`,
            `${path}/sample.test.md`,
        ]);

        // Generate the repo code for the schema sample
        const msgCode = [
            SYSTEM_FILE,
            {
                role: 'user',
                content: `
## The file with code samples:
---
${fileSampleCode}                
---
## The goal
${filePromptCode}                
`
            },
        ];
        debugger
        const completionCode = await openai.chat.completions.create({
            model: AI_MODEL,
            messages: msgCode,
        });
        const contentCode = completionCode.choices[0].message.content;
        const matchCode = contentCode.match(/---FILE: (.+?)---\n([\s\S]+?)\n---END FILE---/);
        if (!matchCode) {
            logger.error('Failed to extract generated file from response.');
            return;
        }
        const [, , outContentCode] = matchCode;
        const outPathCode = `${path}/result.code.js`;
        await fs.writeFile(outPathCode, outContentCode, 'utf8');
        logger.info(`Generated code saved to ${outPathCode}`);

        // Generate the unit test for the generated repo
        const msgTest = [
            SYSTEM_FILE,
            {
                role: 'user',
                content: `
## The file with unit test samples:
---
${fileSampleTest}   
## The file with repo code:
---
${outContentCode}                
---
## The goal
${filePromptTest}                
`
            },
        ];
        debugger
        const completionTest = await openai.chat.completions.create({
            model: AI_MODEL,
            messages: msgTest,
        });
        const contentTest = completionTest.choices[0].message.content;
        const matchTest = contentTest.match(/---FILE: (.+?)---\n([\s\S]+?)\n---END FILE---/);
        if (!matchTest) {
            logger.error('Failed to extract generated file from response.');
            return;
        }
        const [, , outContentTest] = matchTest;
        const outPathTest = `${path}/result.test.js`;
        await fs.writeFile(outPathTest, outContentTest, 'utf8');
        logger.info(`Generated unit test saved to ${outPathTest}`);
    }

    async function runRdbSchema(root, openai) {
        const path = join(root, 'rdb', 'schema');
        const [
            fileDemSchema,
            filePromptCode,
            filePromptTest,
            fileSampleCode,
            fileSampleTest,
        ] = await readFiles([
            `${path}/dem.schema.md`,
            `${path}/prompt.code.md`,
            `${path}/prompt.test.md`,
            `${path}/sample.code.md`,
            `${path}/sample.test.md`,
        ]);

        // Generate the schema code for the DEM structure
        const msgCode = [
            SYSTEM_FILE,
            {
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
            },
        ];
        debugger
        const completionCode = await openai.chat.completions.create({
            model: AI_MODEL,
            messages: msgCode,
        });
        const contentCode = completionCode.choices[0].message.content;
        const matchCode = contentCode.match(/---FILE: (.+?)---\n([\s\S]+?)\n---END FILE---/);
        if (!matchCode) {
            logger.error('Failed to extract generated file from response.');
            return;
        }
        const [, , outContentCode] = matchCode;
        const outPathCode = `${path}/result.code.js`;
        await fs.writeFile(outPathCode, outContentCode, 'utf8');
        logger.info(`Generated code saved to ${outPathCode}`);

        // Generate the unit test for the generated repo
        const msgTest = [
            SYSTEM_FILE,
            {
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
            },
        ];
        debugger
        const completionTest = await openai.chat.completions.create({
            model: AI_MODEL,
            messages: msgTest,
        });
        const contentTest = completionTest.choices[0].message.content;
        const matchTest = contentTest.match(/---FILE: (.+?)---\n([\s\S]+?)\n---END FILE---/);
        if (!matchTest) {
            logger.error('Failed to extract generated file from response.');
            return;
        }
        const [, , outContentTest] = matchTest;
        const outPathTest = `${path}/result.test.js`;
        await fs.writeFile(outPathTest, outContentTest, 'utf8');
        logger.info(`Generated unit test saved to ${outPathTest}`);
    }

    /**
     * Handles the creation of a new OAuth2 client.
     *
     * @param {Object} opts - Command-line options provided by the user
     * @returns {Promise<void>}
     */
    async function action(opts) {
        const root = join(config.getPathToRoot(), 'tmp', 'agent');
        const openai = new OpenAI({
            baseURL: 'https://api.deepseek.com',
            apiKey: getApiKey(),
        });
        const mode = opts[OPT_MODE];
        switch (mode) {
            case MODE.RDB_REPO:
                await runRdbRepo(root, openai);
                break;
            case MODE.RDB_SCHEMA:
                await runRdbSchema(root, openai);
                break;
        }
        await app.stop();
    }

    const res = fCommand.create();
    res.realm = DEF.CLI_PREFIX;
    res.name = 'deepseek';
    res.desc = 'A test command to touch AI agents.';
    res.action = action;

    // Define the --name option
    const optMode = fOpt.create();
    optMode.flags = `-m, --${OPT_MODE} [RDB_SCHEMA|RDB_REPO]`;
    optMode.description = 'A mode for the generated prompt.';
    res.opts.push(optMode);

    return res;
}
