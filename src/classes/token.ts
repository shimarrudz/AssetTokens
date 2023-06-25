import { v4 as uuidv4 } from 'uuid';

export class Token {
  id: string;
  value: number;
  quantity: number;

  constructor(id: string, value: number, quantity: number) {
    this.id = id;
    this.value = value;
    this.quantity = quantity;
  }
}

export function createToken(): Token {
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

export function calculateDiscount(quantity: number): number {
  const discountPerToken = 5;
  return discountPerToken * quantity;
}