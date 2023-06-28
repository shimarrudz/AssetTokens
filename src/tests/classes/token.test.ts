import { Token, createToken, calculateDiscount } from '../../classes/token';

describe('Token', () => {
  test('should be able to return a new Token instance', () => {
    const token = createToken();
    expect(token).toBeInstanceOf(Token);
  });

  test('should be able to return the correct equilibrium price', () => {
    const token = new Token('1', 10, 5, 2);
    const equilibriumPrice = token.calculateEquilibriumPrice();
    expect(equilibriumPrice).toBe(15);
  });

  test('should be able update the token value within the valid range', () => {
    const token = new Token('1', 10, 5, 2);
    token.simulateExternalFactors();
    expect(token.value).toBeGreaterThanOrEqual(8);
    expect(token.value).toBeLessThanOrEqual(12);
  });

  test('should be able return the correct discount amount', () => {
    const quantity = 10;
    const discount = calculateDiscount(quantity);
    expect(discount).toBe(50);
  });
});
