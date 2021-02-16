pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";


contract TokenFarm {
  // All  code goes here ..

  string public name = "Dapp Token Farm";

  DappToken public dappToken;
  DaiToken public daiToken;

  address[] public stackers;
  mapping(address => uint) public stackingBalance;
  mapping(address => bool) public hasStacked;
  mapping(address => bool) public isStacking;

  constructor(DappToken _dappToken, DaiToken _daiToken) public {
    dappToken = _dappToken;
    daiToken = _daiToken;
  }

  //1. Stack Tokens (Deposit)
    function stakeTokens(uint _amount) public{
      //Code goes here
        // Transfer moke dai token to this contract for stacking
          daiToken.transferFrom(msg.sender, address(this), _amount);

        //Update Stacking Balance
          stackingBalance[msg.sender] = stackingBalance[msg.sender] + _amount;

        //Add user to stackers array only if they haven't stacked already
        if(!hasStacked[msg.sender]){
          stackers.push(msg.sender);
        }

        //Updating stacking status
        isStacking[msg.sender] = true;
        hasStacked[msg.sender] = true;

}
  //2. Unstack Tokens (Withdraw)
  //3. Issuing Tokens

}
