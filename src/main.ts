import { User } from './classes/user';
import { Token, createToken } from './classes/token';
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

async function processTokenSale(user: User) {
  if (user.tokens.length === 0) {
    console.log('Você não possui tokens para vender.');
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

    console.log('Índice de token inválido. Tente novamente.');
  }

  const token = user.tokens[tokenIndex];
  const quantityToSell = await getPositiveNumberInput('Digite a quantidade que deseja vender:');

  if (quantityToSell > token.quantity) {
    console.log('Quantidade de tokens insuficiente para venda.');
    return;
  }

  const salePrice = token.value * quantityToSell * token.demand;
  user.balance += salePrice;
  token.quantity -= quantityToSell;

  console.log(`Tokens vendidos com sucesso. Saldo atual: ${formatCurrency(user.balance)}`);
}

async function main() {
  let user;
  let token: Token;

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
    console.log('2. Vender tokens');
    console.log('3. Sair');
    try {
      const option = await getPositiveNumberInput('Digite a opção desejada:');
    
      if (option === 1) {
        token = createToken();
        token.simulateExternalFactors();
        await processTokenPurchase(user);
      } else if (option === 2) {
        await processTokenSale(user);
      } else if (option === 3) {
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

