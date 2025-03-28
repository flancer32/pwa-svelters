/**
 * CLI command for validating an OpenAPI specification.
 * @namespace Svelters_Back_Cli_OpenAPI
 */

// MAIN
/**
 * Factory function for a CLI command that validates OpenAPI specs.
 *
 * @param {typeof import('node:path')} path - Node.js path module
 * @param {typeof import('@readme/openapi-parser')} openApiParser - OpenAPI parser and validator
 * @param {Svelters_Back_Defaults} DEF - Global application defaults
 * @param {TeqFw_Core_Back_Config} config - Application configuration service
 * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger service
 * @param {TeqFw_Core_Back_Api_Dto_Command.Factory} fCommand - Factory for CLI command DTOs
 * @param {TeqFw_Core_Back_Api_Dto_Command_Option.Factory} fOpt - Factory for CLI command option DTOs
 * @param {TeqFw_Core_Back_App} app - Application lifecycle manager
 *
 * @returns {TeqFw_Core_Back_Api_Dto_Command}
 */
export default function Factory(
    {
        'node:path': path,
        'node:@readme/openapi-parser': openApiParser,
        Svelters_Back_Defaults$: DEF,
        TeqFw_Core_Back_Config$: config,
        TeqFw_Core_Shared_Api_Logger$$: logger,
        'TeqFw_Core_Back_Api_Dto_Command.Factory$': fCommand,
        'TeqFw_Core_Back_Api_Dto_Command_Option.Factory$': fOpt,
        TeqFw_Core_Back_App$: app,
    }
) {
    // VARS
    const {join} = path;

    // FUNCS
    /**
     * Action executed when the CLI command is invoked.
     *
     * @param {Object} opts - Options provided by the CLI environment
     * @returns {Promise<void>}
     */
    async function action(opts) {
        const specPath = join(config.getPathToRoot(), 'etc', 'openapi.json');
        try {
            const res = await openApiParser.validate(specPath);
            if (res.valid) {
                logger.info(`[openapi] ✔ OpenAPI specification is valid: ${specPath}`);
            } else {
                logger.error(`[openapi] ✘ Validation failed for: ${specPath}`);
                if (res.errors?.length) {
                    logger.error(`[openapi] ─── Errors ───`);
                    res.errors.forEach((e, idx) => {
                        logger.error(`[openapi] ${idx + 1}. ${e.message.trim()}`);
                    });
                }
                if (res.warnings?.length) {
                    logger.error(`[openapi] ─── Warnings ───`);
                    res.warnings.forEach((w, idx) => {
                        logger.error(`[openapi] ${idx + 1}. ${w.message.trim()}`);
                    });
                }
                const totalErrors = res.errors?.length || 0;
                const totalWarnings = res.warnings?.length || 0;
                logger.error(`[openapi] ✘ Total: ${totalErrors} error(s), ${totalWarnings} warning(s)`);
            }
        } catch (err) {
            logger.error(`[openapi] ✘ Unexpected error during validation: ${specPath}`);
            logger.error(err.message);
            throw new Error('OpenAPI validation error.');
        } finally {
            await app.stop(); // Ensures clean application shutdown before proceeding
        }
    }


    // MAIN
    const res = fCommand.create();
    res.realm = DEF.CLI_PREFIX;
    res.name = 'openapi';
    res.desc = 'Validates an OpenAPI specification.';
    res.action = action;

    return res;
}
