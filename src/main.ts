import { User } from './classes/user';
import { createToken } from './classes/token';
import { generateTransactionReport } from './classes/transactionReport';
import { formatCurrency, getUserInput, getPositiveNumberInput, getQuantityToBuy } from './helpers/functions';
import { ERROR_MESSAGES } from './constants/constants';

function processTokenPurchase(user: User) {
  const token = createToken();
  console.log(`Valor do token: ${formatCurrency(token.value)}`);
  console.log(`Quantidade disponível para compra: ${token.quantity}`);

  const quantityToBuy = getQuantityToBuy(token);

  try {
    const report = user.buyTokens(token, quantityToBuy);

    if (report) {
      const transactionReport = generateTransactionReport(report);
      console.log(transactionReport);
    }
  } catch (error: any) {
    console.log(`${ERROR_MESSAGES.ERROR_PROCESSING_PURCHASE} ${error.message}`);
  }
}

function main() {
  let userName: string;
  let initialBalance: number;

  try {
    userName = getUserInput('Digite seu nome:');
    initialBalance = getPositiveNumberInput('Digite seu saldo inicial:');
  } catch (error: any) {
    console.log(`${ERROR_MESSAGES.ERROR_GETTING_USER_INFO} ${error.message}`);
    return;
  }

  if (userName && initialBalance !== null) {
    const user = new User(userName, initialBalance);
    let continueTransaction = true;

    while (continueTransaction) {
      console.log(`Saldo do usuário: ${formatCurrency(user.balance)}`);

      const action = getUserInput('O que você deseja fazer? (comprar / sair)');

      switch (action) {
        case 'comprar':
          processTokenPurchase(user);
          break;

        case 'sair':
          continueTransaction = false;
          break;

        default:
          console.log(ERROR_MESSAGES.INVALID_OPTION);
      }
    }
  }
}

main();
