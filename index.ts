#! /usr/bin/env node
//shebang for npm execution

import { number, select } from "@inquirer/prompts";
import chalk from "chalk";

// Creating Account Interface
interface Account {
  accountNumber: number;
  balance: number;
  withdraw(userAmount: number): void;
  deposit(userAmount: number): void;
  checkBalance(): void;
}

// Implementation of the Account interface
class BankAccounts implements Account {
  accountNumber: number;
  balance: number;

  // constructor for account number and balance
  constructor(accountNumber: number, balance: number) {
    this.accountNumber = accountNumber;
    this.balance = balance;
  }

  // if else for money withdrawal from the account
  withdraw(userAmount: number): void {
    if (this.balance >= userAmount) {
      this.balance -= userAmount;
      console.log(
        chalk.cyanBright(
          `Amount Withdrawn : $${userAmount}, Remaining Balance : $${this.balance}`
        )
      );
    } else {
      console.log(`Insufficient Balance!`);
    }
  }

  //  if else for money deposit into the account
  deposit(userAmount: number): void {
    if (userAmount > 100) {
      this.balance -= 1; // $1 fee charged for more than $100 deposit
    }
    this.balance += userAmount;
    console.log(
      chalk.cyanBright(
        `Deposit Amount : $${userAmount}, Remaining Balance : $${this.balance}`
      )
    );
  }

  // Checking the current balance of the account
  checkBalance(): void {
    console.log(chalk.yellowBright(`Current Balance : $${this.balance}`));
  }
}

// customer class
class Customer {
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
  mobileNumber: number;
  account: BankAccounts;

  // Constructor for customer details and their bank account
  constructor(
    firstName: string,
    lastName: string,
    gender: string,
    age: number,
    mobileNumber: number,
    account: BankAccounts
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.age = age;
    this.mobileNumber = mobileNumber;
    this.account = account;
  }
}

// Creating bank accounts and customers
let account: BankAccounts[] = [
  new BankAccounts(1201, 200), // initialize account number and balance
  new BankAccounts(1301, 250),
];

let customerManager: Customer[] = [
  new Customer("Darshika", "Saleem", "female", 20, 7543201, account[0]),
  new Customer("Sakina", "Banu", "female", 40, 5236814, account[1]),
];

// Function for service options and actions
async function service() {
  while (true) {
    // Prompt user for account number
    const accountNumber = await number({
      message: chalk.rgb(4, 176, 351)("\nEnter your account number: "),
    });

    // Finding customer through account number input
    const customer = customerManager.find(
      (customer) => customer.account.accountNumber === accountNumber
    );

    if (customer) {
      console.log(
        chalk.bold.magentaBright(
          `Welcome ${customer.firstName} ${customer.lastName} to our Bank!`
        )
      );

      // Prompt user for action
      const action = await select({
        message: "Select an option:",
        choices: [
          // "Withdraw", "Deposit", "Check Balance", "Exit"
          { name: "Withdraw", value: "Withdraw" }, 
          { name: "Deposit", value: "Deposit" },
          { name: "Check Balance", value: "Check Balance" },
          { name: "Exit", value: "Exit" },
        ],
      });

      // Perform action based on user selection
      switch (action) {
        case "Withdraw":
          const withdrawAmount = await number({
            message: "Enter the amount to withdraw:",
          });
          if (!withdrawAmount) return console.log("please provide an amount");
          customer.account.withdraw(withdrawAmount);
          break;

        case "Deposit":
          const depositAmount = await number({
            message: "Enter the amount to deposit:",
          });
          if (!depositAmount) return console.log("please provide an amount");
          customer.account.deposit(depositAmount);
          break;

        case "Check Balance":
          customer.account.checkBalance();
          break;

        case "Exit":
          console.log(chalk.blueBright("\nExiting Bank program!\n"));
          console.log(chalk.blueBright("Hope you enjoyed our bank services!"));
          return;
      }
    } else {
      console.log(
        chalk.bgRedBright(
          "Customer not found! Please enter a valid account number!"
        )
      );
    }
  }
}

// Starting the banking services
service();
