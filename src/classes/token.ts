import { randomBytes } from 'node:crypto';
const DISCOUNT_PER_TOKEN = 5;
const MAX_VALUE = 100;
const MAX_DEMAND = 20;



export class Token {
   id: string;
   value: number;
   quantity: number;
   demand: number;

  constructor(id: string, value: number, quantity: number, demand: number) {
    this.id = id;
    this.value = value;
    this.quantity = quantity;
    this.demand = demand;
  }

  calculateEquilibriumPrice(): number {
    const equilibriumPrice = this.value * (1 + 1 / this.demand);
    return equilibriumPrice;
  }

  simulateExternalFactors() {
    const factor = Math.random() * (1.2 - 0.8) + 0.8;

    this.value *= factor;

    if (this.value > 100) {
      this.value = 100;
    }
  }
}

export function createToken(): Token {
  const id = generateId();
  const value = getRandomValue();
  const quantity = getRandomQuantity();
  const demand = getRandomDemand();
  return new Token(id, value, quantity, demand);
}

function generateId(): string {
  const idBytes = randomBytes(8);
  return idBytes.toString('hex');
}

function getRandomValue(): number {

  return Math.random() * MAX_VALUE;
}

function getRandomQuantity(): number {
  return Math.floor(Math.random() * MAX_VALUE) + 1;
}

function getRandomDemand(): number {
  return Math.floor(Math.random() * MAX_DEMAND) + 1;
}

export function calculateDiscount(quantity: number): number {
  return DISCOUNT_PER_TOKEN * quantity;
}
