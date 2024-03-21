const test = require('node:test');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { Application, MailSystem } = require('./main');

// 輔助函數：創建模擬函數
// Mock Object
function createMockFn(originalFn) {
    const mockFn = function(...args) {
        mockFn.calls.push(args); // 添加調試語句，紀錄函數被呼叫的參數
        return originalFn.apply(this, args);
    };
    mockFn.calls = []; // 初始化呼叫記錄
    return mockFn;
}

// 暫時文件路徑
// Test Stub
const tempNameListPath = path.join(__dirname, 'name_list.txt');

async function setup() {
    fs.writeFileSync(tempNameListPath, 'Pan\nLuan\nRobert');
}

async function teardown() {
    fs.unlinkSync(tempNameListPath);
}

// MailSystem.write 測試
// Test Spy
test('MailSystem.write should return correct context', async (t) => {
    const mailSystem = new MailSystem();
    assert.strictEqual(mailSystem.write('Pan'), 'Congrats, Pan!');
    assert.strictEqual(mailSystem.write(null), 'Congrats, null!', 'Should handle null');
    assert.strictEqual(mailSystem.write(123), 'Congrats, 123!', 'Should handle numbers');
});

// MailSystem.send 測試
test('MailSystem.send should handle both success and failure', async (t) => {
    const mailSystem = new MailSystem();
    let originalRandom = Math.random; // 保存原始的 Math.random 函數
    Math.random = () => 0.9; // 模擬發送成功
    assert.strictEqual(mailSystem.send('Pan', 'Congrats, Pan!'), true, 'Should send successfully');
    Math.random = () => 0.1; // 模擬發送失敗
    assert.strictEqual(mailSystem.send('Luan', 'Sorry, Luan!'), false, 'Should fail to send');
    Math.random = originalRandom; // 恢復原始 Math.random 函數
});

// Application 類測試
test('Application should initialize and function correctly', async (t) => {
    await setup();

    const app = new Application(tempNameListPath);
    await new Promise(resolve => setTimeout(resolve, 100)); // 等待非同步操作完成
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


test('Application should return null when all are selected', async (t) => {
    await setup();

    const app = new Application(tempNameListPath);
    await new Promise(resolve => setTimeout(resolve, 100)); // 等待非同步操作完成

    // 選擇所有人
    app.selectNextPerson();
    app.selectNextPerson();
    app.selectNextPerson(); // 這裡保證所有的人都已經被選中
    // 再次調用 selectNextPerson 應該返回 null，並在控制台中列印 "all selected"
    const result = app.selectNextPerson();
    assert.strictEqual(result, null, 'Should return null when all are selected');

    await teardown();
});

