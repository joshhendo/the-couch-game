import * as React from 'react';
import {API_URL} from "../helpers/constants";
// const axios = require('axios');
// const ws = require('ws');
const Websocket = require('react-websocket');

interface GameScreenState {
  code: string;
  name: string;
  id: number;
  roomState?: {
    state: 'pending' | 'started';
    couch_size: number;
    participants: Array<{
      id: number;
      name: string;
      fake_id: number;
    }>;
  };
}

export class GameScreen extends React.Component<any, GameScreenState> {
  constructor(props: any) {
    super(props);

    this.state = {
      code: this.props.code,
      name: this.props.name,
      id: this.props.id,
    }
  }

  public render() {
    const websocketUrl = `ws://${API_URL}/rooms/${this.state.code}`;
    const websocketElement = <Websocket url={websocketUrl} onMessage={this.handleMessage.bind(this)} onClose={this.closedWebsocket.bind(this)}/>;

    let screenData = null;

    if (!this.state.roomState) {
      screenData = (
        <div>
          LOADING
        </div>
      )
    } else if (this.state.roomState.state === 'pending') {
      screenData = (
        <div>
          Participants: <ParticipantList participants={this.state.roomState.participants}/>
        </div>
      )
    } else {
      screenData = (
        <div>
          Loaded!!
        </div>
      )
    }

    return (
      <div className="App">
        {websocketElement}
        {screenData}
      </div>
    )
  }

  handleMessage(message: string) {
    const data = JSON.parse(message) as GameScreenState['roomState'];
    this.setState({
      ...this.state,
      roomState: data,
    })
  }

  closedWebsocket(err: any) {
    alert('Error connecting. Please refresh your browser');
  }
}

export class ParticipantList extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = this.props.participants;
  }

  render() {
    return(
      <ul>
        {this.props.participants.map((participant: any) => <li>{participant.name}</li>)}
      </ul>
    );
  }
}