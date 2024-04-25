const test = require('node:test');
const assert = require('assert');
const { MyClass, Student } = require('./main');

// 測試 MyClass 的 addStudent 方法
test("Test MyClass's addStudent", async (t) => {
    const myClass = new MyClass();
    const student = new Student();
    student.setName("John Doe");
    
    const addedStudentId = myClass.addStudent(student);
    assert.strictEqual(addedStudentId, 0, "應該將學生加入並返回正確的索引");
    
    const nonStudent = {}; // 模擬非 Student 實例
    const nonStudentId = myClass.addStudent(nonStudent);
    assert.strictEqual(nonStudentId, -1, "非 Student 實例不應該被添加");
});

// 測試 MyClass 的 getStudentById 方法
test("Test MyClass's getStudentById", async (t) => {
    const myClass = new MyClass();
    const student = new Student();
    student.setName("Jane Doe");
    myClass.addStudent(student);

    const retrievedStudent = myClass.getStudentById(0);
    assert.strictEqual(retrievedStudent.getName(), "Jane Doe", "應該返回正確的學生名稱");

    const invalidStudent = myClass.getStudentById(-1);
    assert.strictEqual(invalidStudent, null, "無效索引應該返回 null");
});

// 測試 Student 的 setName 方法
test("Test Student's setName", async (t) => {
    const student = new Student();
    student.setName("John Smith");
    assert.strictEqual(student.name, "John Smith", "setName 應該正確設置學生名稱");

    student.setName(123); // 嘗試用非字符串設置名稱
    assert.notStrictEqual(student.name, 123, "setName 應該忽略非字符串值");
});

// 測試 Student 的 getName 方法
test("Test Student's getName", async (t) => {
    const student = new Student();
    assert.strictEqual(student.getName(), '', "未設置名稱時應返回空字符串");

    student.setName("Doe Jane");
    assert.strictEqual(student.getName(), "Doe Jane", "getName 應返回設置的學生名稱");
});
