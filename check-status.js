// Check blockchain status
const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');

async function checkStatus() {
  console.log('=== Blockchain Status ===\n');
  
  const blockNumber = await provider.getBlockNumber();
  console.log('Current block:', blockNumber);
  
  const network = await provider.getNetwork();
  console.log('Chain ID:', network.chainId.toString());
  
  const block = await provider.getBlock(blockNumber);
  if (block) {
    console.log('Latest block hash:', block.hash);
    console.log('Block timestamp:', new Date(block.timestamp * 1000).toLocaleString());
    console.log('Transactions in block:', block.transactions.length);
  }
  
  // Check peer count
  const peerCount = await provider.send('net_peerCount', []);
  console.log('\nPeers connected:', parseInt(peerCount, 16));
  
  console.log('\n=== RPC Endpoints ===');
  console.log('Node 1: http://127.0.0.1:8545');
  console.log('Node 2: http://127.0.0.1:8547');
  console.log('Node 3: http://127.0.0.1:8549');
  console.log('Node 4: http://127.0.0.1:8551');
  
  console.log('\n=== MetaMask Setup ===');
  console.log('Network Name: MyChain');
  console.log('RPC URL: http://127.0.0.1:8545');
  console.log('Chain ID: 13371');
  console.log('Currency Symbol: ETH');
}

checkStatus()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
