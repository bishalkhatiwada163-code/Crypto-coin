# Token Purchase System - Setup Guide

## Current Status ✅

Your website now has a **WORKING payment system** that allows people to purchase your tokens using MetaMask!

## How It Works

### 1. **Connect Wallet** (Step 1 on buy.html)
- Visitors click "Connect MetaMask Wallet"
- MetaMask extension opens and prompts them to connect
- System automatically switches to Sepolia testnet if needed
- Wallet address is displayed once connected

### 2. **Select Amount** (Step 2)
- User enters the number of tokens they want to buy
- Price: $0.45 USD per token (0.000225 ETH per token, assuming ETH = $2000)
- Total cost is calculated automatically

### 3. **Buy Now** (Step 3)
- User clicks "Buy Now" button
- System checks if they have enough ETH
- Confirmation dialog shows purchase details
- MetaMask opens for transaction approval
- ETH is sent to your wallet address: `0xEdd70bd1258c4D3902E3a1fCe7E32D579dF91273`
- Transaction hash is displayed
- Purchase is recorded in browser localStorage

## Current Setup (Manual Token Distribution)

**HOW IT WORKS NOW:**
1. Customer sends ETH to your wallet
2. You manually send tokens to their wallet within 24 hours
3. Customer receives tokens

**To send tokens manually:**
```javascript
// Use MetaMask or run this script
node send-tokens.js <buyer_address> <amount>
```

## Automatic Distribution (Recommended for Production)

To automate token distribution, deploy the TokenSale contract:

### Step 1: Deploy TokenSale Contract
```bash
# Set your private key
export PRIVATE_KEY="your_private_key_here"

# Deploy the sale contract
node deploy-token-sale.js
```

### Step 2: Transfer Tokens to Sale Contract
After deployment, transfer tokens from your wallet to the TokenSale contract so it can distribute them automatically.

### Step 3: Update Website
Update the sale contract address in `script.js`

## Files Modified

1. **script.js** - Added Web3 integration with:
   - `connectWallet()` - Connects MetaMask
   - `buyNow()` - Processes purchases
   - Network detection and switching
   - Transaction handling

2. **buy.html** - Added Web3.js library
3. **index.html** - Added Web3.js library
4. **TokenSale.sol** - NEW smart contract for automatic token sales
5. **deploy-token-sale.js** - NEW deployment script

## Testing Your Payment System

### On Testnet (Sepolia - FREE):
1. Get free Sepolia ETH from faucet: https://sepoliafaucet.com/
2. Go to your buy.html page
3. Click "Connect MetaMask Wallet"
4. Enter token amount
5. Click "Buy Now"
6. Confirm in MetaMask
7. Check transaction on Etherscan

### On Mainnet (Real Money):
**WARNING:** Only use mainnet when you're ready for real transactions!
1. Change network in deployment.json to Ethereum Mainnet
2. Update RPC URL to mainnet
3. Update contract addresses
4. Test thoroughly on testnet first!

## Features Included

✅ **MetaMask Integration** - Connect crypto wallets
✅ **Network Detection** - Auto-switch to correct network  
✅ **Balance Checking** - Verify user has enough ETH
✅ **Transaction Confirmation** - Shows details before purchase
✅ **Transaction Tracking** - Displays transaction hash
✅ **Error Handling** - User-friendly error messages
✅ **Purchase History** - Saves in localStorage
✅ **Responsive UI** - Works on mobile and desktop

## Security Features

🔒 **Client-Side Only** - No private keys stored
🔒 **User Approval Required** - Every transaction needs confirmation
🔒 **Network Verification** - Ensures correct blockchain
🔒 **Amount Validation** - Checks sufficient balance
🔒 **Transaction Receipts** - Verifiable on blockchain

## Next Steps for Full Production

### 1. Backend Integration
Create a server to:
- Monitor incoming payments
- Automatically send tokens when payment received
- Store purchase records in database
- Send confirmation emails

### 2. Deploy TokenSale Contract
For fully automatic distribution without manual intervention

### 3. Add More Payment Methods
- Credit card via Stripe/MoonPay
- Bank transfer integration
- Other cryptocurrencies

### 4. KYC/AML Compliance
If required in your jurisdiction:
- Identity verification
- Purchase limits
- Compliance reporting

### 5. Analytics
- Track purchases
- Monitor conversion rates
- Customer insights

## Price Configuration

Current price: **$0.45 USD per token**

To change the price, update in `script.js`:
```javascript
const ethPerToken = 0.000225; // Change this value
```

Calculate: `(USD_PRICE / ETH_PRICE_IN_USD)`

Example: If ETH = $2000 and you want $0.50 per token:
`0.50 / 2000 = 0.00025`

## Support & Troubleshooting

### Common Issues:

**"Please install MetaMask"**
- User needs to install MetaMask browser extension
- Link provided: https://metamask.io/download/

**"Insufficient ETH balance"**
- User doesn't have enough ETH to cover purchase + gas fees
- They need to buy more ETH or reduce purchase amount

**"Transaction rejected"**
- User clicked "Reject" in MetaMask
- They can try again

**"Wrong network"**
- System will automatically prompt to switch networks
- User just needs to approve the network switch

## Contact

For manual token distribution, check purchases in browser console:
```javascript
JSON.parse(localStorage.getItem('tokenPurchases'))
```

This shows all pending purchases with buyer addresses and amounts.

---

**Your payment system is now LIVE and functional!** 🚀

Test it on Sepolia testnet before going to mainnet.
