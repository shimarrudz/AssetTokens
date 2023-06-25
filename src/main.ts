import { User } from './classes/user'
import { Token, createToken, calculateDiscount } from './classes/token';
import { TransactionReport, generateTransactionReport } from './classes/transactionReport';
import { formatCurrency, getUserInput, getPositiveNumberInput, getQuantityToBuy } from './helpers/functions';

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
    console.log(`Erro ao processar a compra: ${error.message}`);
  }
}

function main() {
  let userName: string;
  let initialBalance: number;

  try {
    userName = getUserInput('Digite seu nome:');
    initialBalance = getPositiveNumberInput('Digite seu saldo inicial:');
  } catch (error: any) {
    console.log(`Erro ao obter informações do usuário: ${error.message}`);
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
          console.log('Opção inválida. Tente novamente.');
      }
    }
  }
}

main();
