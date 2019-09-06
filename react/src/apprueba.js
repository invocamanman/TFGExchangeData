import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import{FACTORY_ADDRESS, FACTORY_ABI, EXCHANGEDATA_ABI} from './resources/config'
//var BigNumber = require('big-number');
import ExchangesC from './Exchanges'
import { Form,Button } from 'react-bootstrap';
import {MerkleTreeLibrary, zip, genIntSequence} from './resources/merkletreelib'
//import { Buffer } from 'buffer';
var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var CryptoJS = require("crypto-js");

var FileSaver = require('file-saver');
const { toBuffer, keccak256, bufferToHex } = require('ethereumjs-util');

//global.Buffer = Buffer; 



class Apprueba extends Component {

  constructor(props) {
    super(props)
    this.state = { 
      account: '',
      DataProviders: [],
      exchangedata: '',
      textboxaddress:'',
      addrescontract: '',
      exchangesCounter: 0,
      loading: true
       }
    this.Createnewexchange = this.Createnewexchange.bind(this);
    this.Startcomunication = this.Startcomunication.bind(this);
    this.confirm = this.confirm.bind(this);
    this.seedReveal = this.seedReveal.bind(this);
    this.conflict = this.conflict.bind(this);
    this.handleChangeaddress = this.handleChangeaddress.bind(this);
    this.Submitaddress = this.Submitaddress.bind(this);
    this.refresh = this.refresh.bind(this);
    this.CreateRandomIndex = this.CreateRandomIndex.bind(this);
    this.comprobe = this.comprobe.bind(this);
    this.decrypt = this.decrypt.bind(this);
  }
  
  componentWillMount(){
    this.loadBlockchainData()
  }

  async loadBlockchainData(){
    const OPTIONS = {//web3 + metamask
      defaultBlock: "latest",
      transactionConfirmationBlocks: 1,
      transactionBlockTimeout: 5
    };
    const web3= new Web3(Web3.givenProvider,null,OPTIONS)//podria ser el de infura : "https://mainnet.infura.io/v3/7f5338a0ad3f4479927a4578bfaf0b35"
   // pero entonces no coge las accountsdel metamask
   this.setState({web3})
   if (window.ethereum) {
        window.ethereum.enable()
    }

    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})


    const factory= new web3.eth.Contract ( FACTORY_ABI,FACTORY_ADDRESS)
    this.setState({factory})

    

    //let Exchangedata= new web3.eth.Contract ( EXCHANGEDATA_ABI, '0xA6b9FA6336Bbe5280E9492aa1Da318a33ecB3Bd3')


    const exchangesCounter = await factory.methods.exchangesCounter().call()

    this.setState({exchangesCounter});


    // this.setState({exchangedatas: []});
    // for (var i = 1; i <= exchangesCounter; i++) {
    //   const exchange = await factory.methods.exchangedatas(i).call()
    //   console.log("exchange: ",i, exchange)
    //   this.setState({
    //     exchangedatas: [...this.state.exchangedatas, exchange]
    //   })
    // }


    console.log(this.state.account)


   this.setState({loading: false})
 
  }


  
  showLoading(){
    return  <div id="loader" className="text-center">
    <p className="text-center">Loading...</p>
  </div>

  }



  loadExchanges(){
    console.log(this.state.stage,this.state.consumer,this.state.provider)
    if(this.state.consumer)
    return  <ExchangesC addrescontract={this.state.addrescontract} 
     Startcomunication= {this.Startcomunication} confirm= {this.confirm} seedReveal= {this.seedReveal} conflict= {this.conflict} stage={this.state.stage} 
     consumer={this.state.consumer} provider={this.state.provider} comprobe={this.comprobe} decrypt= {this.decrypt} CreateRandomIndex={this.CreateRandomIndex}/>
  }
  async Createnewexchange(){

    // let result =await  this.state.factory.methods.createChildContract(this.state.valuenewexchange).send({from: this.state.account});
    //   console.log("result", result)
    this.state.factory.methods.createChildContract().send({from: this.state.account, value: this.state.web3.utils.toWei("5", "ether")})//asi continua el codigo en caso de BC real ^^
    .on('transactionHash', txHash => {
      console.log('on transactionHash', txHash);
  })
  .on('receipt', receipt=> {
    
    console.log('on receipt', receipt);
    console.log(receipt.events)
    console.log(receipt.events.SCcreated.returnValues.exchangedata)//??????
   // this.setState({addrescontract:receipt.events.SCcreated.returnValues.exchangedata})
    this.addresscheck(receipt.events.SCcreated.returnValues.exchangedata)
})
  .on('confirmation', (confirmationNumber, receipt) => {
      console.log('on confirmation', confirmationNumber);
  })
  .on('error', error=> {
    console.log('on error', error);
})

this.state.factory.once('allEvents', {
  
}, function(error, event){ console.log("event", event); });


     // this.state.factory.methods.createChildContract(this.state.valuenewexchange).send({from: this.state.account}, (error, transactionHash) => {
    //   if (error)
    //     console.log(error)
    //   else{
    //     console.log("hashtransaction", transactionHash);    
        
    //   }
    //   });
  }


  // async Startcomunication(message){
    
  //     let sign = await this.state.web3.eth.personal.sign(message, this.state.account,'')//password nose necesita, aún así se debe complementar
  //     fetch("http://localhost:9000/testAPI/id",{
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({addrescontract: this.state.addrescontract, sign:sign,message:message})//, {a:1, b:2}... // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  //   }).then(function(response) {
      
  //     return response.text();//.json()
  //   }).then(function(data) {
  //     console.log(data)
  //      var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
  //      FileSaver.saveAs(blob, "cryptos.txt");
  //   });
   
  // }
    
  async Startcomunication(message){
    
    console.log(this.state.addrescontract)
    let sign = await this.state.web3.eth.personal.sign(this.state.addrescontract, this.state.account,'')//password nose necesita, aún así se debe complementar
    fetch("http://localhost:9000/testAPI/id",{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({addrescontract: this.state.addrescontract, sign:sign})//, {a:1, b:2}... // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  }).then(function(response) {//comprobar que sea un 200 OK
    
    return response.json();//.json() .text()
  }).then(function(data) {
    console.log(data)
     var blob = new Blob([JSON.stringify(data)], {type: "text/plain;charset=utf-8"});
     FileSaver.saveAs(blob, "cryptos.txt");
  });
 
}

shuffle(array) {

  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]];
  }
}

  CreateRandomIndex(){

  let sequence = genIntSequence(50);//array 0-49
  this.shuffle(sequence)

  let indexarray = sequence.slice(0,10);
  indexarray.sort( (a, b) => a - b );

  var blob = new Blob([JSON.stringify({index: indexarray})], {type: "text/plain;charset=utf-8"});
  FileSaver.saveAs(blob, "index.txt");

}

  async Testdownload(){
    
    let response = await fetch("http://localhost:9000/testAPI/test",{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({a:1})//, {a:1, b:2}... // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  });
 


}
//   async SetMR(){

//       this.state.Exchangedata.methods.SetMR(100,1000).send({from: this.state.account}).on('transactionHash', txHash => {
//       console.log('on transactionHash', txHash);
//   })
//   .on('receipt', receipt=> {
    
//     console.log('on receipt', receipt);

//     this.state.Exchangedata.methods.stage.call().then(function(stage){
//       console.log(stage)
//       this.setState({stage})

//     }.bind(this));

// })
//   .on('confirmation', (confirmationNumber, receipt) => {
//       console.log('on confirmation', confirmationNumber);
//   })
//   .on('error', error=> {
//     console.log('on error', error);
// })

//   }

// const toBuffer = (hex) => {
//   const buffer = new Buffer(string)

//   return buffer
// }

async comprobe(cryptos, keys, proofs, index){


  console.log({cryptos, keys, proofs, index})
  let MRC = await this.state.Exchangedata.methods.MRC.call()
  let MRK = await this.state.Exchangedata.methods.MRK.call()
  console.log({MRC, MRK})
  
  let MerkleTreeCrypto = MerkleTreeLibrary
        
  //cryptos.map(element => Buffer.from(element)).map(element => element.toString("hex"));

  cryptos.map(toBuffer).map(bufferToHex);

  console.log(cryptos)
  let tree = MerkleTreeCrypto.buildMerkleTree(cryptos);
  let merkleRootCrypto = tree.root;
  console.log({merkleRootCrypto})

  console.log(merkleRootCrypto==MRC)

  let verifyproofs = []
  zip(keys, proofs).map(async ([key, proof]) => {
    verifyproofs.push(MerkleTreeCrypto.verifyProof(proof,MRK, key));
   })
   console.log(verifyproofs)



    // var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123');
 
        // // Decrypt
        // console.log(ciphertext.toString())
        // var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
        // console.log(bytes.toString(CryptoJS.enc.Utf8));

   if( verifyproofs.some(element => element==false))
   {
    window.alert("todo mal")
   }
   else {
    window.alert("todo guay")
    let cryptostodesencrypt= []
    index.forEach(element => {
      cryptostodesencrypt.push(cryptos[element])
    });
    let desencrypteddata= []
    zip(cryptostodesencrypt, keys).map(([crypto, key]) => {
        var bytes  = CryptoJS.AES.decrypt(crypto, bufferToHex(key).toString());
        desencrypteddata.push(bytes.toString(CryptoJS.enc.Utf8));
     })
     console.log(desencrypteddata)
     var blob = new Blob([JSON.stringify(desencrypteddata)], {type: "text/plain;charset=utf-8"});
     FileSaver.saveAs(blob, "result.txt");
   }
      
}

async decrypt(cryptos){

  let seed = await this.state.Exchangedata.methods.seed.call()
  let nleaves = await this.state.Exchangedata.methods.nleaves.call()
  let keys=[]
  for (let i = 0; i < nleaves; i++){
    keys.push(keccak256(Buffer.concat([toBuffer(i),toBuffer(seed)])))
    }

    let desencrypteddata= []
    zip(cryptos, keys).map(([crypto, key]) => {
      var bytes  = CryptoJS.AES.decrypt(crypto, bufferToHex(key).toString());
      desencrypteddata.push(bytes.toString(CryptoJS.enc.Utf8));
   })
   var blob = new Blob([JSON.stringify(desencrypteddata)], {type: "text/plain;charset=utf-8"});
     FileSaver.saveAs(blob, "alldata.txt");
}

  async confirm(){

      this.state.Exchangedata.methods.confirm().send({from: this.state.account}).on('transactionHash', txHash => {
        console.log('on transactionHash', txHash);
    })
    .on('receipt', receipt=> {
    
      console.log('on receipt', receipt);
  
      this.state.Exchangedata.methods.stage.call().then(function(stage){
        console.log(stage)
        this.setState({stage})
  
      }.bind(this));
  
  })
    .on('confirmation', (confirmationNumber, receipt) => {
        console.log('on confirmation', confirmationNumber);
    })
    .on('error', error=> {
      console.log('on error', error);
  })
  }

  async seedReveal()  {

      fetch("http://localhost:9000/testAPI/release",{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({address: this.state.addrescontract})//, {a:1, b:2}... // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    }).then(function(response) {
      
      return response.text();//.json()
    }).then(function(data) {
      console.log(data)

      this.state.Exchangedata.methods.stage.call().then(function(stage){
       console.log(stage)
       this.setState({stage})

       }.bind(this));
  }.bind(this))
  }
  
  async conflict(){

    this.state.Exchangedata.methods.conflict().send({from: this.state.account}).on('transactionHash', txHash => {
      console.log('on transactionHash', txHash);
  })
  .on('receipt', receipt=> {
  
    console.log('on receipt', receipt);
    console.log(receipt.events.refund.returnValues.correct)
    this.state.Exchangedata.methods.stage.call().then(function(stage){
      console.log(stage)
      this.setState({stage})

    }.bind(this));

})
  .on('confirmation', (confirmationNumber, receipt) => {
      console.log('on confirmation', confirmationNumber);
  })
  .on('error', error=> {
    console.log('on error', error);
})
}

//     this.state.Exchangedata.methods.releaseSeed(10000).send({from: this.state.account}).on('transactionHash', txHash => {
//       console.log('on transactionHash', txHash);
//   })
//   .on('receipt', receipt=> {
    
//     console.log('on receipt', receipt);

//     this.state.Exchangedata.methods.stage.call().then(function(stage){
//       console.log(stage)
//       this.setState({stage})

//     }.bind(this));

// })
//   .on('confirmation', (confirmationNumber, receipt) => {
//       console.log('on confirmation', confirmationNumber);
//   })
//   .on('error', error=> {
//     console.log('on error', error);
// })
  handleChangeaddress(event) {
    this.setState({textboxaddress: event.target.value});
  }


  async Submitaddress(event) {
    event.preventDefault();
    this.addresscheck(this.state.textboxaddress)

  }

   refresh(event) {
    event.preventDefault();
    this.addresscheck(this.state.addrescontract)

  }
  async addresscheck(_address){

    let exchangesCounter = await this.state.factory.methods.exchangesCounter().call()
    this.setState({exchangesCounter});
    let found = false;
    for (var i = 1; i <= this.state.exchangesCounter; i++) {
      let exchange = await this.state.factory.methods.exchangedatas(i).call()
      if (exchange == _address)
      {
        found = true
        this.setState({addrescontract: _address});
        let Exchangedata= new this.state.web3.eth.Contract ( EXCHANGEDATA_ABI, _address)
        this.setState({Exchangedata:Exchangedata})

        let stage =  await this.state.Exchangedata.methods.stage.call()
        let provider =  await this.state.Exchangedata.methods.provider.call()
        let consumer =  await this.state.Exchangedata.methods.consumer.call()
        console.log("provider", provider)
        this.setState({stage,provider,consumer})
        console.log("address correct, may be better a pop up")
        break;
      }
    }
    if (!found)
      console.log("address is not a SC D:")
    
      console.log("currentaddresscontract", this.state.addrescontract)
  }

    
  shownewexchange(){
    return    <Form>
    <Form.Group controlId="createnewcontract">
      <Form.Label>Create new SC for exchange data</Form.Label>
    </Form.Group>
    <Button variant="primary" type="button" onClick={this.Createnewexchange}>
      Create SC
    </Button>
  </Form>

  }
//<button type="button" onClick={this.Testdownload}>
//Pruebas
//</button>
  render() {
    return (
        <div>
          

          {this.state.addrescontract==''? this.shownewexchange(): <p>already have a SC address</p>}

          <Form >
          <Form.Group controlId="createnewcontract" >
              <Form.Label>Enter your address of your SC to continue the process</Form.Label>
              <Form.Control type="Address" placeholder="Address" value={this.state.textboxvalue} onChange={this.handleChangeaddress} />

              <Button variant="primary" type="button" onClick={this.Submitaddress}>
                  Submit
                </Button>

            </Form.Group>
                  
          </Form>

           <Button variant="primary" type="button" onClick={this.refresh}>
                  Refresh
            </Button>
                  <div className="container-fluid">
            <div className="row">
              <main role="main" className="col-lg-12 d-flex justify-content-center">

                {this.state.loading? this.showLoading() : this.loadExchanges()}

              </main>
            </div>
          </div> 


        </div>
      );
  }
}

export default Apprueba;
