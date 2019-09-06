//https://github.com/dwardu/openzeppelin-solidity/tree/feature/merkle-root
pragma solidity ^0.5.0;

/**
 * @title Generic Merkle-tree library
 * @author Edward Grech (@dwardu)
 * @notice Functions to compute a Merkle-root and verify a Merkle-proof.
 * @dev The Merkle-tree implementation in this library uses different
 * hashing functions for leaves and node-pairs, to guard against second pre-image attacks.
 * See https://flawed.net.nz/2018/02/21/attacking-merkle-trees-with-a-second-preimage-attack/
 * Leaf data is passed to both functions unhashed.
 */
library MerkleTrees {

    function _hashLeafData(bytes memory leafDataBlock) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(bytes1(0x00), leafDataBlock));
    }

    function _hashNodePair(bytes32 h1, bytes32 h2) internal pure returns (bytes32) {
        return keccak256(
            h1 < h2
                ? abi.encodePacked(bytes1(0x01), h1, h2)
                : abi.encodePacked(bytes1(0x01), h2, h1)
        );
    }

    using MerkleTrees for Tree;

    struct Tree {
        /**
         * @dev Used as a guard against computing the root more than once, as
         * the first computation destroys the original leaf nodes.
         */
        bytes32[] _nodes;

        /**
         * @dev Used as a guard against computing the root more than once, as
         * the first computation overwrites the original leaf nodes.
         */
        bool _wasRootComputed;
    }

    /**
     * @notice The first step towards computing a Merkle root is to allocate
     * a new tree by calling this function.
     */
    function newTree(uint256 size) internal pure returns (Tree memory tree) {
        assert(1 <= size);
        tree._nodes = new bytes32[](size);
        tree._wasRootComputed = false;
    }

    /**
     * @notice After allocating a tree, this function should be called
     * with each leaf data block.
     */
    function setLeafDataBlock(Tree memory self, uint256 index, bytes memory leafDataBlock) internal pure {
        self._nodes[index] = _hashLeafData(leafDataBlock);
    }

    /**
     * @notice Once the tree has been allocated and the leaves set,
     * this function is called to compute the Merkle root.
     * @return The Merkle root.
     */
    function computeRoot(Tree memory self) internal pure returns (bytes32 root) {
        assert(!self._wasRootComputed);

        uint256 nCurr = self._nodes.length;

        while (1 < nCurr) {

            // We pair and hash sibling elements in the current layer starting from
            // the left to the right, and store the hashes in the next layer.
            // If nCurr is odd, then the right-most element in current layer will
            // remain unpaired - we do not account for it in `nNext` right now, as
            // `nCurr / 2` rounds down, but we will account for it later.
            uint256 nNext = nCurr / 2;

            // Loop over all paired sibling elements
            for (uint256 iNext = 0; iNext < nNext; iNext++) {
                uint256 iCurr = iNext * 2;
                self._nodes[iNext] = _hashNodePair(
                    self._nodes[iCurr],
                    self._nodes[iCurr + 1]
                );
            }

            // If the right-most element remained unpaired, promote it to the
            // end of the next layer, and increment nNext to account for it.
            if (nCurr % 2 == 1) {
                self._nodes[++nNext - 1] = self._nodes[nCurr - 1];
            }

            nCurr = nNext;
        }

        self._wasRootComputed = true;

        return self._nodes[0];
    }

    /**
     * @notice Verifies a Merkle proof proving the existence of a leaf data
     * block in a Merkle tree.
     * @param root The root of the Merkle tree to verify the proof against.
     * @param leafDataBlock The leaf data block (unhashed) whose exitence to verify.
     * @param proof Merkle proof containing sibling hashes on the branch from
     * the leaf to the root of the Merkle tree.
     */
    function verifyProof(
        bytes32 root,
        bytes memory leafDataBlock,
        bytes32[] memory proof
    )
        internal
        pure
        returns (bool)
    {
        bytes32 computedHash = _hashLeafData(leafDataBlock);

        for (uint256 i = 0; i < proof.length; i++) {
            computedHash = _hashNodePair(computedHash, proof[i]);
        }

        return computedHash == root;
    }

}
