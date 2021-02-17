pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
  string public name = "Dapp Token Farm";
  address public owner;
  DappToken public dappToken;
  DaiToken public daiToken;

  address[] public stakers;
  mapping(address => uint) public stakingBalance;
  mapping(address => bool) public hasStaked;
  mapping(address => bool) public isStaking;

  constructor(DappToken _dappToken, DaiToken _daiToken) public {
    dappToken = _dappToken;
    daiToken = _daiToken;
    owner = msg.sender;
  }

//Stack Tokens (Deposit)
  function stakeTokens(uint _amount) public {

    //Require amount > 0
      require(_amount > 0,  "amount cannot be 0");

      // Transfer moke dai token to this contract for stacking
      daiToken.transferFrom(msg.sender, address(this), _amount);

      //Update Stacking Balance
      stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

      //Add user to stackers array only if they haven't stacked already
      if(!hasStaked[msg.sender]){
        stakers.push(msg.sender);
      }

      //Updating stacking status
      isStaking[msg.sender] = true;
      hasStaked[msg.sender] = true;
    }

//Unstaking tokens
  function unstakeToken() public {
    //Fetch the staking balance
    uint balance = stakingBalance[msg.sender];

    //Require amount > 0
    require(balance > 0, "staking balance cannot be 0");

    //Transfer Mock Dai tokens to this contract for staking
    daiToken.transfer(msg.sender, balance);

    //Reset staking balance
    stakingBalance[msg.sender] = 0;

    //Update Staking Status
    isStaking[msg.sender] = false;
  }

//Issuing Tokens
  function issueTokens() public {

    //Only caller can call this function
    require(msg.sender == owner, "caller must be the owner");

    //Issue Token for all stackers
    for (uint i=0; i<stakers.length; i++) {
      address recipient = stakers[i];
      uint balance = stakingBalance[recipient];
      if(balance > 0) {
          dappToken.transfer(recipient, balance);
      }
    }
  }
}
