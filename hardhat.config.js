//

require('dotenv').config();
require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  etherscan: {
    api: process.env.ETHERSCAN_API_KEY
  },
  networks: {
    mainnet: {
      accounts: [process.env.MASANGRI_TESTNET_PRIVATE_KEY],
      chainId: 1,
      url: process.env.ALCHEMY_MAINNET_HTTP,
    },
    rinkeby: {
      accounts: [process.env.MASANGRI_TESTNET_PRIVATE_KEY],
      url: process.env.ALCHEMY_RINKEBY_HTTP,
    }
  },
  solidity: "0.8.4",
};
