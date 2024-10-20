import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';
import { random } from 'lodash';

jest.mock('lodash', () => {
  return {
    ...jest.requireActual('lodash'),
    random: jest.fn(),
  };
});

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const account = getBankAccount(123);
    expect(account.getBalance()).toBe(123);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(123);
    const expectedError = new InsufficientFundsError(123);
    expect(() => account.withdraw(124)).toThrowError(expectedError);
  });

  test('should throw error when transferring more than balance', () => {
    const account = getBankAccount(123);
    const anotherAccount = getBankAccount(124);
    const expectedError = new InsufficientFundsError(123);
    expect(() => account.transfer(124, anotherAccount)).toThrowError(
      expectedError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(123);
    const expectedError = new TransferFailedError();
    expect(() => account.transfer(124, account)).toThrowError(expectedError);
  });

  test('should deposit money', () => {
    const account = getBankAccount(123);
    const expectedAccount = getBankAccount(124);
    account.deposit(1);
    expect(account).toStrictEqual(expectedAccount);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(123);
    const expectedAccount = getBankAccount(122);
    account.withdraw(1);
    expect(account).toStrictEqual(expectedAccount);
  });

  test('should transfer money', () => {
    const account = getBankAccount(123);
    const anotherAccount = getBankAccount(0);
    const expectedAccount = getBankAccount(122);
    account.transfer(1, anotherAccount);
    expect(account).toStrictEqual(expectedAccount);
    expect(anotherAccount.getBalance()).toBe(1);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    (random as jest.Mock).mockReturnValue(33);
    const account = getBankAccount(123);
    account.fetchBalance().then((res) => {
      expect(typeof res).toBe('number');
    });
  });

  test('should set new balance if fetchBalance returned number', async () => {
    (random as jest.Mock).mockReturnValue(33);
    const account = getBankAccount(123);
    const expectedAccount = getBankAccount(33);
    account
      .synchronizeBalance()
      .then(() => expect(account).toStrictEqual(expectedAccount));
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    (random as jest.Mock).mockReturnValue(0);
    const account = getBankAccount(123);
    account
      .synchronizeBalance()
      .then(() => {
        throw new Error('false positive');
      })
      .catch((er) =>
        expect(er).toStrictEqual(new SynchronizationFailedError()),
      );
  });
});
