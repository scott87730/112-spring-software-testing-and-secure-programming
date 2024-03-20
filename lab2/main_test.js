const test = require('node:test');
const assert = require('assert');
const { Application, MailSystem } = require('./main');
const fs = require('fs');
const path = require('path');

// Create a temporary file for testing
const testNameListPath = path.join(__dirname, 'name_list.txt');

// Helper function for creating mock functions
function createMockFn(originalFn) {
    const mockFn = function(...args) {
        mockFn.calls.push(args);
        return originalFn.apply(this, args);
    };
    mockFn.calls = [];
    return mockFn;
}

// Test for MailSystem.write
test('MailSystem write should return correct context', async (t) => {
    const mailSystem = new MailSystem();
    assert.strictEqual(mailSystem.write('Pan'), 'Congrats, Pan!');
    assert.strictEqual(mailSystem.write(null), 'Congrats, null!', 'Should handle null');
    assert.strictEqual(mailSystem.write(123), 'Congrats, 123!', 'Should handle numbers');
});

// Test for MailSystem.send
test('MailSystem send should handle both success and failure', async (t) => {
    const mailSystem = new MailSystem();
    let originalRandom = Math.random;
    Math.random = () => 0.9; // Simulate success
    assert.strictEqual(mailSystem.send('Pan', 'Congrats, Pan!'), true, 'Should send successfully');
    Math.random = () => 0.1; // Simulate failure
    assert.strictEqual(mailSystem.send('Luan', 'Sorry, Luan!'), false, 'Should fail to send');
    Math.random = originalRandom; // Restore original Math.random
});

// Test for Application constructor
test('Application constructor should initialize properties correctly', async (t) => {
    fs.writeFileSync(testNameListPath, 'Pan\nLuan\nWei');
    const app = new Application(testNameListPath);
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate async operation
    assert.strictEqual(app.people.length, 3, 'Should load 3 people');
    assert.strictEqual(app.selected.length, 0, 'Selected should be empty initially');
    fs.unlinkSync(testNameListPath);
});

// Test for Application.selectNextPerson
test('Application selectNextPerson should select a person correctly', async (t) => {
    fs.writeFileSync(testNameListPath, 'Pan\nLuan\nWei');
    const app = new Application(testNameListPath);
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate async operation
    const person = app.selectNextPerson();
    assert.ok(app.selected.includes(person), 'Selected person should be in selected array');
    fs.unlinkSync(testNameListPath);
});

// Test for Application.notifySelected
test('Application notifySelected should call write and send for each selected person', async (t) => {
    fs.writeFileSync(testNameListPath, 'Pan\nLuan\nWei');

    const app = new Application(testNameListPath);
    await new Promise(resolve => setTimeout(resolve, 100));
    app.selected = ['Pan', 'Luan'];

    app.mailSystem.write = createMockFn((name) => `Mocked write for ${name}`);
    app.mailSystem.send = createMockFn((name, context) => {
        console.log(`Mocked send for ${name} with context: ${context}`);
        return true;
    });

    app.notifySelected();

    assert.strictEqual(app.mailSystem.send.calls.length, 2, 'send should be called twice');
    assert.strictEqual(app.mailSystem.write.calls.length, 2, 'write should be called twice');

    fs.unlinkSync(testNameListPath);
});
