import React, { Component } from 'react';


class Exchanges extends Component {


 constructor(props) {
       super(props)
       this.state = {
        //tasks: [] onmount creo
         textboxvalue: '',
         unselected: true,
         address:''
          }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleclick = this.handleclick.bind(this);
        this.shownounSelected = this.shownounSelected.bind(this);
  }
  handleChange(event) {
    this.setState({textboxvalue: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.newRegister(this.state.textboxvalue)
   
  }
  handleclick(event) {
    console.log("outputlist", event.target.getAttribute('address')  )
    this.setState({address: event.target.getAttribute('address'), unselected: false});
  }

  shownounSelected(){
    return  <div id="unselected" className="text-center">
    <p className="text-center">select one address to proceed</p>
  </div>
  }
  
  loadExchanges(){
    return  <div>
      <p>current address selected: {this.state.address}</p>
    <form>
    <button type="button" onClick={() => this.props.SetMR(this.state.address)}>
    SetMR
    </button>
    <button type="button" onClick={() => this.props.confirm(this.state.address)}>
    confirm
    </button>
    <button type="button" onClick={() => this.props.seedReveal(this.state.address)}>
    seedReveal()
    </button>
    </form>
</div>
  }
  render() {
    return (
         <div id="content">
                  <form onSubmit={this.handleSubmit}>
                    <input id="newTask"  type="text" className="form-control" 
                    value={this.state.textboxvalue} onChange={this.handleChange}/>
                    <input type="submit" hidden={true} />
                  </form>
                  <li id="exchangelist" onClick={this.handleclick} className="list-unstyled">
                    {this.props.exchangedatas.map((exchange, key) => {
                      return(
                        <div key={key}>
                          <label >
                            <span className="content" address={exchange}>{key} address: {exchange}, provider: correoslegit, tipo de datos:correos, Precio: 10$/correo</span>
                          </label>
                        </div>
                      )
                    })}
                </li>

                {this.state.unselected? this.shownounSelected() : this.loadExchanges()}


                </div>
    
      );
  }
}

export default Exchanges;
