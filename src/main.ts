import chalk from 'chalk';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config();

import { User } from './classes/user';
import { createToken } from './classes/token';
import { generateTransactionReport } from './classes/transactionReport';
import { formatCurrency, getUserInput, getPositiveNumberInput, getQuantityToBuy } from './helpers/functions';
import { ERROR_MESSAGES } from './constants/constants';

const SENDGRID_API_KEY = process.env.API_KEY || '';
sgMail.setApiKey(SENDGRID_API_KEY);

async function sendEmail(to: string, subject: string, text: string): Promise<void> {
  const email = process.env.EMAIL2 || '';
  const msg = {
    to,
    from: email,
    subject,
    text,
  };

  try {
    await sgMail.send(msg);
    console.log('E-mail enviado com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar o e-mail:', error);
  }
}

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

      const email = await getUserInput('Digite seu e-mail para receber o relatório:');

      try {
        await sendEmail(email, 'Relatório de Transação', transactionReport);
      } catch (error: any) {
        console.error('Erro ao enviar o e-mail:', error.message);
      }
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
    const tokenIdx = tokenIndex >= 0 && tokenIndex < user.tokens.length
    if (tokenIdx) {
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