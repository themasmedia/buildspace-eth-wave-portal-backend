//
require('dotenv').config();

const main = async () => {
  const chanlinkSubscriptionId = process.env['RINKEBY_CHAINLINK_SUBSCRIPTION_ID'];

  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log("Deploying contracts with account: %s", deployer.address);
  console.log("Account balance: %s", accountBalance.toString());

  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy(
    chanlinkSubscriptionId,
    {
      value: hre.ethers.utils.parseEther("0.01")
    }
  );
  await waveContract.deployed();

  console.log("WavePortaal contract address: %s", waveContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
