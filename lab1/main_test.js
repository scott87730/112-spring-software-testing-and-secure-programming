const test = require('node:test');
const assert = require('assert');
const { MyClass, Student } = require('./main');

// 测试 MyClass 的 addStudent 方法
test("Test MyClass's addStudent", async () => {
    const myClass = new MyClass();
    const student = new Student();
    student.setName('John Doe');
    const index = myClass.addStudent(student);
    assert.strictEqual(index, 0); // 第一个学生的索引应该是 0
});

// 测试 MyClass 的 getStudentById 方法
test("Test MyClass's getStudentById", async () => {
    const myClass = new MyClass();
    const student = new Student();
    student.setName('John Doe');
    const index = myClass.addStudent(student);

    // 有效的 ID
    const retrievedStudent = myClass.getStudentById(index);
    assert.strictEqual(retrievedStudent, student);

    // 无效的 ID
    const invalidRetrieval = myClass.getStudentById(-1);
    assert.strictEqual(invalidRetrieval, null);
});

// 测试 Student 的 setName 方法
test("Test Student's setName", async () => {
    const student = new Student();

    // 有效的名称
    student.setName('Jane Doe');
    assert.strictEqual(student.getName(), 'Jane Doe');

    // 无效的名称（非字符串）
    student.setName(123);
    assert.notStrictEqual(student.getName(), 123); // 名称不应该设置为一个数字
});

// 测试 Student 的 getName 方法
test("Test Student's getName", async () => {
    const student = new Student();

    // 名称未设置
    assert.strictEqual(student.getName(), ''); // 应该返回一个空字符串

    // 名称已设置
    student.setName('Jane Doe');
    assert.strictEqual(student.getName(), 'Jane Doe');
});

// 测试 MyClass 的 removeStudent 方法
test("Test MyClass's removeStudent", async () => {
    const myClass = new MyClass();
    const student = new Student();
    student.setName('John Doe');
    const index = myClass.addStudent(student);

    // 移除学生
    const removedStudent = myClass.removeStudent(index);
    assert.strictEqual(removedStudent, student);

    // 尝试移除不存在的学生
    const result = myClass.removeStudent(999);
    assert.strictEqual(result, null);
});

// 添加更多测试用例以覆盖你预期的所有场景和边界情况
