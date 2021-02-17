const DaiToken = artifacts.require('DaiToken');
const DappToken = artifacts.require('DappToken');
const TokenFarm = artifacts.require('TokenFarm');

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('TokenFarm', ([owner, investor]) => {
  let daiToken, dappToken, tokenFarm

  before(async () => {

    // Load Contracts
    daiToken = await DaiToken.new()
    dappToken = await DappToken.new()
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

    // Transfer all Dapp tokens to farm (1 million)
    await dappToken.transfer(tokenFarm.address, tokens('1000000'))

    // Send tokens to investor
    await daiToken.transfer(investor, tokens('100'), { from: owner })
  })

    describe('Mock DAI deployment', async () => {
      it('has a name', async () => {
        const name = await daiToken.name()
          assert.equal(name, 'Mock DAI Token')
        })
      })

    describe('Dapp Token deployment', async () => {
      it('has a name', async () => {
        const name = await dappToken.name()
        assert.equal(name, 'DApp Token')
      })
    })

    describe('Token Farm deployment', async () => {
      it('has a name', async () => {
        const name = await tokenFarm.name()
        assert.equal(name, 'Dapp Token Farm')
      })

      it('contract has tokens', async () => {
        let balance = await dappToken.balanceOf(tokenFarm.address)
        assert.equal(balance.toString(), tokens('1000000'))
      })
    })

    describe('Farming Tokens', async () =>
      it('reward investors for staking mDai token', async () => {
        let result

        //Check investor Balance before staking
        result = await daiToken.balanceOf(investor)
        assert.equal(result.toString(),tokens('100'),'investor balance Mock Dai is correct before staking')

        //Stak Mock Dai tokens
        await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor })
        await tokenFarm.stakeTokens(tokens('100'), { from: investor })

        //Check staking result
        result = await daiToken.balanceOf(investor)
        assert.equal(result.toString(),tokens('0'),'investor balance Mock Dai is correct before staking')

        result = await daiToken.balanceOf(tokenFarm.address)
        assert.equal(result.toString(),tokens('100'),'Token Farm Mock DAI balance is correct after staking')

        result = await tokenFarm.stakingBalance(investor)
        assert.equal(result.toString(),tokens('100'),'investor staking balance is correct before staking')

        result = await tokenFarm.isStaking(investor)
        assert.equal(result.toString(), 'true' ,'investor staking balance is correct before staking')

        //Issue tokens
        await tokenFarm.issueTokens({ from: owner})

        //Check balances after Issuiance
        result = await dappToken.balanceOf(investor )
        assert.equal(result.toString(),tokens('100'),'investor DApp Token Wallet balance correct after inssuring')

        //Ensure that only owner can issue token
        await tokenFarm.issueTokens({ from: investor}).should.be.rejected;

        //Unstak Tokens
        await tokenFarm.unstakeToken({ from: investor })

        //Check results after unstaking
        result = await daiToken.balanceOf(investor)
        assert.equal(result.toString(),tokens('100'),'investor Mock Dai wallet balance correct after staking')

        result = await daiToken.balanceOf(tokenFarm.address)
        assert.equal(result.toString(),tokens('0'),'Token Farm Mock DAI balance correct after staking')

        result = await tokenFarm.stakingBalance(investor)
        assert.equal(result.toString(),tokens('0'),'investor staking balance  correct after staking')

        result = await tokenFarm.isStaking(investor)
        assert.equal(result.toString(), 'false', 'investor staking balance is correct before staking')

      })
)})
