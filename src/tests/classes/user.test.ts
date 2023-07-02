import { User } from '../../classes/user';
import { Token } from '../../classes/token';
import { ERROR_MESSAGES } from '../../constants/constants';

describe('Tests of user functions', () => {
  let user: User;
  let token: Token;

  beforeEach(() => {
    user = new User('John Doe', 1000);
    token = new Token('1', 10, 5, 2);
  });

  describe('buyTokens', () => {
    test('should be able to purchase tokens and update user balance', () => {
      const initialBalance = user.balance;
      const initialTokenQuantity = token.quantity;

      const quantity = 3;
      const report = user.buyTokens(token, quantity);

      expect(user.balance).toBe(initialBalance - (token.value * quantity * token.demand));
      expect(token.quantity).toBe(initialTokenQuantity - quantity);
      expect(user.tokens).toContainEqual(expect.objectContaining({ id: '1', quantity }));

      expect(report.user).toBe(user);
      expect(report.token).toEqual(expect.objectContaining({ id: '1', quantity }));
      expect(report.totalPrice).toBe(token.value * quantity * token.demand - 0);
      expect(report.discount).toBe(0);
    });

    test('should be able to handle insufficient balance', () => {
      const quantity = 3;
      user.balance = 0;

      const consoleLogSpy = jest.spyOn(console, 'log');
      consoleLogSpy.mockImplementation();

      const report = user.buyTokens(token, quantity);

      expect(consoleLogSpy).toHaveBeenCalledWith(ERROR_MESSAGES.INSUFFICIENT_BALANCE);
      expect(user.balance).toBe(-45);
      expect(token.quantity).toBe(-5);
      expect(user.tokens).toHaveLength(0);
      expect(report).toBeUndefined();

      consoleLogSpy.mockRestore();
    });

    test('should be able to handle unavailable token quantity', () => {
      const quantity = 10;

      const consoleLogSpy = jest.spyOn(console, 'log');
      consoleLogSpy.mockImplementation();

      const report = user.buyTokens(token, quantity);

      expect(consoleLogSpy).toHaveBeenCalledWith(ERROR_MESSAGES.UNAVAILABLE_QUANTITY);
      expect(user.balance).toBe(850);
      expect(token.quantity).toBe(5);
      expect(user.tokens).toHaveLength(0);
      expect(report).toBeUndefined();

      consoleLogSpy.mockRestore();
    });
  });

  describe('sellTokens', () => {
    beforeEach(() => {
      user.tokens = [
        new Token('1', 10, 3, 2),
        new Token('1', 10, 2, 2),
      ];
    });

    test('should be able to sell tokens and update user balance', () => {
      const initialBalance = user.balance;
      const initialTokenDemand = token.demand;

      const quantity = 2;
      const report = user.sellTokens(token, quantity);

      expect(user.balance).toBe(initialBalance);
      expect(token.demand).toBe(initialTokenDemand - quantity);
      expect(user.tokens).toHaveLength(1);
      expect(user.tokens).not.toContainEqual(expect.objectContaining({ id: '1', quantity }));

      expect(report.user).toBe(user);
      expect(report.token).toBe(token);
      expect(report.quantity).toBe(quantity);
      expect(report.totalPrice).toBe(token.value * quantity * token.demand);
      expect(report.discount).toBe(0);
    });

    test('should be able to handle unavailable token quantity', () => {
      const quantity = 2;

      const consoleLogSpy = jest.spyOn(console, 'log');
      consoleLogSpy.mockImplementation();

      const report = user.sellTokens(token, quantity);

      expect(consoleLogSpy).toHaveBeenCalledWith(ERROR_MESSAGES.UNAVAILABLE_QUANTITY);
      expect(user.balance).toBe(1000);
      expect(token.demand).toBe(0);
      expect(user.tokens).toHaveLength(2);
      expect(report).toBeUndefined();

      consoleLogSpy.mockRestore();
    });
  });
});
