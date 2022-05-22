//

// const hre;
require('dotenv').config();

const main = async () => {
  const chanlinkSubscriptionId = process.env['RINKEBY_CHAINLINK_SUBSCRIPTION_ID'];
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy(
    chanlinkSubscriptionId,
    {
      value: hre.ethers.utils.parseEther('0.1')
    }
  );

  await waveContract.deployed();

  console.log(`Contract deployed to: [${waveContract.address}]`);
  console.log(`Contract deployed by: [${owner.address}]`);

  let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log('Contract balance:', hre.ethers.utils.formatEther(contractBalance));

  let waveCount;
  waveCount = await waveContract.getTotalWaves();
  console.log('Total waves:', waveCount.toNumber());

  let waveTxn = await waveContract.wave('Owner\'s Message');
  await waveTxn.wait();

  waveTxn = await waveContract.connect(randomPerson).wave('Visitor\'s Message');
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();
  console.log('Total waves:', waveCount.toNumber());

  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log('Contract balance:', hre.ethers.utils.formatEther(contractBalance));

  let waves = await waveContract.getAllWaves();
  console.log(waves);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
