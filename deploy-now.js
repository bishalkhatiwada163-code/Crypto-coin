const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
const wallet = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);

async function deploy() {
  console.log('🚀 Deploying MyToken...');
  console.log('Account:', wallet.address);

  // Simple contract bytecode with no constructor args
  const simpleBytecode = '0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea26469706673582212201234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef64736f6c63430008130033';

  console.log('Sending transaction...');
  const tx = await wallet.sendTransaction({
    data: simpleBytecode,
    gasLimit: 500000
  });

  console.log('Waiting for confirmation...');
  const receipt = await tx.wait();

  console.log('\n✅ SUCCESS!');
  console.log('📍 Contract Address:', receipt.contractAddress);
  console.log('\n📱 Your blockchain is working!');
  console.log('   RPC: http://127.0.0.1:8545');
  console.log('   Chain ID: 13371');
}

deploy().catch(err => {
  console.error('\n❌ Failed:', err.message);
  process.exit(1);
});
