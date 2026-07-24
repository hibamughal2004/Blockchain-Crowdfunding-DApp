# Blockchain Crowdfunding DApp

## Project Description

This project is a decentralized crowdfunding application developed using Ethereum blockchain technology. It allows users to create fundraising campaigns, donate Ether securely, withdraw funds after achieving the funding goal, and claim refunds if the campaign fails.

Unlike traditional crowdfunding platforms, this application removes the need for intermediaries by using smart contracts, ensuring transparency, security, and trust among users.

---

## Features

- Create crowdfunding campaigns
- Donate ETH using MetaMask
- Automatic campaign deadline handling
- Withdraw funds after successful campaigns
- Refund donors if funding goal is not achieved
- Real-time campaign progress bar
- Campaign status (Active, Successful, Failed)
- Responsive user interface

---

## Technologies Used

- Solidity
- Hardhat
- React.js
- Ethers.js
- MetaMask
- Bootstrap
- Git & GitHub

---

## Installation

### Clone Repository

```bash
git clone https://github.com/hibamughal2004/Blockchain-Crowdfunding-DApp.git
```

### Install Dependencies

```bash
npm install
cd frontend
npm install
```

### Start Hardhat Node

```bash
npx hardhat node
```

### Deploy Smart Contract

```bash
npx hardhat run scripts/deploy.js --network localhost
```

### Run React Frontend

```bash
cd frontend
npm start
```

---

## Project Workflow

1. User connects MetaMask wallet.
2. User creates a crowdfunding campaign.
3. Donors contribute ETH.
4. If the funding goal is achieved before the deadline, the campaign creator can withdraw the funds.
5. If the funding goal is not achieved, donors can claim refunds.

---

## Author

**Hiba Mughal**

Blockchain Technology Semester Project
