const { describe, it } = require('node:test');
const assert = require('assert');
const { Calculator } = require('./main');

// TODO: write your tests here

describe('Calculator', function() {
  const calculator = new Calculator();

  // 定義針對 exp 功能的測試組合
  describe('#exp()', function() {
    // 針對預期正確的參數測試
    const testCasesExp = [
      { input: 1.618, expected: Math.exp(1.618) }, // 黃金分割率
      { input: 0, expected: Math.exp(0) },
      { input: -1, expected: Math.exp(-1) }
    ];

    // for 進行測試
    testCasesExp.forEach(({ input, expected }) => {
      it(`should correctly calculate exp(${input})`, function() {
        assert.strictEqual(calculator.exp(input), expected);
      });
    });

    // 用 RE 針對預期錯誤的參數測試
    const errorCasesExp = [
      { input: 'string', message: /unsupported operand type/ },
      { input: Infinity, message: /unsupported operand type/ },
      { input: 123456789, message: /overflow/ }
    ];

    // for 進行測試
    errorCasesExp.forEach(({ input, message }) => {
      it(`should throw error for exp(${input})`, function() {
        assert.throws(() => calculator.exp(input), message);
      });
    });
  });

  // 定義針對 log 功能的測試組合
  describe('#log()', function() {
    // 針對預期正確的參數測試
    const testCasesLog = [
      { input: Math.E, expected: 1 },
      { input: 1, expected: Math.log(1) },
      { input: 3.141592653, expected: Math.log(3.141592653) } // π 
    ];

    // for 進行測試
    testCasesLog.forEach(({ input, expected }) => {
      it(`should correctly calculate log(${input})`, function() {
        assert.strictEqual(calculator.log(input), expected);
      });
    });

    // 用 RE 針對預期錯誤的參數測試
    const errorCasesLog = [
      { input: 'string', message: /unsupported operand type/ },
      { input: 0, message: /math domain error \(1\)/ },
      { input: -1, message: /math domain error \(2\)/ }
    ];

    // for 進行測試
    errorCasesLog.forEach(({ input, message }) => {
      it(`should throw error for log(${input})`, function() {
        assert.throws(() => calculator.log(input), message);
      });
    });
  });
});
