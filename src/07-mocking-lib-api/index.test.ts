import { throttledGetDataFromApi } from './index';

import axios from 'axios';
jest.mock('axios');

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  test('should create instance with provided base url', async () => {
    const mockedGet = jest
      .fn()
      .mockReturnValue(Promise.resolve({ data: '124' }));
    (axios.create as jest.Mock).mockImplementation(() => ({ get: mockedGet }));
    await throttledGetDataFromApi('test');
    expect(axios.create).toBeCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    jest.advanceTimersByTime(5001);
    const mockedGet = jest
      .fn()
      .mockReturnValue(Promise.resolve({ data: '124' }));
    (axios.create as jest.Mock).mockImplementation(() => ({ get: mockedGet }));
    throttledGetDataFromApi('test');
    expect(mockedGet).toBeCalledWith('test');
  });

  test('should return response data', async () => {
    jest.advanceTimersByTime(5000);
    const mockedGet = jest
      .fn()
      .mockReturnValue(Promise.resolve({ data: '124' }));
    (axios.create as jest.Mock).mockReturnValue({ get: mockedGet });
    await throttledGetDataFromApi('test')?.then((res) =>
      expect(res).toBe('124'),
    );
  });
});
