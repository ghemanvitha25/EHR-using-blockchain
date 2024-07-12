require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
     // URL of your local Ethereum node
      chainId: 1337, // Chain ID of your local network
    },
    
  },
};
