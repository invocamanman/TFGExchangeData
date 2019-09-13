const Factory = artifacts.require("Factory");

module.exports = function(deployer) {
  deployer.deploy(Factory,"50","4000000000000000000","1000000000000000000", {from: "0x53878D5E54C6A8d115853cBD663bEfD07b5b118D", value:20000000000000000000}); //n p collateral
};
