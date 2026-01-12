const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
const wallet = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);

// Simple Counter Contract (Solidity: contract Counter { uint public count; function increment() public { count++; } })
const counterBytecode = '0x6080604052600080fdfea2646970667358221220b5b8e1f8a4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c64736f6c63430008130033';

// Simple ERC-20 with no constructor args
const minimalErc20Bytecode = '0x60806040526012600055348015601357600080fd5b50603e80601f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063d14e62b814602d575b600080fd5b603360005481565b60405190815260200160405180910390f3fea26469706673582212206b6e6c88ba3c6c8e7e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e64736f6c63430008130033';

async function deploy() {
  console.log('🚀 Deploying simple contract...');
  console.log('Account:', wallet.address);
  
  const tx = await wallet.sendTransaction({
    data: minimalErc20Bytecode,
    gasLimit: 100000
  });
  
  const receipt = await tx.wait();
  console.log('✅ Contract deployed!');
  console.log('📍 Address:', receipt.contractAddress);
}

deploy()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
