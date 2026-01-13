const Web3 = require('web3');
const fs = require('fs');

// Load deployment info
const deployment = JSON.parse(fs.readFileSync('deployment.json', 'utf8'));

async function checkPendingPurchases() {
  try {
    const OWNER_ADDRESS = deployment.deployer;
    
    console.log('🔍 Checking for pending purchases...');
    console.log('Owner address:', OWNER_ADDRESS);
    
    // Connect to network
    const web3 = new Web3(deployment.rpc);
    
    // Get recent transactions to owner address
    console.log('\n📊 Recent incoming transactions:');
    console.log('Note: For full purchase tracking, implement a backend database.');
    console.log('\nTo view all transactions, visit:');
    console.log(`https://sepolia.etherscan.io/address/${OWNER_ADDRESS}`);
    
    // Get current balance
    const balance = await web3.eth.getBalance(OWNER_ADDRESS);
    const balanceEth = web3.utils.fromWei(balance, 'ether');
    
    console.log('\n💰 Current ETH balance:', balanceEth, 'ETH');
    
    // Instructions for checking purchases
    console.log('\n📋 To process pending purchases:');
    console.log('1. Check Etherscan for incoming transactions');
    console.log('2. Note the sender address and amount');
    console.log('3. Calculate tokens: (ETH amount / 0.000225) = tokens to send');
    console.log('4. Run: node send-tokens.js <buyer_address> <token_amount>');
    
    console.log('\n💡 TIP: Deploy the TokenSale contract for automatic distribution!');
    console.log('Run: node deploy-token-sale.js');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkPendingPurchases();
