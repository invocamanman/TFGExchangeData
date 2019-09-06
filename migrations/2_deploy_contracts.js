const Factory = artifacts.require("Factory");

module.exports = function(deployer) {
  deployer.deploy(Factory,100,1000,50);
};
