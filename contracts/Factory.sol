pragma solidity ^0.5.0;
import "./Exchangedata.sol";

contract Factory {

    uint256 public exchangesCounter;

    mapping(uint256 => Exchangedata) public exchangedatas;

    uint256 public n;
    uint256 public p;
    uint256 public collateral;
    address payable public provider;

//     constructor() payable public {
//         provider = msg.sender;
//   }

      constructor(uint256 _n, uint256 _p, uint256 _collateral) payable public {
        require(msg.value >= _collateral, "Must be more or equal than the collateral.");
        n = _n;
        p = _p;
        collateral = _collateral;
        provider = msg.sender;
     }

     event SCcreated(
        Exchangedata exchangedata
     );


   function createChildContract() public payable{
      // insert check if the sent ether is enough to cover the SC ...
      require(msg.value >= (p+collateral), "Must be more or equal than the price + collateral.");
      require(address(this).balance > collateral, "Provider must pay collateral to");
      exchangesCounter ++;
      exchangedatas[exchangesCounter] = new Exchangedata(n, p, collateral, msg.sender, provider);
      address(exchangedatas[exchangesCounter]).transfer(msg.value+collateral);
      emit SCcreated(exchangedatas[exchangesCounter]);
   }

   function() external payable {} //fallback

   function finish() external{
      require (msg.sender == provider, "Must be the provider to finish the contract");
      selfdestruct(provider);
   }
}