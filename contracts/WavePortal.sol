// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WavePortal is Ownable, VRFConsumerBaseV2 {

  struct Wave {
    address waver;
    string message;
    uint256 timestamp;
  }
  Wave[] waves;
  mapping(address => uint) public records;
  event NewWave(address indexed from, uint256 timestamp, string message);

  uint256 prizeAmount = 0.0001 ether;

  // Chainlink
  VRFCoordinatorV2Interface COORDINATOR;
  LinkTokenInterface LINKTOKEN;

  uint64 private subscriptionId;
  address vrfCoordinator = 0x6168499c0cFfCaCD319c818142124B7A15E857ab;
  address linkTokenContract = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709;
  bytes32 keyHash = 0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;
  uint callbackGasLimit = 32000;
  uint16 requestConfirmations = 3;
  event RandomValueGenerated(uint256 requestId, uint256 randomValue);

  constructor(uint64 _subscriptionId) VRFConsumerBaseV2(vrfCoordinator) payable {
    console.log("We like the con+cats!");

    // Chainlink
    COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
    LINKTOKEN = LinkTokenInterface(linkTokenContract);
    subscriptionId = _subscriptionId;
  }

  function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {

      // transform the result to a number between 1 and 100 inclusively
      uint256 randomValue = (randomWords[0] % 100) + 1;

      // emitting event to signal that dice landed
      emit RandomValueGenerated(requestId, randomValue);
  }

  function wave(string memory _message) public {
    waves.push(
      Wave(msg.sender, _message, block.timestamp)
    );
    records[msg.sender] += 1;
    console.log("[%s] waved w/ Message: '%s'", msg.sender, _message);
    emit NewWave(msg.sender, block.timestamp, _message);

    // Simple way
    uint256 senderSeed = uint(keccak256(abi.encodePacked(msg.sender))) % 1000;
    uint256 seed = ((block.difficulty + block.timestamp + senderSeed) % 100) + 1;

    // Chainlink
    // TODO

    console.log('Random number generated between 1 and 100:', seed);

    if (seed <= 50) {
      require(
        prizeAmount <= address(this).balance,
        "Trying to withdraw more ETH than the contract has."
      );
      (bool success,) = (msg.sender).call{value: prizeAmount}("");
      require(success, "Failed to withdraw money from contract.");
      console.log("Thanks for waving. You won some ETH too!");
    } else {
      console.log("Thanks for waving. No ETH for you this time...");
    }

  }

  function getAllWaves() public view returns (Wave[] memory) {
      return waves;
  }

  function getTotalWaves() public view returns (uint256) {
    console.log("%s waves total ([%s] has waved %s time(s))", waves.length, msg.sender, records[msg.sender]);
    return waves.length;
  }
}
