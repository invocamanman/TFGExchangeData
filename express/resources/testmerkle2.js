const { bufferToHex, toBuffer } = require('ethereumjs-util');
const {
  arrayUtils: { zip, genIntSequence },
} = require('./merkletreelib');
const { MerkleTreeLibrary } = require('./merkletreelib');
var Web3 = require('web3');
var sigUtil = require('eth-sig-util')


var Tx = require('ethereumjs-tx')

const account = '0x53878D5E54C6A8d115853cBD663bEfD07b5b118D' //ganache default account

const url=  "http://localhost:7545" //"http://10.96.100.10:8545" "http://localhost:7545"


var config = require ('./config');


//const bytesArray = (...strings) => strings.map(s => bufferToHex(toBuffer(s)));



    
    //   const dataBlocks = bytesArray('p', 'qq', 'rrr', 'ssss');
    //   const { root, proofs } = MerkleTreeLibraryjs.buildMerkleTree(dataBlocks);
    //   await Promise.all(
    //     zip(dataBlocks, proofs).map(async ([dataBlock, proof]) => {
    //       expect(await this.MerkleTrees.verifyProof(root, dataBlock, proof)).to.equal(true);
    //     })
    //   );
 

    //   const correctLeaves = bytesArray('p', 'qq', 'rrr', 'ssss');
    //   const { root: correctRoot } = MerkleTreeLibraryjs.buildMerkleTree(correctLeaves);

    //   const badLeaves = bytesArray('t', 'u', 'v');
    //   const { proofs: badProofs } = MerkleTreeLibraryjs.buildMerkleTree(badLeaves);

    //   await Promise.all(
    //     zip(correctLeaves, badProofs).map(async ([correctLeaf, badProof]) => {
    //       expect(await this.MerkleTrees.verifyProof(correctRoot, correctLeaf, badProof)).to.equal(false);
    //     })
    //   );

    
    //   const leaves = bytesArray('x', 'y', 'z');

    //   const { root, proofs } = MerkleTreeLibraryjs.buildMerkleTree(leaves);

    //   const [leaf0, proof0] = zip(leaves, proofs)[0];

    //   const badProof0 = proof0.slice(0, proof0.length - 1);

    //   expect(await this.MerkleTrees.verifyProof(root, leaf0, badProof0)).to.equal(false);
  
    let MerkleTreeLibraryjs = MerkleTreeLibrary

      // '0x00', '0x01', '0x02', ...
      let leaves = genIntSequence(10)
      .map(i => 0xfc + i)
      .map(toBuffer)
      .map(bufferToHex);


    console.log({leaves})
    const bufLeaves = leaves.map(toBuffer);
    const concatenatedBytes = bufferToHex(Buffer.concat(bufLeaves));
    const bytesLengths = bufLeaves.map(({ length }) => length);
    console.log({concatenatedBytes})
    console.log({bytesLengths})

    const { root, proofs } = MerkleTreeLibraryjs.buildMerkleTree(leaves);
    let rootJavaScript = root;
    console.log({proofs})

    console.log({rootJavaScript})
    //this.rootSolidity = await this.MerkleTrees.computeRoot(concatenatedBytes, bytesLengths);

    // const { root, proofs } = MerkleTreeLibraryjs.buildMerkleTree(leaves);
    // let rootJavaScript = root;
    // let proofs = proofs;


    // console.log(rootSolidity == rootJavaScript)
        

    //   await Promise.all(
    //     zip(this.leaves, this.proofs).map(async ([leaf, proof]) =>
    //       expect(await this.MerkleTrees.verifyProof(this.rootSolidity, leaf, proof)).to.equal(true)
    //     ))



   
    const privateKey = Buffer.from(
        'c5c70b480bcbecb6f43fba946fb7d989e280ca408ad3aa173c1512bcc2d08ebc', 'hex') // ganache
    const web3= new Web3("http://127.0.0.1:7545") //metamaks
    const MerkleTrees= new web3.eth.Contract ( config.MerkleABI,config.MerkleAddress)//necesito address

    web3.eth.getTransactionCount(account, (err, txCount) => {

        if (err){
            
            console.log(err)
        }
        else{
            console.log("txCount", txCount)
            const txObject = {
            nonce:    web3.utils.toHex(txCount),//0=>txCount
            gasLimit: web3.utils.toHex(800000), // Raise the gas limit to a much higher amount
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            to: config.MerkleAddress , //addrestest  config.TODO_LIST_ADDRESS
            data: MerkleTrees.methods.computeRoot(concatenatedBytes, bytesLengths).encodeABI()
            }

            const tx = new Tx(txObject)
            tx.sign(privateKey)
            
            const serializedTx = tx.serialize()
            const raw = '0x' + serializedTx.toString('hex')

            console.log("hi")
            web3.eth.sendSignedTransaction(raw)
.on('receipt', console.log);


//             web3.eth.sendSignedTransaction(raw, (err, txHash) => {
//             if (err)
//             {
//                 console.log(err)
//             }
//             else{
//                 console.log(txHash)
//                 var receipt = web3.eth.getTransactionReceipt(txHash)
// .then(console.log);
//                 //const { rootJavaScript, proofs } = MerkleTreeLibraryjs.buildMerkleTree(leaves);
//                 console.log({rootJavaScript})
            
//                 console.log(0 == rootJavaScript)
            
//             }
//             })
        }
      })




