exports.MerkleseedAddress = '0xC506276Fc6A4A23dCCf8784871Dc48154bD7015c'

exports.MerkleseedABI= [
  {
    "constant": true,
    "inputs": [],
    "name": "rootmerkle",
    "outputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "merkle",
        "type": "bytes32"
      }
    ],
    "name": "merkleroot",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "seed",
        "type": "uint256"
      },
      {
        "name": "nleaves",
        "type": "uint256"
      }
    ],
    "name": "computeRoot",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "root",
        "type": "bytes32"
      },
      {
        "name": "leafData",
        "type": "bytes"
      },
      {
        "name": "proof",
        "type": "bytes32[]"
      }
    ],
    "name": "verifyProof",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "pure",
    "type": "function"
  }
]
exports.MerkleAddress = '0x0A3a3EfA9A489e3121C163BCC519CF0562d69c98'

exports.MerkleABI =  [
  {
    "constant": true,
    "inputs": [],
    "name": "rootmerkle",
    "outputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "merkle",
        "type": "bytes32"
      }
    ],
    "name": "merkleroot",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "concatenatedLeafData",
        "type": "bytes"
      },
      {
        "name": "leafDataLengths",
        "type": "uint256[]"
      }
    ],
    "name": "computeRoot",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "root",
        "type": "bytes32"
      },
      {
        "name": "leafData",
        "type": "bytes"
      },
      {
        "name": "proof",
        "type": "bytes32[]"
      }
    ],
    "name": "verifyProof",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "pure",
    "type": "function"
  }
]


exports.FACTORY_ADDRESS = '0x1A90A2EF90D19f10d693A3BfAcEA929423Cf92D0'

exports.FACTORY_ABI =[
  {
    "constant": true,
    "inputs": [],
    "name": "provider",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "n",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "exchangesCounter",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "exchangedatas",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "p",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "collateral",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_n",
        "type": "uint256"
      },
      {
        "name": "_p",
        "type": "uint256"
      },
      {
        "name": "_collateral",
        "type": "uint256"
      }
    ],
    "payable": true,
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "exchangedata",
        "type": "address"
      }
    ],
    "name": "SCcreated",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "createChildContract",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  }
]

exports.Exchangedata_ABI =[
  {
    "constant": true,
    "inputs": [],
    "name": "MRK",
    "outputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "provider",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "n",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "lasttimestamp",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "MRC",
    "outputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "nleaves",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "seed",
    "outputs": [
      {
        "name": "",
        "type": "bytes"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "p",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "consumer",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "stage",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "collateral",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_n",
        "type": "uint256"
      },
      {
        "name": "_p",
        "type": "uint256"
      },
      {
        "name": "_collateral",
        "type": "uint256"
      },
      {
        "name": "_consumer",
        "type": "address"
      },
      {
        "name": "_provider",
        "type": "address"
      }
    ],
    "payable": true,
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "correct",
        "type": "bool"
      }
    ],
    "name": "refund",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_MRK",
        "type": "bytes32"
      },
      {
        "name": "_MRC",
        "type": "bytes32"
      }
    ],
    "name": "SetMR",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "confirm",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_seed",
        "type": "bytes"
      },
      {
        "name": "_nleaves",
        "type": "uint256"
      }
    ],
    "name": "releaseSeed",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "conflict",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "cleanup",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "Withdraw",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "Cancel",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
]