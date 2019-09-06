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
      exchangesCounter ++;
      exchangedatas[exchangesCounter] = new Exchangedata(n, p, collateral, msg.sender, provider);
      emit SCcreated(exchangedatas[exchangesCounter]);
   }

}