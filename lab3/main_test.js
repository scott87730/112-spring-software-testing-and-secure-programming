const { Calculator } = require('./main');
const Jasmine = require('jasmine');
const jasmine = new Jasmine();

describe('Calculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new Calculator();
    });

    describe('exp function', () => {
        it('should correctly calculate the exponential of valid numbers', () => {
            expect(calculator.exp(1)).toBeCloseTo(Math.exp(1));
            expect(calculator.exp(0)).toBeCloseTo(1);
            expect(calculator.exp(-1)).toBeCloseTo(Math.exp(-1));
        });

        it('should throw an error for non-finite inputs', () => {
            expect(() => calculator.exp(Infinity)).toThrowError('unsupported operand type');
            expect(() => calculator.exp(-Infinity)).toThrowError('unsupported operand type');
            expect(() => calculator.exp(NaN)).toThrowError('unsupported operand type');
        });

        it('should throw an overflow error for large inputs', () => {
            expect(() => calculator.exp(1000)).toThrowError('overflow');
        });
    });

    describe('log function', () => {
        it('should correctly calculate the logarithm of valid numbers', () => {
            expect(calculator.log(1)).toBeCloseTo(Math.log(1));
            expect(calculator.log(Math.E)).toBeCloseTo(1);
            expect(calculator.log(10)).toBeCloseTo(Math.log(10));
        });

        it('should throw an error for non-finite inputs', () => {
            expect(() => calculator.log(Infinity)).toThrowError('unsupported operand type');
            expect(() => calculator.log(-Infinity)).toThrowError('unsupported operand type');
            expect(() => calculator.log(NaN)).toThrowError('unsupported operand type');
        });

        it('should throw a math domain error for invalid domain inputs', () => {
            expect(() => calculator.log(-1)).toThrowError('math domain error (2)');
            expect(() => calculator.log(0)).toThrowError('math domain error (1)');
        });
    });
});

jasmine.execute();

