# CryptoMart

CryptoMart is a decentralized marketplace on Ethereum, allowing users to list, buy, and sell items via smart contracts. This guide covers getting started, running the project, deploying the smart contract, and accessing key contract details.

## Website URL

- [CryptoMart](https://decentralized-ethereum-marketplace-kzol3quexa-uc.a.run.app/)

## Technologies Used

### Smart contracts & Crypto

- [Metamask](https://metamask.io/)
- [Soliditylang](https://soliditylang.org/)
- [Remix IDE](https://remix.ethereum.org/)
- [ethers.js](https://docs.ethers.org/v5/)

### Frontend

- [Next.js 14](https://nextjs.org/docs/getting-started)
- [NextUI v2](https://nextui.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## How to Use

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Build for production server

```bash
npm run build
```

### Run the build server

```bash
npm run start
```

## Getting Started with MetaMask

### Installing MetaMask

1. Visit the [MetaMask website](https://metamask.io/).
2. Install the MetaMask extension for your browser (available for Chrome, Firefox, and other major browsers).

### Creating an Account

1. Launch MetaMask and click on "Create a Wallet".
2. Follow the prompts to set up a new account by creating a password and securely storing your seed phrase.
3. Change the network to sepolia Testnet from Ethereum Mainnet

## Smart Contract Deployment

### Remix IDE

1. Open [Remix IDE](https://remix.ethereum.org/).
2. Create a new file and paste the contents of your smart contract (`Marketplace.sol`).
3. Compile the smart contract.
4. Deploy the contract using the injected Provider - Metamask environment (requires MetaMask).

### Contract Address and ABI

After deploying the smart contract, you can obtain the contract address and ABI (Application Binary Interface) as follows:

- Contract Address: `Check in output of remix terminal`
- ABI: `/artifacts/Marketplace-metadata.json`

## Setting Up the Website

### Connecting MetaMask to the Website

1. Open the CryptoMart website.
2. Click on the MetaMask extension icon in your browser.
3. If not already logged in, enter your MetaMask password to unlock the wallet.
4. Click `Connect` to authorize the CryptoMart website to access your MetaMask account.

### Listing New Item

1. Navigate to the CryptoMart website.
2. Click on the "List new item" button.
3. Fill in the required details such as item name, price, and description.
4. Click on the "List item" button to list the item for sale.

### Purchasing Item

1. Browse the CryptoMart marketplace to find an item you wish to purchase.
2. Click on the item to view its details.
3. If interested, click on the "Purchase" button.
4. Confirm the purchase by completing the transaction through MetaMask.

## License

Licensed under the [MIT license](https://github.com/sriram-boddeda/decentralized-ethereum-marketplace/blob/main/LICENSE).
