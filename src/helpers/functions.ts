import { Token } from '../classes/token';
import { ERROR_MESSAGES } from '../constants/constants';
import readLine from 'readline';

// Adicionar tratamento de erros!!!!
// Aplicar lei de oferta e demanda nos tokens!!!!

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export async function getUserInput(question: string): Promise<string> {
  const rl = readLine.createInterface({
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

export async function getPositiveNumberInput(question: string): Promise<number> {
  const input = await getUserInput(question);
  const parsedNumber = parseFloat(input);

  if (isNaN(parsedNumber) || parsedNumber <= 0 || !Number.isFinite(parsedNumber)) {
    throw new Error('Valor inválido. Digite um número positivo.');
  }

  return parsedNumber;
}

export function getQuantityToBuy(token: Token): Promise<number> {
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