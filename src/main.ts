import { User } from './classes/user';
import { createToken } from './classes/token';
import { generateTransactionReport } from './classes/transactionReport';
import { formatCurrency, getUserInput, getPositiveNumberInput, getQuantityToBuy } from './helpers/functions';
import { ERROR_MESSAGES } from './constants/constants';

//Fazer tratamento de erros!!!
async function processTokenPurchase(user: User) {
  const token = createToken();
  console.log(`Valor do token: ${formatCurrency(token.value)}`);
  console.log(`Quantidade disponível para compra: ${token.quantity}`);
  console.log(`Demanda atual do token: ${token.demand}`);

  const quantityToBuy = await getQuantityToBuy(token);

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

async function main() {
  let user;

  try {
    const userName = await getUserInput('Digite seu nome:');
    const initialBalance = await getPositiveNumberInput('Digite seu saldo inicial:');
    user = new User(userName, initialBalance);
  } catch (error: any) {
    console.log(`Erro ao obter informações do usuário: ${error.message}`);
    return;
  }

  while (true) {
    console.log(`Saldo do usuário: ${formatCurrency(user.balance)}`);
    console.log('--- Menu ---');
    console.log('1. Comprar tokens');
    console.log('2. Sair');

    try {
      const option = await getPositiveNumberInput('Digite a opção desejada:');

      if (option === 1) {
        await processTokenPurchase(user);
      } else if (option === 2) {
        console.log('Saindo...');
        break;
      } else {
        console.log('Opção inválida. Tente novamente.');
      }
    } catch (error: any) {
      console.log(`Erro: ${error.message}`);
    }
  }
}

main();
