const SeedMerkle = artifacts.require("SeedMerkle");

module.exports = function(deployer) {
  deployer.deploy(SeedMerkle);
};
