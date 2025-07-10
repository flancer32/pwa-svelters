import {
    createLocalContainer,
    dbConnect,
    dbReset,
    stopApp
} from '../../common.mjs';
import {strict as assert} from 'assert';
import http from 'node:http';
import {describe, it, before, after} from 'node:test';

// CONFIG
const HOST = 'localhost';
const PORT = 3000;
const TIMEOUT = 5000;
const PATH_EN = '/en/';
const PATH_RU = '/ru/';
const TITLE_EN = '<title>NutriLog – from GPT to fat loss</title>';
const TITLE_RU = '<title>NutriLog – от GPT к потере веса</title>';

// SETUP CONTAINER
/** @type {TeqFw_Di_Container} */
const container = await createLocalContainer();
/** @type {TeqFw_Core_Shared_Api_Logger} */
const logger = await container.get('TeqFw_Core_Shared_Api_Logger$');

// SHARED EXPECTED VALUES
const EXPECTED = {
    clientId: 'googleId',
    redirectUri: `https://${HOST}/fl64-oauth2-social/callback/google`,
    providerCode: 'google',
};

// Mocks
container.register('Fl64_OAuth2_Social_Back_Plugin_Registry_Provider$', {
    get: () => ({
        exchangeAuthorizationCode: async () => ({
            accessToken: 'mock-access-token',
            response: {access_token: 'mock-access-token'},
        }),
        getAuthorizationUrl: ({clientId, state}) => {
            return `https://accounts.google.com/o/oauth2/v2/auth`
                + `?client_id=${clientId}`
                + `&scope=openid%20email%20profile`
                + `&response_type=code`
                + `&state=${state}`
                + `&redirect_uri=${EXPECTED.redirectUri}`;
        },
        getUserData: async () => ({
            identity: 'test.user@example.com',
            response: {email: 'test.user@example.com'},
        }),
        checkIdentity: async () => ({userId: null}),
    })
});

container.register('Fl64_OAuth2_Social_Back_Email_SignIn_Confirm$', {
    perform: async () => {
        return {redirect: '/app/profile'};
    }
});

// FUNCS
/**
 * Perform a simple HTTP GET request and return response body and status code.
 * @param {string} host
 * @param {number} port
 * @param {string} path
 * @returns {Promise<{body: string, code: number}>}
 */
async function getPageBody({host, port, path}) {
    return new Promise((resolve, reject) => {
        const req = http.get({host, port, path}, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({body: data, code: res.statusCode}));
        });
        req.on('error', reject);
    });
}


describe('user/registration/social', function () {
    /** @type {string} */
    let oauthState;
    /** @type {string} */
    let redirectUri;

    before(async function () {
        async function dbDataInit(container) {
            const conn = await container.get('TeqFw_Db_Back_RDb_IConnect$');
            const repoProvider = await container.get('Fl64_OAuth2_Social_Back_Store_RDb_Repo_Provider$');
            const trx = await conn.startTransaction();
            const dto = repoProvider.createDto();
            dto.code = EXPECTED.providerCode;
            dto.name = 'Google';
            dto.status = 'ACTIVE';
            dto.client_id = EXPECTED.clientId;
            dto.client_secret = 'googleSecret';
            const {primaryKey} = await repoProvider.createOne({trx, dto});
            await trx.commit();
            logger.info(`New OAuth2 provider is created for Google (pk: ${primaryKey.id}).`);
        }

        await dbReset(container);
        await dbConnect(container);
        await dbDataInit(container);

        process.env.TEQ_CMS_SERVER_PORT = `${PORT}`;
        process.env.TEQ_CMS_SERVER_TYPE = 'http';
        const cmdCms = await container.get('Svelters_Back_Cli_Cms$');
        await cmdCms.action({});
    });

    after(async function () {
        await stopApp();
        process.exit(0);
    });

    describe('homepage titles', function () {
        async function waitForTitle({host, port, path, title, timeout}) {
            const deadline = Date.now() + timeout;
            while (Date.now() < deadline) {
                try {
                    const {body} = await getPageBody({host, port, path});
                    if (body.includes(title)) return;
                } catch {}
                await new Promise(r => setTimeout(r, 200));
            }
            assert.fail(`Expected <title> not found at ${path}`);
        }

        it('should show correct <title> on English homepage', {timeout: TIMEOUT + 1000}, async function () {
            await waitForTitle({host: HOST, port: PORT, path: PATH_EN, title: TITLE_EN, timeout: TIMEOUT});
        });

        it('should show correct <title> on Russian homepage', {timeout: TIMEOUT + 1000}, async function () {
            await waitForTitle({host: HOST, port: PORT, path: PATH_RU, title: TITLE_RU, timeout: TIMEOUT});
        });
    });

    describe('google', function () {
        it('should render a valid Google OAuth2 login link on the registration page', {timeout: 5000}, async function () {
            const {body} = await getPageBody({host: HOST, port: PORT, path: '/app/register'});

            const hrefMatch = body.match(/<a[^>]+href="([^"]+accounts\.google\.com[^"]+)"/);
            assert.ok(hrefMatch, 'No Google OAuth link found');

            const hrefEscaped = hrefMatch[1];
            const href = hrefEscaped
                .replace(/&amp;/g, '&')
                .replace(/&#x2F;/g, '/')
                .replace(/&#x3D;/g, '=');

            const url = new URL(href);
            const params = Object.fromEntries(url.searchParams.entries());

            oauthState = params.state;
            redirectUri = params.redirect_uri;

            assert.equal(params.client_id, EXPECTED.clientId, 'Incorrect client_id');
            assert.equal(params.redirect_uri, EXPECTED.redirectUri, 'Incorrect redirect_uri');
            assert.match(params.scope, /openid.*email.*profile/, 'Incorrect scope');
            assert.ok(oauthState?.length > 0, 'Missing or empty state');
            assert.equal(params.response_type, 'code', 'Incorrect response_type');
        });

        it('should accept OAuth2 redirect with valid code and state', {timeout: 5000}, async function () {
            assert.ok(oauthState, 'OAuth2 state was not extracted');
            assert.ok(redirectUri, 'OAuth2 redirect_uri was not extracted');

            const url = new URL(redirectUri);
            url.searchParams.set('code', 'dummy-auth-code');
            url.searchParams.set('state', oauthState);

            const { code} = await getPageBody({host: url.hostname, port: PORT, path: url.pathname + url.search});
            assert.equal(code, 303, 'Expected HTTP 303 redirect');
        });
    });
});
