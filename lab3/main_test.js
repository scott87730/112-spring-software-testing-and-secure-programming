const { describe, it } = require('node:test');
const assert = require('assert');
const { Calculator } = require('./main');

// TODO: write your tests here
// <<<<<<< lab3
// 定義測試套件
describe('Calculator', () => {
    const calculator = new Calculator(); // 實例化計算器

    // 對exp方法進行參數化測試
    describe('exp method with parameterized tests', () => {
        // 測試案例集合
        const testCases = [
            { params: [1], expected: Math.exp(1) }, // 正常情況
            { params: ['string'], expected: /unsupported operand type/, error: true }, // 錯誤類型測試
            { params: [1000], expected: /overflow/, error: true }, // 溢出錯誤
            { params: [Number.MAX_VALUE], expected: /overflow/, error: true }, // 邊界值測試
        ];

        // 遍歷執行每個測試案例
        testCases.forEach(({ params, expected, error }) => {
            const input = params.join(', ');
            it(`exp with argument(s) ${input} ${error ? 'throws an error' : 'returns correct value'}`, () => {
                if (error) {
                    console.log(`測試輸入: ${input}，預期引發錯誤`); // 調試語句
                    assert.throws(() => calculator.exp(...params), expected); // 斷言應該拋出錯誤
                } else {
                    console.log(`測試輸入: ${input}，預期結果: ${expected}`); // 調試語句
                    assert.strictEqual(calculator.exp(...params), expected); // 斷言應該返回預期結果
                }
            });
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
// =======
// >>>>>>> 511559023
