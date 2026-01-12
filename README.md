# Your Custom Ethereum Blockchain - COMPLETE ✅

Short repo description: spin up a local 4-validator Besu QBFT network (chain ID 13371, 2s blocks) and deploy a simple ERC-20 style token via Node.js (ethers + solc). Includes PowerShell scripts to start validators, a deploy script for `MyToken`, and instructions to connect MetaMask.

**Status:** 4 validators running | Chain ID: 13371 | Block time: 2s | Consensus: QBFT

## Quick Start - Run Your Blockchain

### Start All Validators (4 separate PowerShell windows)
```powershell
# node1
cd C:\Users\bisha\OneDrive\Documents\crypto
.\start-node1.ps1

# node2
cd C:\Users\bisha\OneDrive\Documents\crypto
.\start-node2.ps1

# node3
cd C:\Users\bisha\OneDrive\Documents\crypto
.\start-node3.ps1

# node4
cd C:\Users\bisha\OneDrive\Documents\crypto
.\start-node4.ps1
```

### Check Blockchain Status
```powershell
npm run check-block
```

## Connect MetaMask

1. Open MetaMask → Networks → Add Network
2. Enter these details:
	- **Network Name:** MyChain
	- **RPC URL:** http://127.0.0.1:8545
	- **Chain ID:** 13371
	- **Currency Symbol:** ETH

## RPC Endpoints

- Node 1: http://127.0.0.1:8545
- Node 2: http://127.0.0.1:8547
- Node 3: http://127.0.0.1:8549
- Node 4: http://127.0.0.1:8551

## What You Can Do Now

### 1. Deploy Smart Contracts
Use Hardhat, Remix, or Foundry pointing to `http://127.0.0.1:8545`

### 2. Create Your Own Token
```powershell
npm run deploy  # Deploys example ERC-20 token
```

### 3. Test Transactions
Use ethers.js, web3.js, or MetaMask to send transactions

### 4. Build DeFi Apps
Your blockchain supports all Ethereum smart contracts (Solidity)

### 5. View Token Info (Simple Page)
Open `token-viewer.html` and:
- Choose `Local` or `Sepolia` network
- Enter an account address (for balance)
- Click `Load` to see token name, symbol, and balance

Quick verify via Node:
```powershell
node .\test-token-viewer.js sepolia
```

## Network Details

- **Consensus:** QBFT (Istanbul Byzantine Fault Tolerance)
- **Chain ID:** 13371
- **Block Time:** 2 seconds
- **Gas Limit:** 20,000,000 per block
- **Validators:** 4 nodes (localhost)
- **Forks Enabled:** All up to Cancun (latest)

## Files Structure

```
├── config/
│   ├── networkConfig.json    # Chain configuration
│   └── output/               # Generated keys & genesis
├── nodes/
│   ├── node1/                # Validator 1 data
│   ├── node2/                # Validator 2 data
│   ├── node3/                # Validator 3 data
│   └── node4/                # Validator 4 data
├── start-node*.ps1           # Startup scripts
├── check-status.js           # Status checker
└── deploy-token.js           # Token deployment example
```

## Troubleshooting

**Validators not connecting?**
- Check that all 4 nodes are running (4 PowerShell windows)
- Verify ports 30303-30306, 8545, 8547, 8549, 8551 are not in use

**Can't connect from MetaMask?**
- Ensure you're using `http://127.0.0.1:8545` not `localhost`
- Check Windows Firewall isn't blocking the connection

**Need to reset blockchain?**
- Stop all 4 validators
- Delete `nodes/node*/database` folders
- Restart validators - will sync from genesis

---

**🎉 Congratulations! You've created your own Ethereum blockchain!**
