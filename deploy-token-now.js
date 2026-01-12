const { ethers } = require('ethers');
const fs = require('fs');
const solc = require('solc');

async function main() {
  // Connect to your blockchain
  const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
  
  // Use the first validator's private key (from node1/key file)
  // This is a test network, so we'll derive it from the public key
  const privateKey = fs.readFileSync('nodes/node1/key', 'utf8').trim();
  const wallet = new ethers.Wallet(privateKey, provider);
  
  console.log('Deploying from address:', wallet.address);
  console.log('Balance:', ethers.formatEther(await provider.getBalance(wallet.address)), 'ETH');
  
  // Read and compile the Solidity contract
  const source = fs.readFileSync('MyToken.sol', 'utf8');
  
  const input = {
    language: 'Solidity',
    sources: {
      'MyToken.sol': { content: source }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode']
        }
      }
    }
  };
  
  console.log('\nCompiling contract...');
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  
  if (output.errors) {
    output.errors.forEach(err => {
      if (err.severity === 'error') {
        console.error('Error:', err.formattedMessage);
      }
    });
    if (output.errors.some(e => e.severity === 'error')) {
      process.exit(1);
    }
  }
  
  const contractName = 'MyToken';
  const contract = output.contracts['MyToken.sol'][contractName];
  const abi = contract.abi;
  const bytecode = contract.evm.bytecode.object;
  
  console.log('Contract compiled successfully!');
  
  // Deploy the contract
  console.log('\nDeploying token...');
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const tokenContract = await factory.deploy(1000000); // Only initial supply parameter
  
  console.log('Transaction sent! Waiting for confirmation...');
  const txHash = tokenContract.deploymentTransaction().hash;
  console.log('Transaction hash:', txHash);
  
  // Wait for transaction receipt with timeout
  const receipt = await provider.waitForTransaction(txHash, 1, 30000); // 1 confirmation, 30 sec timeout
  if (!receipt) {
    console.log('\n⚠️  Transaction sent but not yet confirmed. Check later.');
    console.log('Tx hash:', txHash);
    process.exit(0);
  }
  
  const address = await tokenContract.getAddress();
  
  console.log('\n✅ Token deployed successfully!');
  console.log('Contract address:', address);
  console.log('Token name: MyToken');
  console.log('Token symbol: MTK');
  console.log('Total supply: 1,000,000 MTK');
  
  // Check balance
  const balance = await tokenContract.balanceOf(wallet.address);
  console.log('Your balance:', ethers.formatUnits(balance, 18), 'MTK');
  
  // Save contract info
  const contractInfo = {
    address: address,
    abi: abi,
    name: 'MyToken',
    symbol: 'MTK',
    totalSupply: '1000000',
    deployedBy: wallet.address,
    deploymentBlock: await provider.getBlockNumber()
  };
  
  fs.writeFileSync('deployed-contract.json', JSON.stringify(contractInfo, null, 2));
  console.log('\nContract info saved to deployed-contract.json');
}

main().catch(console.error);
