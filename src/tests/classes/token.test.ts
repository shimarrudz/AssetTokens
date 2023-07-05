import { Token, createToken, calculateDiscount } from '../../classes/token';

describe('Tokens functions', () => {
    describe('Testing the instance of Token generation', () => {
      it('should be able to return the correct equilibrium price', () => {
        const token = new Token('1', 10, 5, 2);
        const equilibriumPrice = token.calculateEquilibriumPrice();
        expect(equilibriumPrice).toBe(15);
      });
    });

    describe('Testing the external factors on tokens', () => {
      it('should be able update the token value within the valid range', () => {
        const token = new Token('1', 10, 5, 2);
        token.simulateExternalFactors();
        expect(token.value).toBeGreaterThanOrEqual(8);
        expect(token.value).toBeLessThanOrEqual(12);
      });

      it('should not allow the token value to exceed 100', () => {
        const token = new Token('1', 90, 5, 2);
        token.simulateExternalFactors();
        expect(token.value).toBeLessThanOrEqual(100);
      });
    });


    describe('Testing the precision of discounts on Tokens', () => {
      it('should be able return the correct discount amount', () => {
        const quantity = 10;
        const discount = calculateDiscount(quantity);
        expect(discount).toBe(50);
      });
    });
});