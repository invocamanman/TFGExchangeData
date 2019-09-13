pragma solidity ^0.5.0;
import "./MerkleTrees.sol";


contract Exchangedata {


uint256 public n;
uint256 public p;
uint256 public collateral;
address payable public provider;
address payable public consumer;
bytes32 public MRC;
bytes32 public MRK;
bytes public seed;
uint256 public nleaves;

 constructor(uint256 _n, uint256 _p, uint256 _collateral, address payable _consumer, address payable _provider ) payable public {
    provider = _provider;
    consumer = _consumer;
    n = _n;
    p = _p;
    collateral = _collateral;
    //jver que ha pagaod en la factory
  }

  modifier onlyProvider {
  require(msg.sender == provider, "Only provider can call this function.");
  _;}

  modifier onlyConsumer {
  require(msg.sender == consumer, "Only consumer can call this function.");
  _;}

enum Stages {
        WaitForMR,
        WaitforConfirm,
        waitforSeed,
        WaitforResolution,
        finish
    }
Stages public stage = Stages.WaitForMR;

uint public lasttimestamp = now;


     event refund(
        bool correct
     );

    modifier atStage(Stages _stage) {
        require(stage == _stage, "Must be the correct stage");
        _;
    }

    modifier transitionAfter() {
        _;
        nextStage();
    }
    
    modifier timedTransitions() {
        if (stage == Stages.WaitForMR && now >= lasttimestamp + 6 days) {//timepo de bloque
            Refund(); //revert?
        }
        if (stage == Stages.WaitforConfirm && now >= lasttimestamp + 6 days) {
            Refund();
        }
        if (stage == Stages.WaitforResolution && now >= lasttimestamp + 6 days) {
            Withdraw();//??? es una transacción, esto esta bien?
        }
        _;
    }

    function SetMR(bytes32 _MRK, bytes32 _MRC) public onlyProvider timedTransitions atStage(Stages.WaitForMR)  transitionAfter{
      MRK = _MRK;
      MRC = _MRC;
    }

    function confirm() public onlyConsumer timedTransitions atStage(Stages.WaitforConfirm) transitionAfter {
      //y ya esstá no?
    }

    function releaseSeed(bytes memory _seed, uint256 _nleaves) public onlyProvider timedTransitions
    atStage(Stages.waitforSeed) transitionAfter {//transition after?¿
      seed = _seed;
      nleaves = _nleaves;
    }

    function conflict()public atStage(Stages.WaitforResolution) timedTransitions transitionAfter{
      //pasa las seeds:

      bytes32 seedroot = computeRoot();

      if(seedroot==MRK){
         emit refund(false);
         consumer.transfer(collateral);
         selfdestruct(provider);
      }
      else
        emit refund(true);
        selfdestruct(consumer);
      //tengo que comproar la seed es correcta con la markle prrof de las keys, =?¿?¿?¿?¿?¿?¿?¿?¿?¿?¿?¿?¿? semilla+i hash ( me salen 10 claves)
    }

    function cleanup() public atStage(Stages.finish) {
        selfdestruct(consumer);//la addres se llevará todo el ether, provider o consumer?
    }
    
    function Withdraw() public onlyProvider atStage(Stages.WaitforResolution) {
       require(now >= lasttimestamp + 6 days, "Must pass some time");

       //provider.transfer(mul(n,p)); //some ether  address(this).balance
       selfdestruct(provider);//??
     }

    function Cancel() public {
       require(stage == Stages.WaitForMR || stage == Stages.WaitforConfirm, "Must be in that states");
       if(msg.sender == provider)
       {
       consumer.transfer(p);
       selfdestruct(address(this));//burn ether
       }
       if(msg.sender == consumer)
       {
       consumer.transfer(p);
       selfdestruct(address(this));//burn ether
       }
     }

    function nextStage() internal {
        stage = Stages(uint(stage) + 1);
        lasttimestamp = now;
    }
    function Refund() internal {
        selfdestruct(consumer);
    }

//save math
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        uint256 c = a - b;

        return c;
    }
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/52
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0, "SafeMath: division by zero");
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }
//createmerkle tree
    using MerkleTrees for MerkleTrees.Tree;

    function computeRoot() internal returns (bytes32)
    {
        bytes32[] memory leaves = new bytes32[](nleaves);

        for (uint256 i = 0; i < nleaves; i++){
            leaves[i] = keccak256(abi.encodePacked(uint8(i),seed));
        }
        MerkleTrees.Tree memory tree = MerkleTrees.newTree(leaves.length);
        for (uint256 i = 0; i < leaves.length; i++) {
            tree.setLeafDataBlock(i, abi.encodePacked(leaves[i]));
        }
        return tree.computeRoot();
    }

    function() external payable {}//fallback
}