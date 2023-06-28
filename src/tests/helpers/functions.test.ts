import chalk from 'chalk';
import { formatCurrency, getUserInput, getPositiveNumberInput, getQuantityToBuy } from '../../helpers/functions';
import { Token } from '../../classes/token';

// Mocking readline interface and its methods
const mockCreateInterface = jest.fn().mockReturnValue({
  question: jest.fn().mockImplementation((question: string, callback: (answer: string) => void) => {
    callback('mocked user input');
  }),
  close: jest.fn()
});
jest.mock('readline', () => ({
  createInterface: mockCreateInterface
}));

describe('formatCurrency', () => {
  it('should format the currency correctly', () => {
    const value = 1000;
    const formattedValue = formatCurrency(value);
    expect(formattedValue).toBe('R$ 1.000,00');
  });
});

describe('getUserInput', () => {
  it('should resolve with the user input', async () => {
    const question = 'What is your name?';
    const userInput = await getUserInput(question);
    expect(userInput).toBe('mocked user input');
    expect(mockCreateInterface).toHaveBeenCalledWith({
      input: process.stdin,
      output: process.stdout
    });
  });
});

describe('getPositiveNumberInput', () => {
  let mockConsoleLog: jest.SpyInstance;

  beforeEach(() => {
    mockConsoleLog = jest.spyOn(console, 'log');
  });

  afterEach(() => {
    mockConsoleLog.mockRestore();
  });

  it('should resolve with a valid positive number', async () => {
    const promptText = 'Enter a positive number: ';
    const mockQuestion = jest.fn().mockImplementation((question: string, callback: (answer: string) => void) => {
      callback('10');
    });
    mockCreateInterface.mockReturnValue({
      question: mockQuestion,
      close: jest.fn()
    });

    const number = await getPositiveNumberInput(promptText);

    expect(number).toBe(10);
    expect(mockCreateInterface).toHaveBeenCalledWith({
      input: process.stdin,
      output: process.stdout
    });
    expect(mockQuestion).toHaveBeenCalledWith(promptText, expect.any(Function));
    expect(mockConsoleLog).not.toHaveBeenCalled();
  });

  it('should prompt again for invalid input and display error message', async () => {
    const promptText = 'Enter a positive number: ';
    const mockQuestion = jest.fn()
      .mockImplementationOnce((question: string, callback: (answer: string) => void) => {
        callback('-5');
      })
      .mockImplementationOnce((question: string, callback: (answer: string) => void) => {
        callback('abc');
      })
      .mockImplementationOnce((question: string, callback: (answer: string) => void) => {
        callback('15');
      });
    mockCreateInterface.mockReturnValue({
      question: mockQuestion,
      close: jest.fn()
    });

    const number = await getPositiveNumberInput(promptText);

    expect(number).toBe(15);
    expect(mockCreateInterface).toHaveBeenCalledWith({
      input: process.stdin,
      output: process.stdout
    });
    expect(mockQuestion).toHaveBeenCalledTimes(3);
    expect(mockQuestion).toHaveBeenCalledWith(promptText, expect.any(Function));
    expect(mockConsoleLog).toHaveBeenCalledTimes(2);
    expect(mockConsoleLog).toHaveBeenCalledWith(chalk.red('Valor inválido. Digite um número positivo.'));
  });
});

describe('getQuantityToBuy', () => {
  let mockConsoleLog: jest.SpyInstance;

  beforeEach(() => {
    mockConsoleLog = jest.spyOn(console, 'log');
  });

  afterEach(() => {
    mockConsoleLog.mockRestore();
  });

  it('should resolve with a valid quantity to buy', async () => {
    const token = new Token('Token A', 10, 5, 8);
    const mockQuestion = jest.fn()
      .mockImplementationOnce((question: string, callback: (answer: string) => void) => {
        callback('5');
      });
    mockCreateInterface.mockReturnValue({
      question: mockQuestion,
      close: jest.fn()
    });

    const quantityToBuy = await getQuantityToBuy(token);

    expect(quantityToBuy).toBe(5);
    expect(mockCreateInterface).toHaveBeenCalledWith({
      input: process.stdin,
      output: process.stdout
    });
    expect(mockQuestion).toHaveBeenCalledWith('Quantos tokens você deseja comprar?', expect.any(Function));
    expect(mockConsoleLog).not.toHaveBeenCalled();
  });

  it('should prompt again for invalid input and display error messages', async () => {
    const token = new Token('Token B', 10, 2, 6);
    const mockQuestion = jest.fn()
      .mockImplementationOnce((question: string, callback: (answer: string) => void) => {
        callback('abc');
      })
      .mockImplementationOnce((question: string, callback: (answer: string) => void) => {
        callback('15');
      })
      .mockImplementationOnce((question: string, callback: (answer: string) => void) => {
        callback('8');
      });
    mockCreateInterface.mockReturnValue({
      question: mockQuestion,
      close: jest.fn()
    });

    const quantityToBuy = await getQuantityToBuy(token);

    expect(quantityToBuy).toBe(8);
    expect(mockCreateInterface).toHaveBeenCalledWith({
      input: process.stdin,
      output: process.stdout
    });
    expect(mockQuestion).toHaveBeenCalledTimes(3);
    expect(mockQuestion).toHaveBeenCalledWith('Quantos tokens você deseja comprar?', expect.any(Function));
    expect(mockConsoleLog).toHaveBeenCalledTimes(2);
    expect(mockConsoleLog).toHaveBeenCalledWith(chalk.red('Quantidade inválida. A quantidade deve ser um número inteiro positivo. Tente novamente.'));
    expect(mockConsoleLog).toHaveBeenCalledWith(chalk.red('Quantidade indisponível para compra. Tente novamente.'));
  });
});
