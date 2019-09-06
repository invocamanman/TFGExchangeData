pragma solidity ^0.5.0;

import "./MerkleTrees.sol";

contract SeedMerkle {
    bytes32 public rootmerkle;
    bytes32[] public leaves2;
    bytes public test;
    bytes public test2;

    event merkleroot(
        bytes32 merkle
    );

    function _split(bytes memory concatenated, uint256[] memory sizes)
        internal
        pure
        returns (bytes[] memory parts)
    {
        parts = new bytes[](sizes.length);
        uint256 k = 0;
        for (uint256 i = 0; i < sizes.length; i++) {
            uint256 size = sizes[i];
            parts[i] = new bytes(size);
            for (uint256 j = 0; j < size;) {
                parts[i][j++] = concatenated[k++];
            }
        }
        assert(k == concatenated.length);
    }

    using MerkleTrees for MerkleTrees.Tree;

    function computeRoot(bytes memory seed, uint256 nleaves) public
    {
        bytes32[] memory leaves = new bytes32[](nleaves);

        for (uint256 i = 0; i < nleaves; i++){
            leaves[i] = keccak256(abi.encodePacked(uint8(i),seed));
        }
        leaves2 = leaves;
        MerkleTrees.Tree memory tree = MerkleTrees.newTree(leaves.length);
        for (uint256 i = 0; i < leaves.length; i++) {
            tree.setLeafDataBlock(i, abi.encodePacked(leaves[i]));
        }
        rootmerkle = tree.computeRoot();
        emit merkleroot(rootmerkle);
    }

    function verifyProof(
        bytes32 root,
        bytes memory leafData,
        bytes32[] memory proof
    )
        public
        pure
        returns (bool)
    {
        return MerkleTrees.verifyProof(root, leafData, proof);
    }

}