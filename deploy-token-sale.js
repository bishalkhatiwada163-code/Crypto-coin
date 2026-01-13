const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');

async function deployTokenSale() {
  try {
    // Connect to your network
    const web3 = new Web3('https://ethereum-sepolia-rpc.publicnode.com');
    
    // Read deployment.json to get token contract address
    const deployment = JSON.parse(fs.readFileSync('deployment.json', 'utf8'));
    const tokenAddress = deployment.contractAddress;
    
    console.log('📝 Token Contract Address:', tokenAddress);
    
    // Read the contract source
    const saleSource = fs.readFileSync('TokenSale.sol', 'utf8');
    const tokenSource = fs.readFileSync('MyToken.sol', 'utf8');
    
    // Compile the contract
    console.log('🔧 Compiling TokenSale contract...');
    
    const input = {
      language: 'Solidity',
      sources: {
        'TokenSale.sol': { content: saleSource },
        'MyToken.sol': { content: tokenSource }
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['abi', 'evm.bytecode']
          }
        }
      }
    };
    
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    
    if (output.errors) {
      output.errors.forEach(error => {
        console.log(error.formattedMessage);
      });
      if (output.errors.some(error => error.severity === 'error')) {
        throw new Error('Compilation failed');
      }
    }
    
    const contract = output.contracts['TokenSale.sol']['TokenSale'];
    const abi = contract.abi;
    const bytecode = contract.evm.bytecode.object;
    
    console.log('✅ Compilation successful!');
    
    // Get your account private key from environment or config
    console.log('\n⚠️  To deploy, you need to:');
    console.log('1. Set your private key in environment variable: PRIVATE_KEY');
    console.log('2. Make sure you have enough Sepolia ETH');
    console.log('3. Set token price (in wei per token)');
    console.log('\nExample: export PRIVATE_KEY="your_private_key_here"');
    
    const privateKey = process.env.PRIVATE_KEY;
    
    if (!privateKey) {
      console.log('\n💡 Deployment prepared. Run with PRIVATE_KEY environment variable to deploy.');
      
      // Save ABI and bytecode for manual deployment
      const saleDeployment = {
        abi: abi,
        bytecode: bytecode,
        tokenAddress: tokenAddress,
        tokenPrice: '225000000000000', // 0.000225 ETH per token (approx $0.45 at $2000/ETH)
        instructions: 'Deploy with constructor parameters: (tokenAddress, tokenPrice)'
      };
      
      fs.writeFileSync('token-sale-deployment.json', JSON.stringify(saleDeployment, null, 2));
      console.log('📄 Sale contract details saved to token-sale-deployment.json');
      
      return;
    }
    
    // Deploy the contract
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    
    console.log('\n🚀 Deploying TokenSale contract...');
    console.log('Deployer:', account.address);
    
    const tokenPrice = '225000000000000'; // 0.000225 ETH per token
    
    const TokenSaleContract = new web3.eth.Contract(abi);
    const deployTx = TokenSaleContract.deploy({
      data: '0x' + bytecode,
      arguments: [tokenAddress, tokenPrice]
    });
    
    const gas = await deployTx.estimateGas({ from: account.address });
    const gasPrice = await web3.eth.getGasPrice();
    
    console.log('Estimated gas:', gas);
    console.log('Gas price:', web3.utils.fromWei(gasPrice, 'gwei'), 'gwei');
    
    const tx = await deployTx.send({
      from: account.address,
      gas: gas,
      gasPrice: gasPrice
    });
    
    const saleContractAddress = tx.options.address;
    
    console.log('\n✅ TokenSale deployed to:', saleContractAddress);
    console.log('Token Price:', tokenPrice, 'wei per token (', web3.utils.fromWei(tokenPrice, 'ether'), 'ETH per token)');
    
    // Save deployment info
    const saleDeployment = {
      saleContractAddress: saleContractAddress,
      tokenAddress: tokenAddress,
      deployer: account.address,
      network: 'Sepolia',
      tokenPrice: tokenPrice,
      tokenPriceUSD: '0.45',
      abi: abi,
      deployedAt: new Date().toISOString()
    };
    
    fs.writeFileSync('token-sale-deployment.json', JSON.stringify(saleDeployment, null, 2));
    console.log('📄 Deployment info saved to token-sale-deployment.json');
    
    console.log('\n⚠️  IMPORTANT: Next steps:');
    console.log('1. Transfer tokens to the sale contract:', saleContractAddress);
    console.log('2. Update buy.html to use the new sale contract address');
    console.log('3. Test the purchase flow');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

deployTokenSale();
