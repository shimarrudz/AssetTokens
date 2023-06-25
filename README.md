# Challenge

# **Summary**

> The Peer platform is an alternative investment platform that offers investors the opportunity to invest in different assets, such as invoices, cryptocurrencies, and tokenized assets. Create a program that simulates a market for asset tokens, consisting of implementing logic for token creation and trading between users.

## **❓ Challenge Case**

### 🏗️ **Data Structure:**

Each token has the following information:

- Unique identifier
- Value in Brazilian Real (this value should be changed from time to time)
- Quantity available for purchase

The user has the following information:

- Name
- Balance in Brazilian Real
- Purchased tokens

### 🔨 **Program Features**

Your program should be able to perform the following features:

1. Create Tokens: Create a new token with a random initial value and a random initial quantity.
2. Modify Token Value: The token value will vary according to the number of tokens bought or sold (Law of Supply and Demand).
3. Buy Tokens: The user can buy tokens if they have sufficient balance.
4. Bulk Token Purchase: The user can buy tokens in bulk, with a discount on the total price. The discount may vary depending on the number of tokens purchased.
5. Purchased Tokens Report: After completing the token purchase, provide the user with a report containing relevant information about the transaction via email.

### 💡 **Note**

- The fluctuation of token values should be done randomly but within a realistic range to keep the simulation interesting.
- The program should run in a continuous loop until the user decides to exit. After each transaction, the program should ask the user if they want to perform another transaction.
- The law of supply and demand is only altered after the completion of a transaction. Therefore, the token value is only updated when a transaction is completed.

## **[💻](https://emojiterra.com/en/pc/) Technologies**

- Use TypeScript;
- Use OOP;
- Unit Tests with Jest;

## 👾 Extra Points

- Use Clean Code principles;
- Implement a Simple Interface;

## ❌ Restrictions

- Use of libraries;
- Do not copy code;

## 🌐 **Links**

[JavaScript With Syntax For Types.](https://www.typescriptlang.org/)

[Jest](https://jestjs.io/)

## 🚀 Finished the challenge?
