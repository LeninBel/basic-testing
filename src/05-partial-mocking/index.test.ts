// Uncomment the code below and write your tests
import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

jest.mock('./index', () => {
  return {
    ...jest.requireActual('./index'),
    mockOne: jest.fn(),
    mockTwo: jest.fn(),
    mockThree: jest.fn(),
  };
});

describe('partial mocking', () => {
  afterAll(() => {
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    const consoleLogSpy = jest.spyOn(global.console, 'log');
    (mockOne as jest.Mock).mockImplementation(() => 1);
    (mockTwo as jest.Mock).mockImplementation(() => 2);
    (mockThree as jest.Mock).mockImplementation(() => 3);
    expect(mockOne()).toBe(1);
    expect(mockTwo()).toBe(2);
    expect(mockThree()).toBe(3);

    expect(consoleLogSpy).toHaveBeenCalledTimes(0);
  });

  test('unmockedFunction should log into console', () => {
    const consoleLogSpy = jest.spyOn(global.console, 'log');

    unmockedFunction();
    expect(consoleLogSpy).toHaveBeenCalledWith('I am not mocked');
  });
});
