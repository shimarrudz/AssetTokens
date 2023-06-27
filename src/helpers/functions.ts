import chalk from 'chalk';
import { Token } from '../classes/token';
import { ERROR_MESSAGES } from '../constants/constants';
import readLine from 'readline';


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

export function getPositiveNumberInput(promptText: string): Promise<number> {
  return new Promise((resolve) => {
    const readlineInterface = readLine.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const prompt = () => {
      readlineInterface.question(promptText, (input) => {
        const number = parseFloat(input);
        if (isNaN(number) || number < 0) {
          console.log(chalk.red('Valor inválido. Digite um número positivo.'));
          prompt();
        } else {
          readlineInterface.close();
          resolve(number);
        }
      });
    };

    prompt();
  });
}


export function getQuantityToBuy(token: Token): Promise<number> {
  return new Promise(async (resolve) => {
    let quantityToBuy: number | null = null;

    while (quantityToBuy === null) {
      const quantityInput = await getUserInput('Quantos tokens você deseja comprar?');
      const parsedQuantity = parseInt(quantityInput, 10);

      if (isNaN(parsedQuantity) || parsedQuantity <= 0 || !Number.isFinite(parsedQuantity)) {
        console.log(chalk.red('Quantidade inválida. A quantidade deve ser um número inteiro positivo. Tente novamente.'));
        continue;
      }

      if (parsedQuantity > token.quantity) {
        console.log(chalk.red('Quantidade indisponível para compra. Tente novamente.'));
        continue;
      }

      quantityToBuy = parsedQuantity;
    }

    resolve(quantityToBuy);
  });
}