import {request} from 'https';
import {appendFile} from 'fs/promises';
import {performance} from 'node:perf_hooks';

const TARGET_URL = 'https://nutrilog.app.wiredgeese.com/';
const LOG_FILE = '/home/live/store/util/monitor/nutrilog/checkSpeed.json';
const INTERVAL_MS = 60 * 60 * 1000; // 1 час

async function log(entry) {
    const line = JSON.stringify(entry) + '\n';
    try {
        await appendFile(LOG_FILE, line);
    } catch (err) {
        console.error('Log write error:', err.message);
    }
}

function checkPageSpeed(url) {
    const {hostname, pathname} = new URL(url);
    const start = performance.now();
    let ttfb = null;

    return new Promise((resolve) => {
        const req = request({
            hostname,
            path: pathname || '/',
            method: 'GET',
            headers: {'User-Agent': 'SpeedCheckBot/1.0'},
        }, (res) => {
            let totalBytes = 0;

            res.once('data', () => {
                ttfb = performance.now() - start;
            });

            res.on('data', (chunk) => {
                totalBytes += chunk.length;
            });

            res.on('end', async () => {
                const fullLoadMs = performance.now() - start;
                await log({
                    timestamp: new Date().toISOString(),
                    url,
                    statusCode: res.statusCode,
                    ttfbMs: Number(ttfb?.toFixed(2)) || null,
                    fullLoadMs: Number(fullLoadMs.toFixed(2)),
                    bytes: totalBytes,
                    error: null,
                });
                resolve();
            });
        });

        req.on('error', async (err) => {
            const fullLoadMs = performance.now() - start;
            await log({
                timestamp: new Date().toISOString(),
                url,
                statusCode: null,
                ttfbMs: Number(ttfb?.toFixed(2)) || null,
                fullLoadMs: Number(fullLoadMs.toFixed(2)),
                bytes: 0,
                error: err.message,
            });
            resolve();
        });

        req.end();
    });
}

function startMonitoring() {
    console.log(`Monitoring started: ${TARGET_URL}`);
    checkPageSpeed(TARGET_URL);
    setInterval(() => checkPageSpeed(TARGET_URL), INTERVAL_MS);
}

startMonitoring();
