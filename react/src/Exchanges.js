import React, { Component } from 'react';
import { Form,Button } from 'react-bootstrap';
var FileSaver = require('file-saver');

class Exchanges extends Component {


 constructor(props) {
       super(props)
       this.state = {
        //tasks: [] onmount creo
         textboxvalue: '',
         unselected: true,
         address:'',
         indexposted: false
          }
         this.indexFile = React.createRef();
         this.FileCryptos = React.createRef();
         this.FilePIK = React.createRef();

         this.Decrypt = this.Decrypt.bind(this);
         this.Comprobe = this.Comprobe.bind(this);
         this.Postindex = this.Postindex.bind(this);
  }


  Postindex(event) {
    event.preventDefault();
    if (this.state.indexposted===false){
      if (this.indexFile.current.files[0] == null){
        window.alert("Debes itroducir los ficheros de indices primero")
        return
      }
      else{

      
    
        event.preventDefault();
        console.log(this.indexFile.current.files[0])
        var reader = new FileReader();
        reader.onload = function(event) {
          // console.log(JSON.parse(event.target.result))
          // console.log(JSON.stringify(JSON.parse(event.target.result)))
          fetch("http://localhost:9000/testAPI/index",{
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(JSON.parse(event.target.result))//, {a:1, b:2}... // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
          }).then(function(response) {
        
            return response.json();//.json()
          }).then(function(data) {
            console.log(data)
            var blob = new Blob([JSON.stringify(data)], {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(blob, "keysYproofs.txt"); 
          });
        
          
        };
      
        reader.readAsText(this.indexFile.current.files[0]);
        this.setState({indexposted: true})
      }
    }
    else{
      window.alert("Ya has pedido la muestra gratuita al proveedor")
    }
  }
  readFile(file){
      return new Promise((resolve,reject) => {
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function(event) {
        resolve(JSON.parse(event.target.result))   
      };
    });

  

  }
  Comprobe(event) {
    event.preventDefault();

    if ((this.FileCryptos.current.files[0]==null)||(this.FilePIK.current.files[0]==null)||(this.indexFile.current.files[0]== null)){
      window.alert("Debes itroducir los ficheros de cryptobloques, (claves y proofs) y índices para poder activar esta función")
    }
    else{

      
      console.log(this.FileCryptos.current.files[0])
      console.log(this.FilePIK.current.files[0])
      
      let promisesread = [this.readFile(this.FileCryptos.current.files[0]), this.readFile(this.FilePIK.current.files[0]), this.readFile(this.indexFile.current.files[0])]

  
      Promise.all(promisesread).then((results) => {
          console.log(results)
          this.props.comprobe(results[0].cryptoleafs, results[1].keys, results[1].proofs, results[2].index)
      });
    }
  }

  Decrypt(event) {
    event.preventDefault();

    this.readFile(this.FileCryptos.current.files[0]).then(result => {
      this.props.decrypt(result.cryptoleafs)
    })
    
  }

  loadExchanges(){
    //provider or consumercheck, display buttons en funcion de la estage con u switch
    console.log("stage exchange", this.props.stage)
    switch (this.props.stage)
    {

      //juntar case 0 i 1, caso 0 ( wait for MR des del server), case 1 (juntar case 0 i 1), case 2: wait for seed, case 3 : finish or trubleshooting
      case 0:
      return  <div>
      <p>current address selected: {this.props.addrescontract}</p>
      <p>current stage selected: {this.props.stage}</p>
      <form>
            <Button type="button" onClick={() => this.props.Startcomunication()}>
              Startcomunication
              </Button>
              <br />
            Or you can cancel the deal
            <br />
            <Button type="button" variant="danger" onClick={() => this.props.Cancel()}>
              Cancel
              </Button>
              <br />
              <br />
              For Demo purposes
              <br />
              <Button type="button" variant="warning" onClick={() => this.props.Startcomunicationfake()}>
              StartBadComunnication
              </Button>
      </form> 
      </div>
      case 1:
            return  <div>
              <p>current address selected: {this.props.addrescontract}</p>
              <p>current stage selected: {this.props.stage}</p>
             
              <Form onSubmit={this.Postindex}>
              <Form.Group controlId="createnewcontract" >
                  <label>
                    Upload Index in order to get the data samples 
                    <br />
                    File of index format: ej: 1,2,3,1,2,3 
                    <br />
                    if you want we create a random indexes for you ^^
                    <Button type="button" onClick={this.props.CreateRandomIndex}>
                     CreateRandomIndex
                    </Button>
                    <input type="file" ref={this.indexFile} />
                  </label>
                  <br />
                  <Button type="submit">Submit</Button>
                  </Form.Group>
              </Form>

              <br />
              <p>Comprobe Merkle Proofs of keys and cryptos</p>
              <form onSubmit={this.Comprobe}>
                  <label>
                    Upload file of cryptos
                    <input type="file" ref={this.FileCryptos} />
                  </label>
                  <label>
                    Upload file of proofs and keys
                    <input type="file" ref={this.FilePIK} />
                  </label>
                  <br />
                  <Button type="submit">Submit</Button>
              </form>


              If you agree with the data you cna confirm the payment
              <br />
                <Button type="button" variant="success" onClick={() => this.props.confirm()}>
              confirm
              </Button>
              <br />
            Or you can cancel it
            <br />
            <Button type="button" variant="danger" onClick={() => this.props.Cancel()}>
              Cancel
              </Button>
            </div>
           
      case 2:
          return <div>
              <p>current address selected: {this.props.addrescontract}</p>
              <p>current stage selected: {this.props.stage}</p>
              <p>Waiting for seed {this.props.stage}</p>
              <Button type="button" onClick={() => this.props.seedReveal()}>
              reveal me the seed!
              </Button>
              <br />
              <br />
              For Demo purposes
              <br />
              <Button type="button" variant="warning" onClick={() => this.props.seedRevealFake()}>
              RevealFakeSeed
              </Button>
          </div>
         
    case 3:
    return <div>
        <p>current address selected: {this.props.addrescontract}</p>
        <p>current stage selected: {this.props.stage}</p>

        <br />
              <p>Decrypt all data</p>
              <form onSubmit={this.Decrypt}>
                  <label>
                    Upload file of cryptos
                    <input type="file" ref={this.FileCryptos} />
                  </label>
                  <br />
                  <button type="submit">Submit</button>
              </form>

          <br />  
      <button type="button" onClick={() => this.props.conflict()}>
      resolution/troubleshooting
      </button>

    </div>
      
    default:
      return  <p>Intercambio de datos finalizado, contrato inservible </p>
    }
  }textboxvalue
  render() {
    return (
         <div id="content">
   

              {(this.props.addrescontract!=='')?this.loadExchanges():this.props.addrescontract}


                </div>
    
      );
  }
}

export default Exchanges;
