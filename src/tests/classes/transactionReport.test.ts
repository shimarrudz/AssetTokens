import { TransactionReport, generateTransactionReport } from '../../classes/transactionReport';
import { User } from '../../classes/user';
import { Token } from '../../classes/token';

describe('TransactionReport', () => {
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

    token = {
      id: '1',
      value: 10,
      quantity: 5,
      demand: 2,
      calculateEquilibriumPrice: jest.fn(),
      simulateExternalFactors: jest.fn()
    };
  });

  test('should be able to return the formatted transaction report', () => {
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

  test('should be able to handle missing user', () => {
    const report: TransactionReport = {
      user,
      token,
      quantity: 3,
      totalPrice: 30,
      discount: 5
    };

    const transactionReport = generateTransactionReport(report);
    
    expect(transactionReport).toEqual(expect.stringContaining('Unknown User'));
    expect(transactionReport).toEqual(expect.stringContaining('1'));
    expect(transactionReport).toEqual(expect.stringContaining('3'));
    expect(transactionReport).toEqual(expect.stringContaining('30'));
    expect(transactionReport).toEqual(expect.stringContaining('5'));
  });

  test('should be able to handle missing token', () => {
    const report: TransactionReport = {
      user,
      token,
      quantity: 3,
      totalPrice: 30,
      discount: 5
    };

    const transactionReport = generateTransactionReport(report);
    
    expect(transactionReport).toEqual(expect.stringContaining('John Doe'));
    expect(transactionReport).toEqual(expect.stringContaining('Unknown Token'));
    expect(transactionReport).toEqual(expect.stringContaining('3'));
    expect(transactionReport).toEqual(expect.stringContaining('30'));
    expect(transactionReport).toEqual(expect.stringContaining('5'));
  });

  test('should be able to handle missing quantity', () => {
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
    expect(transactionReport).toEqual(expect.stringContaining('Unknown Quantity'));
    expect(transactionReport).toEqual(expect.stringContaining('30'));
    expect(transactionReport).toEqual(expect.stringContaining('5'));
  });

  test('should be able to handle missing totalPrice', () => {
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
    expect(transactionReport).toEqual(expect.stringContaining('Unknown Price'));
    expect(transactionReport).toEqual(expect.stringContaining('5'));
  });

  test('should be able to handle missing discount', () => {
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
    expect(transactionReport).toEqual(expect.stringContaining('No Discount'));
  });
});
