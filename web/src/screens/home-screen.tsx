import * as React from 'react';
import {API_URL} from "../helpers/constants";
const axios = require('axios');

export class HomeScreen extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      screen: 'home',
      previousScreens: [],
    };
  }

  public render() {
    let formToShow = <WelcomeForm setScreen={(s: string) => this.setScreen(s)} goBack={() => this.goBack()}/>;

    if (this.state.screen === 'new') {
      formToShow = <NewRoomForm goBack={() => this.goBack()} startGame={(code: string, name: string) => this.startGame(code, name)}/>;
    } else if (this.state.screen === 'join') {
      formToShow = <JoinRoomForm goBack={() => this.goBack()} startGame={(code: string, name: string) => this.startGame(code, name)}/>;
    }

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">The Couch Game 🛋️</h1>
        </header>
        <div className="App-intro">
          {formToShow}
        </div>
      </div>
    );
  }

  setScreen(screen: string) {
    this.setState({
      screen,
      previousScreens: [this.state.screen, ...this.state.previousScreens]
    });
  }

  goBack() {
    if (this.state.previousScreens.length > 0) {
      const previousScreens = this.state.previousScreens;
      previousScreens.splice(1, 1);

      this.setState({
        ...this.state,
        screen: this.state.previousScreens[0],
        previousScreens: previousScreens
      });
    }
  }

  startGame(code: string, name: string) {
    this.props.startGame(code, name);
  }
}

class WelcomeForm extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <span>
        <p>Welcome to <em>The Couch Game</em>.</p>
        <p>Please select if you'd like to create a new game or join an existing game.</p>
        <button type="button" name="new" onClick={(event) => this.handleChange(event)}>New Game</button>
        <button type="button" name="join" onClick={(event) => this.handleChange(event)}>Join Game</button>
      </span>
    )
  }

  private handleChange(event: any) {
    this.props.setScreen(event.target.name);
  }
}

class NewRoomForm extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <span>
        TODO!!
      </span>
    )
  }
}

class JoinRoomForm extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      name: '',
      code: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Name: <br/>
            <input name="name" type="text" value={this.state.name} onChange={this.handleChange}/> <br/> <br/>
            Room Code: <br/>
            <input name="code" type="text" value={this.state.code} onChange={this.handleChange}/>
          </label>
          <input type="submit" value="Submit"/>
        </form>

        <button onClick={this.props.goBack}>Go Back</button>
      </div>
    );
  }

  private handleChange(event: any) {
    this.setState({[event.target.name]: event.target.value});
  }

  private handleSubmit(event: any) {
    event.preventDefault();
    const name = this.state.name;
    const code = this.state.code;
    const startGame = this.props.startGame;

    alert('A name was submitted: ' + name);
    axios.post(`http://${API_URL}/rooms/${code}/participants`, {
      name: this.state.name,
    })
      .then(function (response: any) {
        startGame(code, name, response.data.id);
      })
      .catch(function (error: any) {
        alert(`An error occurred :(`);
        alert(error);
      })
  }
}