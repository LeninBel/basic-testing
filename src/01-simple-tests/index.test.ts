import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    expect(simpleCalculator({ a: 1, b: 1, action: Action.Add })).toBe(2);
  });

  test('should subtract two numbers', () => {
    expect(simpleCalculator({ a: 1, b: 1, action: Action.Subtract })).toBe(0);
  });

  test('should multiply two numbers', () => {
    expect(simpleCalculator({ a: 2, b: 2, action: Action.Multiply })).toBe(4);
  });

  test('should divide two numbers', () => {
    expect(simpleCalculator({ a: 6, b: 2, action: Action.Divide })).toBe(3);
  });

  test('should exponentiate two numbers', () => {
    expect(simpleCalculator({ a: 3, b: 3, action: Action.Exponentiate })).toBe(
      27,
    );
  });

  test('should return null for invalid action', () => {
    expect(simpleCalculator({ a: 3, b: 3, action: 'test' })).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    expect(simpleCalculator({ a: 3, b: '3', action: Action.Add })).toBeNull();
  });
});
