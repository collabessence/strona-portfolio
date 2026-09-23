// Generuje zrzuty ekranu projektów demo do sekcji "Projekty" na stronie głównej.
//
// Użycie (z katalogu głównego repo, wymaga Node + Playwright):
//   npx playwright install chromium
//   node tools/screenshots.js
//
// Skrypt uruchamia lokalny serwer, otwiera każde demo w Chromium, zamyka
// baner cookies i zapisuje zrzut 1280x720 do assets/demo-<nazwa>.jpg.

const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'assets');
const PORT = 8901;

const DEMOS = {
    restauracja: '2-Strony-Wizytowki/3-Restauracja-Bar/index.html',
    dentysta: '11-Dentysta-Klinika/index.html',
    fitness: '12-Fitness-Silownia/index.html',
    hr: '10-StronaHR/index.html',
};

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' };

function serve() {
    return new Promise((resolve) => {
        const server = http.createServer((req, res) => {
            const file = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
            fs.readFile(file, (err, data) => {
                if (err) { res.writeHead(404); res.end(); return; }
                res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
                res.end(data);
            });
        });
        server.listen(PORT, () => resolve(server));
    });
}

(async () => {
    fs.mkdirSync(OUT, { recursive: true });
    const server = await serve();
    const browser = await chromium.launch();

    for (const [name, file] of Object.entries(DEMOS)) {
        const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
        await page.goto(`http://localhost:${PORT}/${file}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1500);
        // Zamknij baner cookies (różne dema mają różne przyciski)
        for (const label of ['Rozumiem', 'Akceptuję', 'Akceptuj']) {
            const btn = page.getByRole('button', { name: label }).first();
            if (await btn.count()) { await btn.click().catch(() => {}); break; }
        }
        await page.addStyleTag({ content: '.cookie-banner, .cookie-consent, .whatsapp-float, .scroll-to-top { display: none !important; }' });
        await page.waitForTimeout(600);
        const out = path.join(OUT, `demo-${name}.jpg`);
        await page.screenshot({ path: out, type: 'jpeg', quality: 82 });
        console.log('zapisano', path.relative(ROOT, out));
        await page.close();
    }

    await browser.close();
    server.close();
})();
