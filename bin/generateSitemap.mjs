#!/usr/bin/env node
// Extended Node.js script to generate sitemap.xml from live website
// Handles priorities, lastmod, and recursive crawling

import fs from 'node:fs/promises';
import https from 'node:https';
import {JSDOM} from 'jsdom';

const siteRoot = 'https://nutrilog.app.wiredgeese.com';
const startPaths = ['/'];
const outputSitemapPath = './sitemap.xml';
const today = new Date().toISOString().split('T')[0];

/**
 * Simple HTTPS fetch function
 * @param {string} url
 * @returns {Promise<string>}
 */
function fetchPage(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

/**
 * Determine priority based on URL path
 * @param {string} url
 * @returns {string}
 */
function getPriority(url) {
    if (url === '/') return '1.0';
    if (url.includes('/register')) return '0.7';
    if (url.includes('/login')) return '0.6';
    if (url.includes('/playbook')) return '0.8';
    return '0.5';
}

async function generateSitemap() {
    const visited = new Set();
    const toVisit = [...startPaths];

    while (toVisit.length > 0) {
        const currentPath = toVisit.pop();
        if (visited.has(currentPath)) continue;
        visited.add(currentPath);

        try {
            const html = await fetchPage(siteRoot + currentPath);
            const dom = new JSDOM(html);
            const document = dom.window.document;

            const links = Array.from(document.querySelectorAll('a'))
                .map(a => a.getAttribute('href'))
                .filter(href => href && href.startsWith('/') && !href.includes('#'));

            links.forEach(link => {
                if (!visited.has(link)) toVisit.push(link);
            });
        } catch (err) {
            console.error(`Failed to fetch ${currentPath}:`, err.message);
        }
    }

    const urlEntries = Array.from(visited).map(link => {
        const priority = getPriority(link);
        return `    <url>\n` +
            `        <loc>${siteRoot}${link}</loc>\n` +
            `        <lastmod>${today}</lastmod>\n` +
            `        <priority>${priority}</priority>\n` +
            `        <changefreq>monthly</changefreq>\n` +
            `    </url>`;
    }).join('\n\n');

    const sitemap = `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n\n${urlEntries}\n\n</urlset>`;

    await fs.writeFile(outputSitemapPath, sitemap, 'utf-8');

    console.log(`Sitemap generated: ${outputSitemapPath}`);
}

// Start the process
generateSitemap().catch(console.error);