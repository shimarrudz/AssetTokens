import { Token } from './token';
import { TransactionReport } from './transactionReport';
import { calculateDiscount } from './token';
import { ERROR_MESSAGES } from '../constants/constants';

export class User {
  name: string;
  balance: number;
  tokens: Token[];
  transactionHistory: TransactionReport[];

  constructor(name: string, initialBalance: number) {
    this.name = name;
    this.balance = initialBalance;
    this.tokens = [];
    this.transactionHistory = [];
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
  
    const purchasedToken = new Token(token.id, token.value, quantity, token.demand);
  
    this.tokens.push(purchasedToken);
  
    const report: TransactionReport = {
      user: this,
      token: purchasedToken,
      quantity,
      totalPrice: discountedPrice,
      discount,
    };
  
    token.demand += quantity;
  
    this.transactionHistory.push(report);
  
    return report;
  }
  

  sellTokens(token: Token, quantity: number): TransactionReport {
    const userTokens = this.tokens.filter((t)=> token.id === token.id);
    if (userTokens.length < quantity) {
      throw new Error(ERROR_MESSAGES.UNAVAILABLE_QUANTITY)
    } 

    const soldTokens = userTokens.slice(0, quantity);
    this.tokens = this.tokens.filter((t) => !soldTokens.includes(t));


    const totalPrice = token.value * quantity * token.demand;

    const report: TransactionReport = {
      user: this,
      token,
      quantity,
      totalPrice,
      discount: 0,
    };

    token.demand -= quantity;

    this.transactionHistory.push(report);

    return report;
  }
}
