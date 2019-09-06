var express = require('express');
var router = express.Router();
var config = require ('../resources/config');
var Web3 = require('web3');
var sigUtil = require('eth-sig-util')//para firmar textos, web3 no soporta recuperar de firmas
var fs = require('fs');
var path = require('path');
var csv = require('csv-parser')
var MerkleTools = require('merkle-tools')
//futurabase de datos
const { toBuffer, keccak256, bufferToHex} = require('ethereumjs-util');
const {
    arrayUtils: { zip, genIntSequence },
  } = require('../resources/merkletreelib');
const { MerkleTreeLibrary } = require('../resources/merkletreelib');

let contracts=  []; // clase en BBDD?

var Tx = require('ethereumjs-tx')

var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var CryptoJS = require("crypto-js");


const account = '0x53878D5E54C6A8d115853cBD663bEfD07b5b118D' //ganache default account

const url=  "http://localhost:7545" //"http://10.96.100.10:8545" "http://localhost:7545"


router.get('/accounts', function(req, res, next) {
    
});

router.get('/MRK', function(req, res, next) {
    const web3= new Web3("https://mainnet.infura.io/v3/7f5338a0ad3f4479927a4578bfaf0b35")

    //const Registre= new web3.eth.Contract ( config.TODO_LIST_ABI,config.TODO_LIST_ADDRESS)
    
    //const Registre= new web3.eth.Contract ( config.FACTORY_ABI , config.TODO_LIST_ADDRESS)

    
});


router.post('/test', function(req, res, next) {

    let file= path.join(__dirname, '/../resources/fakedata.csv');


    let leaf;
    let count = 0;
    let leafarray = [];
    fs.createReadStream(file)
        .pipe(csv())
        .on('data', (data) => {
            if(count==0)//agrupar los datos de dos en dos, test
            {
                count++;
                leaf= data.Email;
            }
            else {
                leaf =leaf+ ', ' + data.Email
                leafarray.push(leaf)
                count = 0;
            }
            //console.log("row", data.Email)
        })
        .on('end', () => {
        console.log(leafarray)

        let file2= path.join(__dirname, '/../resources/fakedata.csv');

        var merkleTools = new MerkleTools()
        merkleTools.addLeaves(leafarray,true)
        merkleTools.makeTree(false);

        console.log(merkleTools.getLeafCount());
        console.log(merkleTools.getLeaf(0).toString('hex'));
        console.log(merkleTools.getTreeReadyState());

        var merkleRoot = merkleTools.getMerkleRoot()

        var proof1 = merkleTools.getProof(2)

        var targetHash1= merkleTools.getLeaf(2).toString('hex')
        
        var isValid = merkleTools.validateProof(proof1, targetHash1, merkleRoot)
        
        console.log(merkleRoot,proof1,targetHash1)
        console.log(isValid)


  });


});


router.post('/release', function(req, res, next) {

    const privateKey = Buffer.from(
        'c5c70b480bcbecb6f43fba946fb7d989e280ca408ad3aa173c1512bcc2d08ebc', 'hex') // ganache
    console.log(req.body.index)
    const web3= new Web3("http://127.0.0.1:7545") //metamaks
    const Exchangedata= new web3.eth.Contract ( config.Exchangedata_ABI,req.body.address)//necesito address
    let seed = Web3.utils.fromAscii("123456789");

    
    web3.eth.getTransactionCount(account, (err, txCount) => {
        if (err){
            res.send(err)
            console.log(err)
        }
        else{
            console.log("txCount", txCount)
            const txObject = {
            nonce:    web3.utils.toHex(txCount),//0=>txCount
            gasLimit: web3.utils.toHex(800000), // Raise the gas limit to a much higher amount
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            to: req.body.address , //addrestest  config.TODO_LIST_ADDRESS
            data: Exchangedata.methods.releaseSeed(seed,50).encodeABI()//hardcoded
            //chainId:  web3.utils.toHex(29754)
            }

            const tx = new Tx(txObject)
            tx.sign(privateKey)
            
            const serializedTx = tx.serialize()
            const raw = '0x' + serializedTx.toString('hex')
            web3.eth.sendSignedTransaction(raw, (err, txHash) => {
            if (err)
            {
                console.log(err)
                res.send(err)
            }
            else{
                console.log(txHash)
                res.send(txHash)
                
            }
            // Use this txHash to find the contract on Etherscan!
            })
        }
      })
});


async function setMr(address, res){

    const web3= new Web3("http://127.0.0.1:7545") //metamaks
    const Exchangedata= new web3.eth.Contract ( config.Exchangedata_ABI,address)
    
    let file= path.join(__dirname, '/../resources/fakedata.csv');

    let leaf;
    let count = 0;
    let index= 0;
    let cryptoleafs = [];
    let keysarray=[];
    let seed=Web3.utils.fromAscii("123456789");


    fs.createReadStream(file)
        .pipe(csv())
        .on('data', (data) => {
            if(count==0)//agrupar los datos de dos en dos, test
            {
                count++;
                leaf= data.Email;
            }
            else {
                leaf =leaf+ ', ' + data.Email
                let currentkey= keccak256(Buffer.concat([toBuffer(index),toBuffer(seed)]))
                let cryptoleaf= CryptoJS.AES.encrypt(leaf.toString(),bufferToHex(currentkey).toString()).toString()//tostring importante
                cryptoleafs.push(cryptoleaf)
                keysarray.push(currentkey)
                count = 0;
                index++;
            }
            //console.log("row", data.Email)
        })
        .on('end', () => {
        //console.log({cryptoleafs})

        //let file2= path.join(__dirname, '/../resources/fakedata.csv');

        // var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123');
 
        // // Decrypt
        // console.log(ciphertext.toString())
        // var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
        // console.log(bytes.toString(CryptoJS.enc.Utf8));
            
        console.log(index)

        let MerkleTreeCrypto = MerkleTreeLibrary
        

        cryptoleafs.map(toBuffer).map(bufferToHex);
    
        let tree = MerkleTreeCrypto.buildMerkleTree(cryptoleafs);
        let merkleRootCrypto = tree.root;

        let MerkleTreeKey = MerkleTreeLibrary

        keysarray.map(toBuffer).map(bufferToHex);
    
        let treek = MerkleTreeKey.buildMerkleTree(keysarray);
        let merkleRootkey = treek.root;

        console.log(merkleRootCrypto, merkleRootkey)
        //deprecated
        // var merkleCrypto = new MerkleTools()
        // merkleCrypto.addLeaves(cryptoleafs,true)
        // merkleCrypto.makeTree(false);

        // var merkleRootCrypto = merkleCrypto.getMerkleRoot()

        // var merkleToolskey = new MerkleTools()
        // merkleToolskey.addLeaves(keysarray,true)
        // merkleToolskey.makeTree(false);

        // var merkleRootkey = merkleToolskey.getMerkleRoot()


        //const account = '0x53878D5E54C6A8d115853cBD663bEfD07b5b118D' //ganache default account
        const privateKey = Buffer.from(
        'c5c70b480bcbecb6f43fba946fb7d989e280ca408ad3aa173c1512bcc2d08ebc', 'hex') // ganache

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
                to: address , //addrestest  config.TODO_LIST_ADDRESS
                data: Exchangedata.methods.SetMR(merkleRootkey,merkleRootCrypto).encodeABI()
                //chainId:  web3.utils.toHex(29754)
                }
    
                const tx = new Tx(txObject)
                tx.sign(privateKey)
                
                const serializedTx = tx.serialize()
                const raw = '0x' + serializedTx.toString('hex')
                web3.eth.sendSignedTransaction(raw, (err, txHash) => {
                if (err)
                {
                    console.log(err)
                    
                }
                else{
                    console.log({txHash})
                    console.log({cryptoleafs})
                    res.send({cryptoleafs})
                    
                }
                // Use this txHash to find the contract on Etherscan!
                })
            }
          })
        });


}
router.post('/id', async function(req, res, next) {

    //const web3= new Web3("https://mainnet.infura.io/v3/7f5338a0ad3f4479927a4578bfaf0b35")
    const web3= new Web3("http://127.0.0.1:7545") //metamaks
    const factory= new web3.eth.Contract ( config.FACTORY_ABI,config.FACTORY_ADDRESS)
   


    let exchangesCounter = await factory.methods.exchangesCounter().call()
    let found = false;
    for (var i = 1; i <= exchangesCounter; i++) {
      let exchange = await factory.methods.exchangedatas(i).call()
      if (exchange == req.body.addrescontract)
      {
        found = true
        //let Exchangedata= new web3.eth.Contract ( Exchangedata_ABI, _address)

        //let stage =  await Exchangedata.methods.stage.call()
        //let consumer =  await Exchangedata.methods.consumer.call()
        break;
      }
    }
    if (!found)
        res.sendStatus(404)  
    else{

        //hacer hash primero i enviar firma del hash?
        const msgParams = { data:  req.body.addrescontract } //message
        msgParams.sig = req.body.sign
        console.dir({ msgParams })
        const signaccount = sigUtil.recoverPersonalSignature(msgParams)//web3.eth.personal no soporta ahora mismo el recover signature. doc oficial con esto :D https://metamask.github.io/metamask-docs/API_Reference/Signing_Data/Personal_Sign  also : https://medium.com/metamask/the-new-secure-way-to-sign-data-in-your-browser-6af9dd2a1527 
        console.dir({ signaccount })

        //para login, tener un nonce (random o counter) y que la otra parte firme, para el backend del marketplace
        contracts.push(req.body.addrescontract)
        let Exchangedata= new web3.eth.Contract ( config.Exchangedata_ABI, req.body.addrescontract)
        let consumer =  await Exchangedata.methods.consumer().call()
        console.log({consumer})
        if (consumer.toLowerCase() == signaccount.toLowerCase() ) // ????
        {
            setMr(req.body.addrescontract, res)

            //let file= path.join(__dirname, '/../resources/helloworld.json');
            
            // res.writeHead(200, {
            //     "Content-Type": "application/octet-stream",
            //     "Content-Disposition": "attachment; filename=" + '/../resources/helloworld.json'
            //   });
            //   fs.createReadStream(file).pipe(res); //return cryptos
        }
        else{
            res.sendStatus(500)
        }
    }


    
});


router.post('/index', async function(req, res, next) {

    
    console.log(req.body)
    
    let file= path.join(__dirname, '/../resources/fakedata.csv');

    let leaf;
    let count = 0;
    let index= 0;
    let cryptoleafs = [];
    let keysarray=[];
    let seed= Web3.utils.fromAscii("123456789");


    fs.createReadStream(file)
        .pipe(csv())
        .on('data', (data) => {
            if(count==0)//agrupar los datos de dos en dos, test
            {
                count++;
                leaf= data.Email;
            }
            else {
                leaf =leaf+ ', ' + data.Email
                let currentkey= keccak256(Buffer.concat([toBuffer(index),toBuffer(seed)]))
                let cryptoleaf= CryptoJS.AES.encrypt(leaf.toString(),bufferToHex(currentkey).toString()).toString()//tostring importante
                cryptoleafs.push(cryptoleaf)
                keysarray.push(currentkey)
                count = 0;
                index++;
            }
            //console.log("row", data.Email)
        })
        .on('end', () => {

        // var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123');
 
        // // Decrypt
        // console.log(ciphertext.toString())
        // var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
        // console.log(bytes.toString(CryptoJS.enc.Utf8));
            
        console.log(index)


        let MerkleTreeKey = MerkleTreeLibrary

        keysarray.map(toBuffer).map(bufferToHex);
    

        let treek = MerkleTreeKey.buildMerkleTree(keysarray);
        let merkleRootkey = treek.root;


        let responsekeys = []
        let responseproofs= []
        
        
        req.body.index.forEach(element => {
            responsekeys.push(bufferToHex(keysarray[element]))
            responseproofs.push(treek.proofs[element])
        });


        console.log(responsekeys)
        res.send({keys:responsekeys,proofs:responseproofs})
        
        });
    
});
module.exports = router;