import { v4 as uuidv4 } from 'uuid';
import readline from 'node:readline';

class Token {
  id: string;
  value: number;
  quantity: number;

  constructor(id: string, value: number, quantity: number) {
    this.id = id;
    this.value = value;
    this.quantity = quantity;
  }
}

interface TransactionReport {
  user: User;
  token: Token;
  quantity: number;
  totalPrice: number;
  discount: number;
}

class User {
  name: string;
  balance: number;
  tokens: Token[];

  constructor(name: string, initialBalance: number) {
    this.name = name;
    this.balance = initialBalance;
    this.tokens = [];
  }

  buyTokens(token: Token, quantity: number): TransactionReport {
    const totalPrice = token.value * quantity;

    if (this.balance < totalPrice) {
      throw new Error('Saldo insuficiente para comprar os tokens.');
    }

    if (token.quantity < quantity) {
      throw new Error('Quantidade de tokens indisponível para compra.');
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

function createToken(): Token {
  const id = generateId();
  const value = getRandomValue();
  const quantity = getRandomQuantity();
  return new Token(id, value, quantity);
}

function generateId(): string {
  return uuidv4();
}

function getRandomValue(): number {
  const maxValue = 100;
  return Math.random() * maxValue;
}

function getRandomQuantity(): number {
  const maxQuantity = 100;
  return Math.floor(Math.random() * maxQuantity) + 1;
}

function calculateDiscount(quantity: number): number {
  const discountPerToken = 5;
  return discountPerToken * quantity;
}

function generateTransactionReport(report: TransactionReport): string {
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

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

async function getUserInput(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function getPositiveNumberInput(question: string): Promise<number> {
  const input = await getUserInput(question);
  const parsedNumber = parseFloat(input);

  if (isNaN(parsedNumber) || parsedNumber <= 0 || !Number.isFinite(parsedNumber)) {
    throw new Error('Valor inválido. Digite um número positivo.');
  }

  return parsedNumber;
}

function getQuantityToBuy(token: Token): Promise<number> {
  return new Promise(async (resolve) => {
    let quantityToBuy: number | null = null;

    while (quantityToBuy === null) {
      const quantityInput = await getUserInput('Quantos tokens você deseja comprar?');
      const parsedQuantity = parseInt(quantityInput, 10);

      if (isNaN(parsedQuantity) || parsedQuantity <= 0 || !Number.isFinite(parsedQuantity)) {
        console.log('Quantidade inválida. A quantidade deve ser um número inteiro positivo. Tente novamente.');
        continue;
      }

      if (parsedQuantity > token.quantity) {
        console.log('Quantidade indisponível para compra. Tente novamente.');
        continue;
      }

      quantityToBuy = parsedQuantity;
    }

    resolve(quantityToBuy);
  });
}

async function processTokenPurchase(user: User) {
  const token = createToken();
  console.log(`Valor do token: ${formatCurrency(token.value)}`);
  console.log(`Quantidade disponível para compra: ${token.quantity}`);

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
  let user: User;

  try {
    const userName = await getUserInput('Digite seu nome:');
    const initialBalance = await getPositiveNumberInput('Digite seu saldo inicial:');
    user = new User(userName, initialBalance);
  } catch (error: any) {
    console.log(`Erro ao obter informações do usuário: ${error.message}`);
    return;
  }

  const menuOptions: { [key: string]: { label: string; action: () => Promise<void> } } = {
    '1': {
      label: 'Comprar tokens',
      action: async () => {
        await processTokenPurchase(user);
      },
    },
    '2': {
      label: 'Sair',
      action: () => {
        console.log('Saindo...');
        process.exit();
      },
    },
  };

  while (true) {
    console.log(`Saldo do usuário: ${formatCurrency(user.balance)}`);
    console.log('--- Menu ---');

    for (const option in menuOptions) {
      console.log(`${option}. ${menuOptions[option].label}`);
    }

    try {
      const option = String(await getPositiveNumberInput('Digite a opção desejada:'));

      if (option in menuOptions) {
        await menuOptions[option].action();
      } else {
        console.log('Opção inválida. Tente novamente.');
      }
    } catch (error: any) {
      console.log(`Erro: ${error.message}`);
    }
  }
}

main();
