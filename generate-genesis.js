const fs = require('fs');
const RLP = require('rlp');

// Validator addresses (checksummed)
const validators = [
  '0x51b9d20b4827d8c695fb03a69b2942f1a728dd6c',
  '0x6bb4c9467eca0206dc431c246d18de18466065e7',
  '0x8b2bacf13ad51e56b0b7a96733a31213702ac3e0',
  '0xc73a695df1485a0a23c0d83b68f060ad9325dbb1'
];

// Convert addresses to buffers and remove '0x'
const validatorBuffers = validators.map(addr => Buffer.from(addr.slice(2), 'hex'));

// Build extraData structure: RLP([vanity, [validators], vote, round, [seals]])
const vanity = Buffer.alloc(32, 0); // 32 zero bytes
const vote = []; // empty list for vote
const round = Buffer.from([]); // empty buffer represents integer 0
const seals = []; // empty list for seals

// RLP encode the entire QBFT extraData structure
const extraDataEncoded = RLP.encode([vanity, validatorBuffers, vote, round, seals]);
const extraDataBuffer = Buffer.from(extraDataEncoded);
const extraData = '0x' + extraDataBuffer.toString('hex');

console.log('ExtraData:', extraData);

// Genesis config
const genesis = {
  config: {
    chainId: 13371,
    homesteadBlock: 0,
    eip150Block: 0,
    eip155Block: 0,
    eip158Block: 0,
    byzantiumBlock: 0,
    constantinopleBlock: 0,
    petersburgBlock: 0,
    istanbulBlock: 0,
    berlinBlock: 0,
    londonBlock: 0,
    shanghaiTime: 0,
    cancunTime: 0,
    qbft: {
      blockperiodseconds: 2,
      epochlength: 30000,
      requesttimeoutseconds: 4,
      blockreward: '0x0',
      minblocktime: 1
    }
  },
  gasLimit: '0x1312d00',
  difficulty: '0x1',
  baseFeePerGas: '0x3b9aca00',
  alloc: {
    '0x51b9d20b4827d8c695fb03a69b2942f1a728dd6c': { balance: '0x200000000000000000000000000000000000000000000000000000000000000' },
    '0x6bb4c9467eca0206dc431c246d18de18466065e7': { balance: '0x200000000000000000000000000000000000000000000000000000000000000' },
    '0x8b2bacf13ad51e56b0b7a96733a31213702ac3e0': { balance: '0x200000000000000000000000000000000000000000000000000000000000000' },
    '0xc73a695df1485a0a23c0d83b68f060ad9325dbb1': { balance: '0x200000000000000000000000000000000000000000000000000000000000000' }
  },
  extraData: extraData,
  timestamp: '0x0',
  nonce: '0x0',
  mixHash: '0x' + Buffer.alloc(32, 0).toString('hex')
};

fs.writeFileSync('nodes/genesis.json', JSON.stringify(genesis, null, 2));
console.log('Genesis written to nodes/genesis.json');
