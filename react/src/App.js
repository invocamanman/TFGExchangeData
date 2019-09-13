import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import{FACTORY_ADDRESS, FACTORY_ABI, EXCHANGEDATA_ABI} from './resources/config'
//var BigNumber = require('big-number');
import ExchangesC from './Exchanges'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = { 
      account: '',
      valuenewexchange:0,
      DataProviders: [],
      exchangedatas: [],
      exchangesCounter: 0,
      loading: true
       }
    this.newRegister= this.newRegister.bind(this)
    this.DataProviders = this.DataProviders.bind(this);
    this.CreateChildren = this.CreateChildren.bind(this);
    this.handleChangeexchange = this.handleChangeexchange.bind(this);
    this.SetMR = this.SetMR.bind(this);
    this.confirm = this.confirm.bind(this);
    this.seedReveal = this.seedReveal.bind(this);
  }
  async DataProviders2() {

    // let response = awa  //   this.state.todoList.methods.createTask(content).send({from: this.state.account}, (error, transactionHash) => {
  //     console.log("hashtransaction", transactionHash);
  //     // this.state.todoList.methods.tasks(this.state.taskCount).call((error, result) => {
  //     //   console.log("result", result)
  //     //   this.setState({
  //     //     tasks: [...this.state.tasks, result],
  //     //     loading:false,
  //     //     taskCount: this.state.taskCount+1
  //     //   })
  //     // });
  //     this.loadBlockchainData();  //muy guarro, debe haber otra manera fijo      

      
  // });e.accounts);
  }
  async DataProviders() {  //   this.state.todoList.methods.createTask(content).send({from: this.state.account}, (error, transactionHash) => {
  //     console.log("hashtransaction", transactionHash);
  //     // this.state.todoList.methods.tasks(this.state.taskCount).call((error, result) => {
  //     //   console.log("result", result)
  //     //   this.setState({
  //     //     tasks: [...this.state.tasks, result],
  //     //     loading:false,
  //     //     taskCount: this.state.taskCount+1
  //     //   })
  //     // });
  //     this.loadBlockchainData();  //muy guarro, debe haber otra manera fijo

      
  // });
    // let response = await fetch("http://localhost:9000/testAPI")
    // let registros = await response.json();
    // console.log("registros:",registros);
    // this.setState({registros: []})
    // registros.map((registro)=>{
    //   this.setState({
    //    registros: [...this.state.registros, registro["hash"]]
    //   })
    // });
  }
 
  async newRegister(content){//hacer post!!
    // let response = await fetch("http://localhost:9000/testAPI/newregister",{
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'TODO_LIST_ABI
    //   },
    //   body: JSON.stringify({hash: content})//, {a:1, b:2}... // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    // });
    // //let response2 = await response.json(); pendiente
    // console.log("correcto^^")
    // this.DataProviders();
  }
  componentWillMount(){
    this.loadBlockchainData()
  }

  async loadBlockchainData(){
    const web3= new Web3(Web3.givenProvider)//podria ser el de infura : "https://mainnet.infura.io/v3/7f5338a0ad3f4479927a4578bfaf0b35"
   // pero entonces no coge las accountsdel metamask
   this.setState({web3})
   if (window.ethereum) {
        window.ethereum.enable()
    }

    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})
    console.log(FACTORY_ABI, FACTORY_ADDRESS)
    const factory= new web3.eth.Contract ( FACTORY_ABI,FACTORY_ADDRESS)
    this.setState({factory})
    let EXCHANGEDATA= new web3.eth.Contract ( EXCHANGEDATA_ABI, '0xA6b9FA6336Bbe5280E9492aa1Da318a33ecB3Bd3')

    const exchangesCounter = await factory.methods.exchangesCounter().call()
    this.setState({exchangesCounter});

    console.log("factory p" , await factory.methods.provider().call())
    console.log("EXCHANGEDATA p", await EXCHANGEDATA.methods.p().call())
    console.log("EXCHANGEDATA n", await EXCHANGEDATA.methods.n().call())
    console.log("factory collateral" , await factory.methods.collateral().call())
    console.log("EXCHANGEDATA collateral", await EXCHANGEDATA.methods.collateral().call())
    console.log("factory provider" , await factory.methods.provider().call())
     console.log("EXCHANGEDATA provider", await EXCHANGEDATA.methods.provider().call())
    
    this.setState({exchangedatas: []});
    for (var i = 1; i <= exchangesCounter; i++) {
      const exchange = await factory.methods.exchangedatas(i).call()
      console.log("exchange: ",i, exchange)
      this.setState({
        exchangedatas: [...this.state.exchangedatas, exchange]
      })
    }


    console.log(this.state.account)


   await this.DataProviders() ;
   this.setState({loading: false})
 
  }


  
  showLoading(){
    return  <div id="loader" className="text-center">
    <p className="text-center">Loading...</p>
  </div>

  }


  handleChangeexchange(event) {
    this.setState({valuenewexchange: event.target.value});
  }

  loadExchanges(){
     
    return  <ExchangesC exchangedatas={this.state.exchangedatas} newRegister= {this.newRegister}
     SetMR= {this.SetMR} confirm= {this.confirm} seedReveal= {this.seedReveal}/>
  }

  
  async CreateChildren(){
    // console.log("before call", this.state.ExchangesCount)
    // let response = await fetch("http://localhost:9000/testAPI/count")
    // let count = await response.json();
    // this.setState({ ExchangesCount: count });
    // console.log("after call",this.state.ExchangesCount)
    console.log(this.state.account)
    console.log(await this.state.factory.methods.p().call())
    this.state.factory.methods.createChildContract(this.state.valuenewexchange).send({from: this.state.account}, (error, transactionHash) => {
      if (error)
        console.log(error)
      else{
        console.log("hashtransaction", transactionHash);    
      }

      });
      console.log(this.state.account)
  }

  async SetMR(address){

    let EXCHANGEDATA= new this.state.web3.eth.Contract ( EXCHANGEDATA_ABI, address)
    EXCHANGEDATA.methods.SetMR(100,1000).send({from: this.state.account}, (error, transactionHash) => {
      if (error)
        console.log(error)
      else{
        console.log("hashtransaction", transactionHash);    
      }

      });
  }
  async confirm(address){

    let EXCHANGEDATA= new this.state.web3.eth.Contract ( EXCHANGEDATA_ABI, address)
    EXCHANGEDATA.methods.confirm().send({from: this.state.account}, (error, transactionHash) => {
      if (error)
        console.log(error)
      else{
        console.log("hashtransaction", transactionHash);    
      }

      });
  }
  async seedReveal(address){

    console.log("address seedreveal", address)
    let EXCHANGEDATA= new this.state.web3.eth.Contract ( EXCHANGEDATA_ABI, address)
    EXCHANGEDATA.methods.releaseSeed(10000).send({from: this.state.account}, (error, transactionHash) => {
      if (error)
        console.log(error)
      else{
        console.log("hashtransaction", transactionHash);    
      }

      });
  }

  render() {
    return (
        <div>
          <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            <ul className="navbar-nav px-3">
              <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
               
              </li>
            </ul>
          </nav>
          <div className="container-fluid">
            <div className="row">
              <main role="main" className="col-lg-12 d-flex justify-content-center">

                {this.state.loading? this.showLoading() : this.loadExchanges()}

              </main>
            </div>
          </div> 
          <form >
                    <input id="mewexchange"  type="number" step="1" className="form-control" 
                    value={this.state.valuenewexchange} onChange={this.handleChangeexchange}/>
                    <button type="button" onClick={this.CreateChildren}>
                     CreateChildren
                    </button>
          </form>
        </div>
      );
  }
}

export default App;
