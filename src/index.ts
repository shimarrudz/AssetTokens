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
  

