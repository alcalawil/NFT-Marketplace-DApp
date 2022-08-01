const HDWalletProvider = require('@truffle/hdwallet-provider');
//
// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();

require('dotenv').config();
const infuraKey = process.env["INFURA_API_KEY"];
const privateKey = process.env["DEPLOYER_PRIVATE_KEY"];

console.log(">>> infuraKey: " + infuraKey);
console.log(">>> privateKey: " + privateKey);

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    ropsten: {
      provider: () => new HDWalletProvider(privateKey, `https://ropsten.infura.io/v3/${infuraKey}`),
      network_id: 3,       // Ropsten's id
      gas: 5500000,        // Ropsten has a lower block limit than mainnet
      confirmations: 2,    // # of confirmations to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true,    // Skip dry run before migrations? (default: false for public nets )
      networkCheckTimeout: 1000000,
      timeoutBlocks: 200
    },
    //
    // Useful for private networks
    // private: {
    //   provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
    //   network_id: 2111,   // This network is yours, in the cloud.
    //   production: true    // Treats this network as if it was a public net. (default: false)
    // }
  },
  mocha: {
    // timeout: 100000,
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.15"
    }
  },
};
