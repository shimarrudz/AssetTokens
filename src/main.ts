import { User } from './classes/user';
import { createToken } from './classes/token';
import { generateTransactionReport } from './classes/transactionReport';
import { formatCurrency, getUserInput, getPositiveNumberInput, getQuantityToBuy } from './helpers/functions';
import { ERROR_MESSAGES } from './constants/constants';
import chalk from 'chalk';

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
    console.log(`${ERROR_MESSAGES.ERROR_PROCESSING_PURCHASE} ${error.message}`);
  }
}

async function processTokenSale(user: User) {
  if (user.tokens.length === 0) {
    console.log(chalk.red('Você não possui tokens para vender.'));
    return;
  }

  console.log('Seus tokens disponíveis para venda:');
  for (let i = 0; i < user.tokens.length; i++) {
    const token = user.tokens[i];
    console.log(`Índice: ${i} | Token ID: ${token.id} | Quantidade: ${token.quantity}`);
  }

  let tokenIndex: number;

  while (true) {
    tokenIndex = await getPositiveNumberInput('Digite o índice do token que deseja vender:');

    if (tokenIndex >= 0 && tokenIndex < user.tokens.length) {
      break;
    }

    console.log(chalk.red('Índice de token inválido. Tente novamente.'));
  }

  const token = user.tokens[tokenIndex];
  const quantityToSell = await getPositiveNumberInput('Digite a quantidade que deseja vender:');

  if (quantityToSell > token.quantity) {
    console.log(ERROR_MESSAGES.INSUFFICIENT_BALANCE);
  }

  const salePrice = token.value * quantityToSell * token.demand;
  user.balance += salePrice;
  token.quantity -= quantityToSell;

  console.log(chalk.green(`Tokens vendidos com sucesso. Saldo atual: ${formatCurrency(user.balance)}`));
}

async function main() {
  let user;

  try {
    const userName = await getUserInput('Digite seu nome:');
    const initialBalance = await getPositiveNumberInput('Digite seu saldo inicial:');
    user = new User(userName, initialBalance);
  } catch (error: any) {
    throw new Error(`${ERROR_MESSAGES.ERROR_GETTING_USER_INFO} ${error.message}`);
  }

  while (true) {
    console.log(chalk.bold(`Saldo do usuário: ${formatCurrency(user.balance)}`));
    console.log(chalk.yellow('------< Menu >------'));
    console.log(chalk.cyan('1. Comprar tokens'));
    console.log(chalk.cyan('2. Vender tokens'));
    console.log(chalk.cyan('3. Sair'));

    try {
      const option = await getPositiveNumberInput(chalk.yellow('Digite a opção desejada:'));

      if (option === 1) {
        const token = createToken();
        token.simulateExternalFactors();
        await processTokenPurchase(user);
      } else if (option === 2) {
        await processTokenSale(user);
      } else if (option === 3) {
        console.log(chalk.red('Saindo...'));
        break;
      } else {
        throw new Error(ERROR_MESSAGES.INVALID_OPTION);
      }
    } catch (error: any) {
      throw new Error(`Erro: ${error.message}`);
    }
  }
}

main();