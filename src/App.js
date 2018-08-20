import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  /* constructor(props){
    super(props);
    this.state = {manager : ''};
  } */
  //above commented block is similiar to below
  state = {
    manager : '',
    players : [],
    balance : '',
    value   : '',
    message : ''
  }
  //fired when the component is rendered for the first time
  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager,players,balance });
  }

  //using () => notation sets the value to this to our component
  onSubmit = async (event) => {
    //to prevent the form from auto-submitting
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting on txn success'});

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({message: 'You have been entered!'});

  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting on txn success'});

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    })

    this.setState({message: 'A winner has been picked'});

    
  }

  render() {
    web3.eth.getAccounts().then(console.log());
    return (
      <div>
        <h2> Lottery Contract </h2>
        <p>
          This contract is managed by {this.state.manager}. 
          There are currently {this.state.players.length} players entered in the lottery. 
          There is currently {web3.utils.fromWei(this.state.balance,'ether')} ether in the pool.
        </p>

        <hr/>

        <form onSubmit = {this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
            value = {this.state.value}
            onChange = {event => this.setState({value : event.target.value})}
            />
            <button>Enter</button>
          </div>
        </form>
        <hr />
        <h4>Ready to pick a winner? </h4>
        <button onClick={this.onClick}> Pick a winner </button>
        <hr/>
        <h1> {this.state.message} </h1>
      </div>
    );
  }
}

export default App;
