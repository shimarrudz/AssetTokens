import { User } from './user';
import { Token } from './token';
import { formatCurrency } from '../helpers/functions';

export interface TransactionReport {
  user: User;
  token: Token;
  quantity: number;
  totalPrice: number;
  discount: number;
}

export function generateTransactionReport(report: TransactionReport): string {
  const { user, token, quantity, totalPrice, discount } = report;

  const formattedTotalPrice = formatCurrency(totalPrice);
  const formattedDiscount = formatCurrency(discount);

  const reportString = `
    --- Relatório de Transação ---
    Usuário: ${user.name}
    Token: ${token.id}
    Quantidade: ${quantity}
    Valor Total: ${formattedTotalPrice}
    Desconto: ${formattedDiscount}
  `;

  return reportString;
}
