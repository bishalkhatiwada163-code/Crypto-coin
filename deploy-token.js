require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');
const solc = require('solc');

async function main() {
    // --- Configure network ---
    // Use public Sepolia RPC by default; override with RPC_URL env if provided
    const rpcUrl = process.env.RPC_URL || 'https://rpc.ankr.com/eth_sepolia';
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    
    // --- Private key ---
    // IMPORTANT: set PRIVATE_KEY in your environment (MetaMask export). Do NOT commit it.
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
        console.error('Missing PRIVATE_KEY. Set it in your environment before running.');
        process.exit(1);
    }

    const wallet = new ethers.Wallet(privateKey, provider);
    
    console.log('Deployer address:', wallet.address);
    
    // Read contract source
    const source = fs.readFileSync('MyToken.sol', 'utf8');
    
    // Compile contract
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
    
    console.log('Compiling contract...');
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    
    if (output.errors) {
        output.errors.forEach(err => console.error(err.formattedMessage));
        if (output.errors.some(e => e.severity === 'error')) {
            process.exit(1);
        }
    }
    
    const contract = output.contracts['MyToken.sol']['MyToken'];
    const abi = contract.abi;
    const bytecode = contract.evm.bytecode.object;
    
    // Deploy contract
    console.log('Deploying MyToken with initial supply of 1,000,000 tokens...');
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const token = await factory.deploy(1000000); // 1 million tokens
    
    await token.waitForDeployment();
    const address = await token.getAddress();
    
    console.log('✅ MyToken deployed to:', address);
    console.log('Token Name:', await token.name());
    console.log('Token Symbol:', await token.symbol());
    console.log('Total Supply:', ethers.formatEther(await token.totalSupply()), 'MTK');
    console.log('Deployer Balance:', ethers.formatEther(await token.balanceOf(wallet.address)), 'MTK');
    
    // Save deployment info
    const deploymentInfo = {
        contractAddress: address,
        deployer: wallet.address,
        network: 'Sepolia',
        rpc: rpcUrl,
        abi: abi
    };
    
    fs.writeFileSync('deployment.json', JSON.stringify(deploymentInfo, null, 2));
    console.log('\n📝 Deployment info saved to deployment.json');
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
