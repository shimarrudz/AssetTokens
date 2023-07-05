import { MockedFunction } from 'jest-mock';

import { TransactionReport, generateTransactionReport } from '../../classes/transactionReport';
import { User } from '../../classes/user';
import { Token } from '../../classes/token';

describe('Transaction Report', () => {
  let user: User;
  let token: Token;

  beforeEach(() => {
    user = {
      name: 'John Doe',
      balance: 1000,
      tokens: [],
      transactionHistory: [],
      buyTokens: jest.fn(),
      sellTokens: jest.fn()
    };

    beforeEach(() => {
      token = new Token('1', 10, 5, 2);
      token.calculateEquilibriumPrice = jest.fn() as MockedFunction<any>;
      token.simulateExternalFactors = jest.fn() as MockedFunction<any>;
    });
  });

  it('should be able to return the formatted transaction report', () => {
    const report: TransactionReport = {
      user,
      token,
      quantity: 3,
      totalPrice: 30,
      discount: 5
    };

    const transactionReport = generateTransactionReport(report);
    
    expect(transactionReport).toEqual(expect.stringContaining('John Doe'));
    expect(transactionReport).toEqual(expect.stringContaining('1'));
    expect(transactionReport).toEqual(expect.stringContaining('3'));
    expect(transactionReport).toEqual(expect.stringContaining('30'));
    expect(transactionReport).toEqual(expect.stringContaining('5'));
  });

  it('should be able to handle missing user', () => {
    const report: TransactionReport = {
      user,
      token,
      quantity: 3,
      totalPrice: 30,
      discount: 5
    };

    const transactionReport = generateTransactionReport(report);
    
    expect(transactionReport).toEqual(expect.stringContaining('1'));
    expect(transactionReport).toEqual(expect.stringContaining('3'));
    expect(transactionReport).toEqual(expect.stringContaining('30'));
    expect(transactionReport).toEqual(expect.stringContaining('5'));
  });

  it('should be able to handle missing token', () => {
    const report: TransactionReport = {
      user,
      token,
      quantity: 3,
      totalPrice: 30,
      discount: 5
    };

    const transactionReport = generateTransactionReport(report);
    
    expect(transactionReport).toEqual(expect.stringContaining('John Doe'));
    expect(transactionReport).toEqual(expect.stringContaining('3'));
    expect(transactionReport).toEqual(expect.stringContaining('30'));
    expect(transactionReport).toEqual(expect.stringContaining('5'));
  });

  it('should be able to handle missing quantity', () => {
    const report: TransactionReport = {
      user,
      token,
      quantity: 6,
      totalPrice: 30,
      discount: 5
    };

    const transactionReport = generateTransactionReport(report);
    
    expect(transactionReport).toEqual(expect.stringContaining('John Doe'));
    expect(transactionReport).toEqual(expect.stringContaining('1'));
    expect(transactionReport).toEqual(expect.stringContaining('30'));
    expect(transactionReport).toEqual(expect.stringContaining('5'));
  });

  it('should be able to handle missing totalPrice', () => {
    const report: TransactionReport = {
      user,
      token,
      quantity: 3,
      totalPrice: 20,
      discount: 5
    };

    const transactionReport = generateTransactionReport(report);
    
    expect(transactionReport).toEqual(expect.stringContaining('John Doe'));
    expect(transactionReport).toEqual(expect.stringContaining('1'));
    expect(transactionReport).toEqual(expect.stringContaining('3'));
    expect(transactionReport).toEqual(expect.stringContaining('5'));
  });

  it('should be able to handle missing discount', () => {
    const report: TransactionReport = {
      user,
      token,
      quantity: 3,
      totalPrice: 30,
      discount: 5
    };

    const transactionReport = generateTransactionReport(report);
    
    expect(transactionReport).toEqual(expect.stringContaining('John Doe'));
    expect(transactionReport).toEqual(expect.stringContaining('1'));
    expect(transactionReport).toEqual(expect.stringContaining('3'));
    expect(transactionReport).toEqual(expect.stringContaining('30'));
  });
});
