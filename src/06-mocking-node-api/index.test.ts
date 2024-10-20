import { doStuffByTimeout, doStuffByInterval, readFileAsynchronously } from '.';
import { existsSync } from 'fs';
import { join } from 'path';
import { readFile } from 'fs/promises';

jest.mock('path', () => {
  return {
    ...jest.requireActual('path'),
    join: jest.fn(),
  };
});

jest.mock('fs/promises', () => {
  return {
    ...jest.requireActual('fs/promises'),
    readFile: jest.fn(),
  };
});

jest.mock('fs', () => {
  return {
    ...jest.requireActual('fs'),
    existsSync: jest.fn(),
  };
});

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    const cb = () => 2;

    doStuffByTimeout(cb, 2000);

    expect(setTimeoutSpy).toHaveBeenCalledWith(cb, 2000);
  });

  test('should call callback only after timeout', () => {
    const cb = jest.fn();

    doStuffByTimeout(cb, 2000);
    expect(cb).not.toHaveBeenCalled();

    jest.runAllTimers();

    expect(cb).toHaveBeenCalled();
    expect(cb).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const setTimeoutSpy = jest.spyOn(global, 'setInterval');
    const cb = () => 2;

    doStuffByInterval(cb, 2000);

    expect(setTimeoutSpy).toHaveBeenCalledWith(cb, 2000);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const cb = jest.fn();

    doStuffByInterval(cb, 2000);
    expect(cb).not.toHaveBeenCalled();

    jest.advanceTimersByTime(6000);

    expect(cb).toHaveBeenCalled();
    expect(cb).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    readFileAsynchronously('leni_test');
    expect((join as jest.Mock).mock.calls[0]).toContain('leni_test');
  });

  test('should return null if file does not exist', async () => {
    (existsSync as jest.Mock).mockReturnValue(false);

    readFileAsynchronously('test').then((res) => expect(res).toBeNull());
  });

  test('should return file content if file exists', async () => {
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockReturnValue(Promise.resolve('123'));

    readFileAsynchronously('test')
      .then((res) => expect(res).toBe('123'))
      .catch(() => {
        throw new Error('false positive');
      });
  });
});
