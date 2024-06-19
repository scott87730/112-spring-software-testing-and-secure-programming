const puppeteer = require('puppeteer');

// 等待函式
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    // 啟動流覽器並打開新頁面
    const browser = await puppeteer.launch({ headless: true }); // headless: false 可觀察流覽器操作
    const page = await browser.newPage();

    // 導航到指定URL
    await page.goto('https://pptr.dev/');

    try {
        // 等待並點擊搜索按鈕
        await wait(1000);
        const searchButtonSelector = "#__docusaurus > nav > div.navbar__inner > div.navbar__items.navbar__items--right > div.navbarSearchContainer_Bca1 > button > span.DocSearch-Button-Container > span";

        await page.click(searchButtonSelector);

        // 等待搜索輸入框出現並輸入搜索關鍵字
        await wait(1000);
        const searchInputSelector = '#docsearch-input';
        await page.type(searchInputSelector, 'chipi chipi chapa chapa');

        // 等待
        await wait(1000);
        // await page.waitForSelector('#docsearch-item-5 > a'); // 等待搜索結果的特定項出現

        // 點擊搜索結果中的特定項
        await page.click('#docsearch-item-5 > a');

                // 等待頁面載入完成
                // await page.waitForNavigation({ waitUntil: 'networkidle0' });

                // 使用 page.evaluate 獲取元素的文本內容
                await wait(1000);
                const titleText = await page.evaluate(() => {
                    const titleElement = document.querySelector('h1');
                    return titleElement ? titleElement.innerText : '';
                });
        
                // 列印標題文本
                console.log(titleText);
        
            } catch (error) {
                // 捕捉到任何錯誤並輸出
                console.error('發生bug:', error);
            } finally {
                // 確保流覽器關閉
                await browser.close();
            }
        })();