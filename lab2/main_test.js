const test = require('node:test');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { Application, MailSystem } = require('./main');

// 輔助函數：創建模擬函數
function createMockFn(originalFn) {
    const mockFn = function(...args) {
        mockFn.calls.push(args);
        return originalFn.apply(this, args);
    };
    mockFn.calls = [];
    return mockFn;
}

// 暫時文件路徑
const tempNameListPath = path.join(__dirname, 'name_list.txt');

// 測試前設置
async function setup() {
    fs.writeFileSync(tempNameListPath, 'Alice\nBob\nCharlie');
}

// 測試後清理
async function teardown() {
    fs.unlinkSync(tempNameListPath);
}

// MailSystem.write 測試
test('MailSystem.write should return correct context', async (t) => {
    const mailSystem = new MailSystem();
    assert.strictEqual(mailSystem.write('Alice'), 'Congrats, Alice!');
    assert.strictEqual(mailSystem.write(null), 'Congrats, null!', 'Should handle null');
    assert.strictEqual(mailSystem.write(123), 'Congrats, 123!', 'Should handle numbers');
});

// MailSystem.send 測試
test('MailSystem.send should handle both success and failure', async (t) => {
    const mailSystem = new MailSystem();
    let originalRandom = Math.random;
    Math.random = () => 0.9; // 模擬發送成功
    assert.strictEqual(mailSystem.send('Alice', 'Congrats, Alice!'), true, 'Should send successfully');
    Math.random = () => 0.1; // 模擬發送失敗
    assert.strictEqual(mailSystem.send('Bob', 'Sorry, Bob!'), false, 'Should fail to send');
    Math.random = originalRandom; // 恢復原始 Math.random
});

// Application 類測試
test('Application should initialize and function correctly', async (t) => {
    await setup();

    // 確保使用 tempNameListPath 作為構造函數的參數
    const app = new Application(tempNameListPath);
    // 等待非同步操作完成
    await new Promise(resolve => setTimeout(resolve, 100));
    assert.strictEqual(app.people.length, 3, 'Should load 3 people');

    const selectedFirst = app.selectNextPerson();
    assert.ok(app.selected.includes(selectedFirst), 'Selected person should be in selected array');

    const selectedSecond = app.selectNextPerson();
    assert.ok(app.selected.includes(selectedSecond), 'Second selected person should be in selected array');
    assert.notStrictEqual(selectedFirst, selectedSecond, 'Should select different people');

    app.mailSystem.write = createMockFn(app.mailSystem.write);
    app.mailSystem.send = createMockFn(app.mailSystem.send);
    app.notifySelected();
    assert.strictEqual(app.mailSystem.write.calls.length, 2, 'write should be called for each selected person');
    assert.strictEqual(app.mailSystem.send.calls.length, 2, 'send should be called for each selected person');

    await teardown();
});