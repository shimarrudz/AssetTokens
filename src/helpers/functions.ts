import { Token } from '../classes/token';
import { ERROR_MESSAGES } from '../constants/constants';

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function getUserInput(message: string): string {
  const input = prompt(message);
  if (!input) {
    throw new Error(ERROR_MESSAGES.INVALID_INPUT);
  }
  return input;
}

export function getPositiveNumberInput(message: string): number {
  const input = getUserInput(message);
  const parsedNumber = parseFloat(input);

  if (isNaN(parsedNumber) || parsedNumber <= 0 || !Number.isFinite(parsedNumber)) {
    throw new Error(ERROR_MESSAGES.INVALID_VALUE);
  }

  return parsedNumber;
}

export function getQuantityToBuy(token: Token): number {
  let quantityToBuy: number | null = null;

  while (quantityToBuy === null) {
    const quantityInput = getUserInput('Quantos tokens você deseja comprar?');
    const parsedQuantity = parseInt(quantityInput, 10);

    if (isNaN(parsedQuantity) || parsedQuantity <= 0 || !Number.isFinite(parsedQuantity)) {
      console.log(ERROR_MESSAGES.INVALID_QUANTITY);
      continue;
    }

    if (parsedQuantity > token.quantity) {
      console.log(ERROR_MESSAGES.UNAVAILABLE_QUANTITY);
      continue;
    }

    quantityToBuy = parsedQuantity;
  }

  return quantityToBuy;
}
