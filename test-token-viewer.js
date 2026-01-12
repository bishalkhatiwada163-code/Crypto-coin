const { ethers } = require('ethers');

// Embedded configs from workspace JSON files
const CONFIGS = {
  local: {
    rpc: 'http://127.0.0.1:8545',
    tokenAddress: '0xe0e594CDD2991808B82BC0519F57029EF67Ec8f3',
    defaultAccount: '0x51b9D20b4827D8c695FB03a69B2942F1A728Dd6c',
  },
  sepolia: {
    rpc: 'https://ethereum-sepolia-rpc.publicnode.com',
    tokenAddress: '0x5b98245823904bF6e1492F7C2c6C3cFdf7130F1c',
    defaultAccount: '0xEdd70bd1258c4D3902E3a1fCe7E32D579dF91273',
  },
};

const ERC20_ABI = [
  { name: 'name', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
  { name: 'symbol', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
  { name: 'decimals', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] },
  { name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }] },
];

async function main() {
  const network = process.argv[2] || 'sepolia';
  const address = process.argv[3] || CONFIGS[network]?.defaultAccount || '';
  const cfg = CONFIGS[network];
  if (!cfg) {
    console.error('Unknown network. Use: local | sepolia');
    process.exit(1);
  }

  console.log('Network:', network);
  console.log('RPC:', cfg.rpc);
  console.log('Token:', cfg.tokenAddress);
  console.log('Account:', address || '(none)');

  const provider = new ethers.JsonRpcProvider(cfg.rpc);
  const contract = new ethers.Contract(cfg.tokenAddress, ERC20_ABI, provider);

  const [name, symbol, decimals] = await Promise.all([
    contract.name(),
    contract.symbol(),
    contract.decimals(),
  ]);
  console.log('Name:', name);
  console.log('Symbol:', symbol);

  if (address) {
    const bal = await contract.balanceOf(address);
    console.log('Balance:', `${ethers.formatUnits(bal, decimals)} ${symbol}`);
  } else {
    console.log('Balance: (provide an address)');
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
