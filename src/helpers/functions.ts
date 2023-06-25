import { Token } from '../classes/token'

export function formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
  
  export function getUserInput(message: string): string {
    const input = prompt(message);
    if (!input) {
      throw new Error('Entrada inválida.');
    }
    return input;
  }
  
  export function getPositiveNumberInput(message: string): number {
    const input = getUserInput(message);
    const parsedNumber = parseFloat(input);
  
    if (isNaN(parsedNumber) || parsedNumber <= 0 || !Number.isFinite(parsedNumber)) {
      throw new Error('Valor inválido. Digite um número positivo.');
    }
  
    return parsedNumber;
  }
  
  export function getQuantityToBuy(token: Token): number {
    let quantityToBuy: number | null = null;
  
    while (quantityToBuy === null) {
      const quantityInput = getUserInput('Quantos tokens você deseja comprar?');
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
  
    return quantityToBuy;
  }
  