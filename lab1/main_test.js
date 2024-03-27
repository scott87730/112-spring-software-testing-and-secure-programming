const test = require('node:test');
const assert = require('assert');
const { MyClass, Student } = require('./main');

test("Test MyClass's addStudent", async () => {
    const myClass = new MyClass();
    const student = new Student();
    student.setName('John Doe');
    const index = myClass.addStudent(student);
    assert.strictEqual(index, 0); // The first student should have an index of 0
});

test("Test MyClass's getStudentById", async () => {
    const myClass = new MyClass();
    const student = new Student();
    student.setName('John Doe');
    const index = myClass.addStudent(student);
    
    // Valid ID
    const retrievedStudent = myClass.getStudentById(index);
    assert.strictEqual(retrievedStudent, student);
    
    // Invalid ID
    const invalidRetrieval = myClass.getStudentById(-1);
    assert.strictEqual(invalidRetrieval, null);
});

test("Test Student's setName", async () => {
    const student = new Student();
    
    // Valid name
    student.setName('Jane Doe');
    assert.strictEqual(student.getName(), 'Jane Doe');
    
    // Invalid name (not a string)
    student.setName(123);
    assert.notStrictEqual(student.getName(), 123); // Should not set name to a number
});

test("Test Student's getName", async () => {
    const student = new Student();
    
    // Name not set
    assert.strictEqual(student.getName(), ''); // Should return an empty string
    
    // Name set
    student.setName('Jane Doe');
    assert.strictEqual(student.getName(), 'Jane Doe');
});
