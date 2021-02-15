const TokenFarm = artifacts.require("TokenFarm");
const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");

module.exports = async function(deployer, network, accounts) {

  //Deploy MockDaiToken
  await deployer.deploy(DaiToken)
  const daiToken = await DaiToken.deployed()

  //Deploy DappToken
  await deployer.deploy(DappToken)
  const dappToken = await DappToken.deployed()

  //Deploy TokenFarm
  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address)
  const tokenFarm = await TokenFarm.deployed()

  //Transfer all Token to TokenFarm (1million)
  await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')

  //Transfer 100 Mock Dai tokens to investors
  await daiToken.transfer(accounts[1], '10000000000000000000' )

};
