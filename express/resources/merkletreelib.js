const { toBuffer, keccak256, bufferToHex } = require('ethereumjs-util');

const EMPTY_PROOF = [];

class MerkleTreeBuilder {
  constructor ({ hashDataBlock, hashNodePair }) {
    this._hashDataBlock = hashDataBlock;
    this._hashNodePair = hashNodePair;
  }

  _build (nodes) {
    if (nodes.length === 1) {
      const [root] = nodes;
      return { root, proofs: [EMPTY_PROOF] };
    } else {
      const midpoint = 2 ** Math.ceil(Math.log2(nodes.length)) / 2; //coge la potencia de 2 mśa grande como punto medio (o bien si es una pontencia de dos, la mitad) //todo el sentido del mundo pq merkle tree binario
      const subTreeL = this._build(nodes.slice(0, midpoint));
      const subTreeR = this._build(nodes.slice(midpoint));//reciproco, de manera que devuelve la rrot y la proof de estos
      const { root: subRootL, proofs: subProofsL } = subTreeL;
      const { root: subRootR, proofs: subProofsR } = subTreeR;
      const root = this._hashNodePair(subRootL, subRootR);
      const proofs = [
        ...subProofsL.map(subProofL => [...subProofL, subRootR]),
        ...subProofsR.map(subProofR => [...subProofR, subRootL]),
      ];
      return { root, proofs };
    }
  }

  bufBuild (dataBlocks) {
    return this._build(dataBlocks.map(dataBlock => this._hashDataBlock(dataBlock)));
  }

  bufVerifyProof (proof, root, dataBlock) {
    const node = this._hashDataBlock(dataBlock);
    return proof.reduce((node1, node2) => this._hashNodePair(node1, node2), node).equals(root);
  }

  buildMerkleTree (hexDataBlocks) {
    const bufDataBlocks = hexDataBlocks.map(toBuffer);
    const { root: bufRoot, proofs: bufProofs } = this.bufBuild(bufDataBlocks);
    const hexRoot = bufferToHex(bufRoot);
    const hexProofs = bufProofs.map(bufProof => bufProof.map(bufferToHex));
    return { root: hexRoot, proofs: hexProofs };
  }

  verifyProof (hexProof, hexRoot, hexDataBlock) {
    return this.bufVerifyProof(hexProof.map(toBuffer), toBuffer(hexRoot), toBuffer(hexDataBlock));
  }
}

const PREFIX_00 = toBuffer('0x00');
const PREFIX_01 = toBuffer('0x01');

const MerkleTreeLibrary = new MerkleTreeBuilder({
  hashDataBlock (dataBlock) {
    return keccak256(Buffer.concat([PREFIX_00, dataBlock]));//para rpevenir posible ataques, un atacante podria poner otros niveles que no fuesen elprimero, por eso todos los nivelesde abajo deben empezar por 00
  },
  hashNodePair (node1, node2) {
    return keccak256(Buffer.concat([PREFIX_01, ...[node1, node2].sort(Buffer.compare)]));
  },
});


const zip = (...unzippeds) =>
  unzippeds.some(({ length }) => length === 0)
    ? []
    : [unzippeds.map(([head]) => head), ...zip(...unzippeds.map(([, ...tail]) => tail))];

const genIntSequence = n => {
  const result = new Array(n);
  for (let i = 0; i < n; i++) {
    result[i] = i;
  }
  return result;
};

module.exports = {
  MerkleTreeLibrary,
  arrayUtils: {
    zip,
    genIntSequence,
  },
};