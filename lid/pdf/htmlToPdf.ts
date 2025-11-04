export async function htmlToPdf(html: string) {
  let browser: any;

  try {
    // サーバ（Vercel等）
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteer = (await import("puppeteer-core")).default;
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: true,
      ignoreHTTPSErrors: true,
    });
  } catch {
    // ローカルWindows用フォールバック
    const puppeteer = (await import("puppeteer")).default;
    browser = await puppeteer.launch({ headless: true });
  }

  const page = await browser.newPage();
  const wrapped = `<!doctype html><html lang="ja"><head><meta charset="utf-8">
<style>
body{font-family:-apple-system,"Segoe UI",Roboto,"Noto Sans JP","Yu Gothic UI",Meiryo,sans-serif;font-size:12pt;line-height:1.6;}
h1,h2,h3{margin:0.3em 0;} p{margin:0.25em 0;white-space:pre-wrap;}
</style></head><body>${html}</body></html>`;
  await page.setContent(wrapped, { waitUntil: "networkidle0" });
  const pdf = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();
  return pdf;
}
