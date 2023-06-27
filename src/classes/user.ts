import { Token } from './token';
import { TransactionReport } from './transactionReport';
import { calculateDiscount } from './token';
import { ERROR_MESSAGES } from '../constants/constants';

export class User {
  name: string;
  balance: number;
  tokens: Token[];

  constructor(name: string, initialBalance: number) {
    this.name = name;
    this.balance = initialBalance;
    this.tokens = [];
  }

  buyTokens(token: Token, quantity: number): TransactionReport {
    const totalPrice = token.value * quantity * token.demand;

    if (this.balance < totalPrice) {
      throw new Error(ERROR_MESSAGES.INSUFFICIENT_BALANCE);
    }

    if (token.quantity < quantity) {
      throw new Error(ERROR_MESSAGES.UNAVAILABLE_QUANTITY);
    }

    const discount = calculateDiscount(quantity);
    const discountedPrice = totalPrice - discount;
    this.balance -= discountedPrice;
    token.quantity -= quantity;
    this.tokens.push(token);

    const report: TransactionReport = {
      user: this,
      token,
      quantity,
      totalPrice: discountedPrice,
      discount,
    };

    return report;
  }
}
