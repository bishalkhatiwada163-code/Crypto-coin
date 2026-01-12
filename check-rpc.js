const { ethers } = require('ethers');

async function main() {
  const url = 'http://127.0.0.1:8545';
  const provider = new ethers.JsonRpcProvider(url, undefined, { staticNetwork: undefined });
  try {
    const block = await provider.getBlockNumber();
    console.log('RPC OK at', url, 'block =', block);
    process.exit(0);
  } catch (e) {
    console.error('RPC NOT READY:', e.message);
    process.exit(1);
  }
}

main();
