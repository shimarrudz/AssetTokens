import { v4 as uuidv4 } from 'node:uuid';

class Token {
    id: string;
    value: number;
    quantity: number;


    constructor(id: string, value: number, quantity: number) {
        this.id = id;
        this.value = value;
        this.quantity = quantity
    }
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
}

interface TransactionReport {
    user: User;
    token: Token;
    quantity: number;
    totalPrice: number;
    discount: number;
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
    const maxValue = 100; // Valor máximo para os tokens
    return Math.random() * maxValue;
  }
  
  function getRandomQuantity(): number {
    const maxQuantity = 100; // Quantidade máxima de tokens
    return Math.floor(Math.random() * maxQuantity) + 1;
  }
  


  
// Compra de tokens
function buyTokens(user: User, token: Token, quantity: number): TransactionReport | null {
    const totalPrice = token.value * quantity;

    if(user.balance < totalPrice) {
        console.log("Saldo insuficiente para comprar os tokens.");
        return null;
    }

    if (token.quantity < quantity) {
        console.log("Quantidade de tokens indisponível para compra.")
        return null;
    }

    const discount = calculateDiscount(quantity);
    const discountedPrice = totalPrice - discount;
    user.balance -= discountedPrice;
    token.quantity -= quantity;
    user.tokens.push(token);
  
    const report: TransactionReport = {
      user,
      token,
      quantity,
      totalPrice: discountedPrice,
      discount,
    };
  
    return report;
  }
  
  function calculateDiscount(quantity: number): number {
    const discountPerToken = 5; // Desconto por token comprado
    return discountPerToken * quantity;
  }
  



// Compra de tokens em lote
function buyTokensInBulk(user: User, token: Token, quantity: number): TransactionReport | null {
    const totalPrice = token.value * quantity;
    const discount = calculateBulkDiscount(quantity, totalPrice);
    const discountedPrice = totalPrice - discount;
  
    if (user.balance < discountedPrice) {
      console.log('Saldo insuficiente para comprar os tokens em lote.');
      return null;
    }
  
    if (token.quantity < quantity) {
      console.log('Quantidade de tokens indisponível para compra em lote.');
      return null;
    }
  
    user.balance -= discountedPrice;
    token.quantity -= quantity;
    user.tokens.push(token);
  
    const report: TransactionReport = {
      user,
      token,
      quantity,
      totalPrice: discountedPrice,
      discount,
    };
  
    return report;
  }
  


// Desconto por lote
function calculateBulkDiscount(quantity: number, totalPrice: number): number {
    const discountPerToken = totalPrice * 0.1; // 10% de desconto por token
    const discount = discountPerToken * quantity; // Desconto total para a quantidade de tokens comprados
    return discount;
  }
  




// Relatório de transação
  function generateTransactionReport(report: TransactionReport): string {
    const { user, token, quantity, totalPrice, discount } = report;
  
    const reportString = `
      --- Relatório de Transação ---
      Usuário: ${user.name}
      Token: ${token.id}
      Quantidade: ${quantity}
      Valor Total: R$ ${totalPrice.toFixed(2)}
      Desconto: R$ ${discount.toFixed(2)}
    `;
  
    return reportString;
  }


  
// Loop principal
function main(userName: string, initialBalance: number) {
    const user = new User(userName, initialBalance);
    let continueTransaction = true;
  
    while (continueTransaction) {
      console.log(`Saldo do usuário: R$ ${user.balance.toFixed(2)}`);
  
      const action = prompt('O que você deseja fazer? (comprar / comprar lote / sair)') ?? '';
  
      switch (action) {
        case 'comprar':
          const token = createToken();
          console.log(`Valor do token: R$ ${token.value.toFixed(2)}`);
          console.log(`Quantidade disponível para compra: ${token.quantity}`);
  
          const quantityToBuy = parseInt(prompt('Quantos tokens você deseja comprar?') ?? '0', 10);
          const report = buyTokens(user, token, quantityToBuy);
  
          if (report) {
            const transactionReport = generateTransactionReport(report);
            console.log(transactionReport);
          }
          break;
  
        case 'comprar lote':
          const bulkToken = createToken();
          console.log(`Valor do token: R$ ${bulkToken.value.toFixed(2)}`);
          console.log(`Quantidade disponível para compra: ${bulkToken.quantity}`);
  
          const bulkQuantityToBuy = parseInt(prompt('Quantos tokens você deseja comprar em lote?') ?? '0', 10);
          const bulkReport = buyTokensInBulk(user, bulkToken, bulkQuantityToBuy);
  
          if (bulkReport) {
            const transactionReport = generateTransactionReport(bulkReport);
            console.log(transactionReport);
          }
          break;
  
        case 'sair':
          continueTransaction = false;
          break;
  
        default:
          console.log('Opção inválida.');
          break;
      }
    }
  }
  
  
// Cadastro de usuário
function registerUser() {
    const userName = prompt('Digite seu nome:');
    if (userName === null) {
      console.log('Nome inválido. Tente novamente.');
      return;
    }
  
    const initialBalanceInput = prompt('Digite seu saldo inicial:');
    if (initialBalanceInput === null) {
      console.log('Saldo inicial inválido. Tente novamente.');
      return;
    }
  
    const initialBalance = parseFloat(initialBalanceInput);
    if (isNaN(initialBalance) || !Number.isFinite(initialBalance)) {
      console.log('Saldo inicial inválido. Tente novamente.');
      return;
    }
  
    main(userName, initialBalance);
  }
  
  registerUser();
  

  