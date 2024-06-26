const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const { Application, MailSystem } = require('./main');
const Jasmine = require('jasmine');
const jasmine = new Jasmine();

describe('MailSystem', () => {
    let mailSystem;

    beforeEach(() => {
        mailSystem = new MailSystem();
    });

    it('should write mail with correct context', () => {
        const name = 'John Doe';
        const context = mailSystem.write(name);
        expect(context).toBe('Congrats, ' + name + '!');
    });

    it('should send mail successfully', () => {
        spyOn(console, 'log');
        spyOn(Math, 'random').and.returnValue(0.6); // Mocking Math.random to always return a value > 0.5
        const success = mailSystem.send('John Doe', 'Congrats, John Doe!');
        expect(success).toBe(true);
        expect(console.log).toHaveBeenCalledWith('mail sent');
    });

    it('should fail to send mail', () => {
        spyOn(console, 'log');
        spyOn(Math, 'random').and.returnValue(0.4); // Mocking Math.random to always return a value <= 0.5
        const success = mailSystem.send('John Doe', 'Congrats, John Doe!');
        expect(success).toBe(false);
        expect(console.log).toHaveBeenCalledWith('mail failed');
    });
});

describe('Application', () => {
    let app;
    let mockReadFile;

    beforeEach(() => {
        mockReadFile = spyOn(util, 'promisify').and.returnValue(jasmine.createSpy().and.returnValue(Promise.resolve('John Doe\nJane Doe\n')));
        app = new Application();
    });

    it('should get names from file', async () => {
        const [people, selected] = await app.getNames();
        expect(people).toEqual(['John Doe', 'Jane Doe']);
        expect(selected).toEqual([]);
    });

    it('should select a random person', async () => {
        await app.getNames();
        spyOn(Math, 'random').and.returnValue(0.5); // Mocking Math.random
        const person = app.getRandomPerson();
        expect(person).toBe('Jane Doe');
    });

    it('should select next person', async () => {
        await app.getNames();
        const person = app.selectNextPerson();
        expect(person).toBe('John Doe');
        expect(app.selected).toEqual(['John Doe']);
    });

    it('should notify selected people', async () => {
        await app.getNames();
        app.selectNextPerson();
        spyOn(app.mailSystem, 'write').and.callThrough();
        spyOn(app.mailSystem, 'send').and.callThrough();
        spyOn(console, 'log');
        app.notifySelected();
        expect(app.mailSystem.write).toHaveBeenCalledWith('John Doe');
        expect(app.mailSystem.send).toHaveBeenCalledWith('John Doe', 'Congrats, John Doe!');
    });
});

jasmine.execute();
