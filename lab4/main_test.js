const puppeteer = require('puppeteer');

describe('Puppeteer lab test', () => {
    it('should search for chipi chipi chapa chapa and print the title of the first result in Docs section', async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://pptr.dev/');

        // 在搜索框中輸入 "chipi chipi chapa chapa"
        await page.type('input[name="search"]', 'chipi chipi chapa chapa');

        // 等待搜索結果加載並點擊 Docs 部分的第一個結果
        await page.waitForSelector('.algolia-docsearch-suggestion--title');
        const firstResult = await page.$('.algolia-docsearch-suggestion--title');
        await firstResult.click();

        // 等待頁面加載並打印標題
        await page.waitForSelector('h1');
        const title = await page.$eval('h1', element => element.textContent);
        console.log('Title:', title);

        await browser.close();
    });
});
