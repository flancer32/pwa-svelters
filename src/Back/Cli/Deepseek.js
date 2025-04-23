/**
 * A test command to touch AI agents
 * @namespace Svelters_Back_Cli_Deepseek
 */
// VARS
const OPT_MODE = 'mode';

const MODE = {
    API_SHARED: 'API_SHARED',
    NEW_CLASS: 'NEW_CLASS',
    NEW_DTO: 'NEW_DTO',
    NEW_ENUM: 'NEW_ENUM',
    RDB_DEM: 'RDB_DEM',
    RDB_QUERY: 'RDB_QUERY',
    RDB_REPO: 'RDB_REPO',
    RDB_SCHEMA: 'RDB_SCHEMA',
    TEST: 'TEST',
};

// MAIN
/**
 * Factory for a CLI command.
 *
 * @param {typeof import('node:path')} path
 * @param {Svelters_Back_Defaults} DEF
 * @param {TeqFw_Core_Back_Config} config
 * @param {TeqFw_Core_Back_Api_Dto_Command.Factory} fCommand
 * @param {TeqFw_Core_Back_Api_Dto_Command_Option.Factory} fOpt
 * @param {TeqFw_Core_Back_App} app - Provides lifecycle management for the application
 * @param {Svelters_Back_Cli_Deepseek_A_Api_Shared} aApiShared
 * @param {Svelters_Back_Cli_Deepseek_A_New_Class} aNewClass
 * @param {Svelters_Back_Cli_Deepseek_A_New_Dto} aNewDto
 * @param {Svelters_Back_Cli_Deepseek_A_New_Enum} aNewEnum
 * @param {Svelters_Back_Cli_Deepseek_A_Rdb_Dem} aRdbDem
 * @param {Svelters_Back_Cli_Deepseek_A_Rdb_Query} aRdbQuery
 * @param {Svelters_Back_Cli_Deepseek_A_Rdb_Repo} aRdbRepo
 * @param {Svelters_Back_Cli_Deepseek_A_Rdb_Schema} aRdbSchema
 * @param {Svelters_Back_Cli_Deepseek_A_Test} aTest
 *
 * @returns {TeqFw_Core_Back_Api_Dto_Command}
 */
export default function Factory(
    {
        'node:path': path,
        Svelters_Back_Defaults$: DEF,
        TeqFw_Core_Back_Config$: config,
        'TeqFw_Core_Back_Api_Dto_Command.Factory$': fCommand,
        'TeqFw_Core_Back_Api_Dto_Command_Option.Factory$': fOpt,
        TeqFw_Core_Back_App$: app,
        Svelters_Back_Cli_Deepseek_A_Api_Shared$: aApiShared,
        Svelters_Back_Cli_Deepseek_A_New_Class$: aNewClass,
        Svelters_Back_Cli_Deepseek_A_New_Dto$: aNewDto,
        Svelters_Back_Cli_Deepseek_A_New_Enum$: aNewEnum,
        Svelters_Back_Cli_Deepseek_A_Rdb_Dem$: aRdbDem,
        Svelters_Back_Cli_Deepseek_A_Rdb_Query$: aRdbQuery,
        Svelters_Back_Cli_Deepseek_A_Rdb_Repo$: aRdbRepo,
        Svelters_Back_Cli_Deepseek_A_Rdb_Schema$: aRdbSchema,
        Svelters_Back_Cli_Deepseek_A_Test$: aTest,
    }
) {
    // VARS
    const {join} = path;

    // FUNCS

    /**
     * Handles the creation of a new OAuth2 client.
     *
     * @param {Object} opts - Command-line options provided by the user
     * @returns {Promise<void>}
     */
    async function action(opts) {
        const rootDocs = join(config.getPathToRoot(), '..', '..', 'docs', 'ai', 'agent');
        const rootWork = join(config.getPathToRoot(), 'tmp', 'agent');
        const mode = opts[OPT_MODE];
        switch (mode) {
            case MODE.API_SHARED:
                await aApiShared.run(rootWork, rootDocs);
                break;
            case MODE.NEW_CLASS:
                await aNewClass.run(rootWork, rootDocs);
                break;
            case MODE.NEW_DTO:
                await aNewDto.run(rootWork, rootDocs);
                break;
            case MODE.NEW_ENUM:
                await aNewEnum.run(rootWork, rootDocs);
                break;
            case MODE.RDB_DEM:
                await aRdbDem.run(rootWork, rootDocs);
                break;
            case MODE.RDB_QUERY:
                await aRdbQuery.run(rootWork, rootDocs);
                break;
            case MODE.RDB_REPO:
                await aRdbRepo.run(rootWork, rootDocs);
                break;
            case MODE.RDB_SCHEMA:
                await aRdbSchema.run(rootWork, rootDocs);
                break;
            case MODE.TEST:
                await aTest.run(rootWork, rootDocs);
                break;
        }
        await app.stop();
    }

    const res = fCommand.create();
    res.realm = DEF.CLI_PREFIX;
    res.name = 'deepseek';
    res.desc = 'a test command to use LLM as code generators';
    res.action = action;

    // Define the --name option
    const optMode = fOpt.create();
    optMode.flags = `-m, --${OPT_MODE} [${Object.keys(MODE).join('|')}]`;
    optMode.description = 'a mode for the used prompts and generated results';
    res.opts.push(optMode);

    return res;
}