const Web3 = require('web3');
const fs = require('fs');

// Load deployment info
const deployment = JSON.parse(fs.readFileSync('deployment.json', 'utf8'));

async function sendTokens() {
  try {
    // Get command line arguments
    const buyerAddress = process.argv[2];
    const tokenAmount = process.argv[3];
    
    if (!buyerAddress || !tokenAmount) {
      console.log('Usage: node send-tokens.js <buyer_address> <amount>');
      console.log('Example: node send-tokens.js 0x1234... 100');
      return;
    }
    
    // Check for private key
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      console.log('❌ Error: PRIVATE_KEY environment variable not set');
      console.log('Set it with: export PRIVATE_KEY="your_private_key_here"');
      return;
    }
    
    // Connect to network
    const web3 = new Web3(deployment.rpc);
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    
    console.log('🔗 Connected to', deployment.network);
    console.log('📤 Sending from:', account.address);
    console.log('📥 Sending to:', buyerAddress);
    console.log('💰 Amount:', tokenAmount, 'tokens');
    
    // Create contract instance
    const tokenContract = new web3.eth.Contract(
      deployment.abi,
      deployment.contractAddress
    );
    
    // Convert amount to wei (18 decimals)
    const amountWei = web3.utils.toWei(tokenAmount.toString(), 'ether');
    
    // Check sender balance
    const balance = await tokenContract.methods.balanceOf(account.address).call();
    const balanceFormatted = web3.utils.fromWei(balance, 'ether');
    
    console.log('Your balance:', balanceFormatted, 'tokens');
    
    if (parseFloat(balance) < parseFloat(amountWei)) {
      console.log('❌ Error: Insufficient token balance');
      return;
    }
    
    // Send tokens
    console.log('\n🚀 Sending tokens...');
    
    const tx = await tokenContract.methods
      .transfer(buyerAddress, amountWei)
      .send({
        from: account.address,
        gas: 100000
      });
    
    console.log('✅ Tokens sent successfully!');
    console.log('Transaction hash:', tx.transactionHash);
    console.log('Block number:', tx.blockNumber);
    console.log('Gas used:', tx.gasUsed);
    
    // Verify transfer
    const newBalance = await tokenContract.methods.balanceOf(buyerAddress).call();
    const newBalanceFormatted = web3.utils.fromWei(newBalance, 'ether');
    
    console.log('\n📊 Buyer new balance:', newBalanceFormatted, 'tokens');
    console.log('🔍 View on Etherscan:', `https://sepolia.etherscan.io/tx/${tx.transactionHash}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

sendTokens();
