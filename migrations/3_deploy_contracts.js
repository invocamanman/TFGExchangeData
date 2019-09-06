const MerkleTreesMock = artifacts.require("MerkleTreesMock");

module.exports = function(deployer) {
  deployer.deploy(MerkleTreesMock);
};
