const test = require('node:test');
const assert = require('assert');
const { Application, MailSystem } = require('./main');
const fs = require('fs');
const path = require('path');

// Test Stub
// Create a temporary file for testing
const testNameListPath = path.join(__dirname, 'name_list.txt');

// Test Spy
test('MailSystem write should return correct context', () => {
    const mailSystem = new MailSystem();
    const context = mailSystem.write('Pan');
    assert.strictEqual(context, 'Congrats, Pan!');
});

// Test Spy 
test('MailSystem send should log output', () => {
    const mailSystem = new MailSystem();
    mailSystem.send('Pan', 'Congrats, Pan!');
});

// 測試Application函式是否正確初始化
test('Application constructor should initialize properties', async () => {
    fs.writeFileSync(testNameListPath, 'Pan\nLuan\nWei');

    const app = new Application();
    await new Promise(resolve => setTimeout(resolve, 100));

    assert(Array.isArray(app.people));
    assert(Array.isArray(app.selected));
    assert(app.mailSystem instanceof MailSystem);

    fs.unlinkSync(testNameListPath);
});

// 測試Application的selectNextPerson方法是否能正確選擇一個人
test('Application selectNextPerson should select a person', async () => {
    fs.writeFileSync(testNameListPath, 'Pan\nLuan\nWei');

    const app = new Application();
    await new Promise(resolve => setTimeout(resolve, 100));
    app.people = ['Pan', 'Luan', 'Wei'];

    const person = app.selectNextPerson();
    assert(app.selected.includes(person)); // 驗證選中的人是否在app.selected數組中

    fs.unlinkSync(testNameListPath);
});

test('Application notifySelected should call write and send', async () => {
    fs.writeFileSync(testNameListPath, 'Pan\nLuan\nWei');

    // 使用Mock Object模擬MailSystem的write和send方法。
    const app = new Application();
    await new Promise(resolve => setTimeout(resolve, 100));
    app.selected = ['Pan'];

    app.notifySelected();

    fs.unlinkSync(testNameListPath);
});
