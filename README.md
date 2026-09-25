# Anti-Counterfeit Product Verification via NFTs

A full-stack decentralized application (dApp) for a university blockchain course. It allows manufacturers to mint unique NFTs representing physical products. Consumers can then verify the authenticity and ownership history of a product by scanning its QR code.

## Tech Stack
- **Smart Contract:** Solidity (^0.8.20), OpenZeppelin ERC-721
- **Development Framework:** Hardhat
- **Frontend:** React + Vite, ethers.js v6, MetaMask
- **QR Codes:** qrcode.react (generation), html5-qrcode (scanning)

## Project Structure
- `contracts/` - Smart contract source code (ProductAuthenticity.sol)
- `test/` - Hardhat test cases
- `scripts/` - Deployment script
- `frontend/` - React frontend application

## Setup & Execution

### 1. Install Dependencies
In the root directory, install the smart contract dependencies:
```bash
npm install
```

Navigate to the frontend directory and install its dependencies:
```bash
cd frontend
npm install
```

### 2. Run Local Blockchain Node
In a new terminal at the root directory, start a local Hardhat network:
```bash
npx hardhat node
```

### 3. Deploy Smart Contract
In another terminal at the root directory, deploy the contract to the local network:
```bash
npx hardhat run scripts/deploy.js --network localhost
```
*This will deploy the contract and automatically copy its Address and ABI to `frontend/src/contractData.json`.*

### 4. Run Frontend
Navigate to the frontend directory and start the Vite dev server:
```bash
cd frontend
npm run dev
```

### 5. MetaMask Setup
- Open MetaMask in your browser.
- Add the Localhost 8545 network (`http://127.0.0.1:8545`, Chain ID: 31337).
- Import one of the private keys provided by the Hardhat node terminal to act as the Manufacturer (deployer).

## Demo Walkthrough
1. **Minting:** Go to the Manufacturer Dashboard (Mint) and create a new product. A QR code will be generated containing the Token ID.
2. **Transfer:** Use the Transfer Ownership page to simulate selling the product. Transfer the Token ID to another wallet address.
3. **Verification:** Go to the Verification Page and scan the QR code (or enter the Token ID manually). It will verify the product on-chain and display its current owner, showing whether it's genuine or counterfeit.
