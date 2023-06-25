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
  

function buy