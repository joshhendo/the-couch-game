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
      formToShow = <NewRoomForm goBack={() => this.goBack()} startGame={this.startGame.bind(this)}/>;
    } else if (this.state.screen === 'join') {
      formToShow = <JoinRoomForm goBack={() => this.goBack()} startGame={this.startGame.bind(this)}/>;
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

  startGame(code: string, name: string, id: number) {
    this.props.startGame(code, name, id);
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
        <button className="btn-block" type="button" name="new" onClick={(event) => this.handleChange(event)}>New Game</button>
        <br />
        <button className="btn-block" type="button" name="join" onClick={(event) => this.handleChange(event)}>Join Game</button>
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
    this.state = {
      name: '',
      size: 3,
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
            <input className="form-control" name="name" type="text" value={this.state.name} onChange={this.handleChange}/> <br/>
            Couch Size: <br/>
            <input className="form-control" name="size" type="text" value={this.state.size} onChange={this.handleChange}/>
          </label>
          <br />
          <input className="btn-block" type="submit" value="Submit"/>
        </form>

        <br />
        <button className="btn-block" onClick={this.props.goBack}>Go Back</button>
      </div>
    )
  }

  private handleChange(event: any) {
    let value = event.target.value;
    if (event.target.name === 'size') {
      value = value.replace(/[^0-9]/g, '');
      if (value.length > 0) {
        if (+value > 10) {
          value = '10';
        }
        if (+value < 2) {
          value = '2';
        }
      }
    }
    this.setState({[event.target.name]: value});
  }

  private handleSubmit(event: any) {
    event.preventDefault();
    const name = this.state.name;
    const size = this.state.size;
    const startGame = this.props.startGame;
    let code = '';

    axios.post(`http://${API_URL}/rooms`, {
      couch_size: size
    })
      .then(function (response: any) {
        code = response.data.room_code;
        return axios.post(`http://${API_URL}/rooms/${code}/participants`, {
          name: name,
        })
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
            <input className="form-control" name="name" type="text" value={this.state.name} onChange={this.handleChange}/> <br/>
            Room Code: <br/>
            <input className="form-control" name="code" type="text" value={this.state.code} onChange={this.handleChange}/>
          </label>
          <br />
          <input className="btn-block" type="submit" value="Submit"/>
        </form>

        <br />
        <button className="btn-block" onClick={this.props.goBack}>Go Back</button>
      </div>
    );
  }

  private handleChange(event: any) {
    let value = event.target.value;
    if (event.target.name === 'code') {
      value = value.toUpperCase();
    }
    this.setState({[event.target.name]: value});
  }

  private handleSubmit(event: any) {
    event.preventDefault();
    const name = this.state.name;
    const code = this.state.code;
    const startGame = this.props.startGame;

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