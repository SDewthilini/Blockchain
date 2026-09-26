# Anti-Counterfeit Product Verification via NFTs

A full-stack decentralized application (dApp) for a university blockchain course. It allows manufacturers to mint unique NFTs representing physical products. Consumers can then verify the authenticity and ownership history of a product by scanning its QR code.

## Tech Stack
- **Smart Contract:** Solidity (^0.8.24), OpenZeppelin ERC-721
- **Development Framework:** Hardhat
- **Frontend:** React + Vite, ethers.js v6
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
*(Keep this terminal open. It runs the local blockchain and provides test accounts/private keys for the demo).*

### 3. Deploy Smart Contract
In a second terminal at the root directory, deploy the contract to the local network:
```bash
npx hardhat run scripts/deploy.js --network localhost
```
*(This will deploy the contract and automatically export its Address and ABI to `frontend/src/contractData.json`).*

### 4. Run Frontend
Navigate to the frontend directory in a third terminal and start the Vite dev server:
```bash
cd frontend
npm run dev
```
Open your browser to `http://localhost:5173/`.

---

## Live Presentation Demo Script
To make presenting the project seamless, the frontend has been configured in **Demo Mode**. It utilizes built-in Hardhat test wallets to sign transactions directly, bypassing the need for a browser extension like MetaMask. 

Below is a step-by-step scenario you can use to present the project:

### Act 1: The Manufacturer creates a product
* **Scenario:** You act as a luxury watch manufacturer (e.g., Rolex) registering a new physical watch on the blockchain.
* **Action:** 
  1. Go to the **Manufacturer (Mint)** page.
  2. Fill out the form (Serial: `ROLEX-SUB-9921`, Batch: `BATCH-2026-CH`, Metadata: `ipfs://rolex-specs`).
  3. Click **Mint Product NFT**.
* **Result:** A QR code is generated for Token ID `0`. This QR code would theoretically be printed and placed on the physical watch box.

### Act 2: A Customer verifies the watch in the store
* **Scenario:** A customer scans the QR code in a retail store to ensure the product is not counterfeit before buying.
* **Action:** 
  1. Go to the **Verify Product** page.
  2. Under Manual Entry, type `0` and click **Verify**.
* **Result:** A green **✅ Genuine Product** card appears, showing the original manufacturer (`0xf39F...`) as the current owner.

### Act 3: Selling the watch (Transferring Ownership)
* **Scenario:** The customer buys the watch. The store transfers the digital NFT certificate to the customer's personal crypto wallet.
* **Action:** 
  1. Copy **Account #1**'s public address from your Hardhat terminal (`0x7099...`). This represents the customer.
  2. Go to the **Transfer Ownership** page.
  3. Enter Token ID `0`, and paste the customer's address (`0x7099...`) into the New Owner field. (Leave the Private Key as is).
  4. Click **Transfer NFT**.
* **Result:** The blockchain securely transfers ownership to the buyer.

### Act 4: Proving the Ownership Changed
* **Scenario:** Proving that the ledger has been permanently updated.
* **Action:** 
  1. Go back to the **Verify Product** page.
  2. Verify Token `0` again.
* **Result:** It still shows as genuine, but the Owner address has updated to the buyer's address (`0x7099...`). If the buyer ever resells this watch on the second-hand market, the next buyer can easily trace this history.

### Act 5: Catching a Fake (Counterfeit Demo)
* **Scenario:** Someone tries to scan a fake QR code for a product that the manufacturer never registered.
* **Action:** 
  1. On the **Verify Product** page, type a random Token ID (like `99`) and click Verify.
* **Result:** A red **❌ Not Registered / Possible Counterfeit** card immediately flags the item as fake.
