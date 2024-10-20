import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const value = 1;
    resolveValue(value).then((res) => expect(res).toBe(value));
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const error = new Error('test');
    expect(() => throwError('test')).toThrow(error);
  });

  test('should throw error with default message if message is not provided', () => {
    const error = new Error('Oops!');
    expect(() => throwError()).toThrow(error);
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    const error = new MyAwesomeError();
    expect(() => throwCustomError()).toThrow(error);
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    const error = new MyAwesomeError();
    try {
      await rejectCustomError();
    } catch (err) {
      expect(err).toStrictEqual(error);
    }
  });
});
