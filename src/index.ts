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

    constructor(name: string, balance: number) {
        this.name = name;
        this.balance = balance;
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
    // Implemente uma lógica para gerar um identificador único para o token
    // Pode ser um número sequencial, um UUID, etc.
  }
  
  function getRandomValue(): number {
    // Implemente uma lógica para gerar um valor aleatório para o token
    // Dentro de uma margem realista
  }
  
  function getRandomQuantity(): number {
    // Implemente uma lógica para gerar uma quantidade inicial aleatória para o token
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
    // Implemente uma lógica para calcular o desconto com base na quantidade de tokens comprados
    // Pode ser um desconto fixo ou variável
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
  
  function calculateBulkDiscount(quantity: number, totalPrice: number): number {
    // Implemente uma lógica para calcular o desconto com base na quantidade de tokens comprados em lote
    // Pode ser um desconto fixo ou variável, dependendo do total de tokens e do preço total
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

function main() {
    const user = new User('João', 1000);
    const token = createToken();
  
    let continueTransaction = true;
    while (continueTransaction) {
      console.log(`Saldo do usuário: R$ ${user.balance.toFixed(2)}`);
      console.log(`Valor do token: R$ ${token.value.toFixed(2)}`);
      console.log(`Quantidade disponível para compra: ${token.quantity}`);
  
      const action = prompt('O que você deseja fazer? (comprar / comprar lote / sair)');
      switch (action) {
        case 'comprar':
          const quantityToBuy = parseInt(prompt('Quantos tokens você deseja comprar?'));
          const report = buyTokens(user, token, quantityToBuy);
          if (report) {
            const transactionReport = generateTransactionReport(report);
            console.log(transactionReport);
            sendEmail(user.email, 'Relatório de Transação', transactionReport);
          }
          break;
        case 'comprar lote':
          const bulkQuantityToBuy = parseInt(prompt('Quantos tokens você deseja comprar em lote?'));
          const bulkReport = buyTokensInBulk(user, token, bulkQuantityToBuy);
          if (bulkReport) {
            const transactionReport = generateTransactionReport(bulkReport);
            console.log(transactionReport);
            sendEmail(user.email, 'Relatório de Transação', transactionReport);
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
  
  main();
  