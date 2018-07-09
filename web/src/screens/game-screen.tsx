import * as React from 'react';
import {API_URL} from "../helpers/constants";
const axios = require('axios');
// const ws = require('ws');
const Websocket = require('react-websocket');
import * as _ from 'lodash';
import {CSSProperties} from "react";

interface GameScreenState {
  code: string;
  name: string;
  id: number;
  loading?: boolean;
  roomState?: RoomState;
}

interface RoomState {
  state: 'pending' | 'started';
  couch_size: number;
  participants: Array<Participant>;
}

interface Participant {
  id: number;
  team: number;
  name: string;
  fake_id: number;
  position: number;
  state: {
    on_couch: boolean;
    turn: boolean;
  }
}

let couchSize: number;

function getParticipantsLeftOfCurrent(current: Participant, participants: Participant[]): Array<Participant | null> {
  const totalSeats = participants.length + 1;
  const positions = [];
  for (let i = 1; i < totalSeats; i++) {
    let relativePosition = (i + current.position) % totalSeats;
    const participant = _.find(participants, (x) => x.position === relativePosition);
    if (participant) {
      positions.push(participant);
    } else {
      positions.push(null);
    }
  }

  return positions;
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

    if (!this.state.roomState || this.state.loading) {
      screenData = (
        <div>
          LOADING
        </div>
      )
    } else if (this.state.roomState.state === 'pending') {
      const ableToStart = this.state.roomState.participants.length >= (this.state.roomState.couch_size*2);
      const startButtonText = ableToStart ? 'Start the Game' : 'Need more Players!';

      screenData = (
        <div>
          <h1>Participants</h1>
          <ParticipantList participants={this.state.roomState.participants}/>
          <br />
          <button type="button" disabled={!ableToStart} onClick={this.startGame.bind(this)}>{startButtonText}</button>
        </div>
      )
    } else {
      const you: RoomState['participants'][0] | undefined = _.find(this.state.roomState.participants, (x) => x.id === this.state.id);

      if (!you) {
        return;
      }

      if (you.state.turn) {
        const buttons = getParticipantsLeftOfCurrent(you, this.state.roomState.participants).map((x) => x ? <button>{x.name}</button> : <button disabled={true}>[Empty]</button>);

        screenData = (
          <div>
            <h1>Your Turn!</h1>
            <h2>Choose someone</h2>
            {buttons.map((x) => <div>{x}</div>)}
          </div>
        )
      } else {
        screenData = (
          <div>
            <h1>Who You Currently Have</h1>
            <WhoYouAre yourId={this.state.id} participants={this.state.roomState.participants} />
            <h1>Your Team</h1>
            <YourTeam yourId={this.state.id} participants={this.state.roomState.participants} />
            <h1>Current Seating</h1>
            <h2>To your left</h2>
            <CurrentSeating yourId={this.state.id} participants={this.state.roomState.participants} />
          </div>
        )
      }


    }

    return (
      <div className="App">
        {websocketElement}
        {screenData}
      </div>
    )
  }

  startGame() {
    this.setState({
      loading: true,
    });

    axios.put(`http://${API_URL}/rooms/${this.state.code}`, {
      state: 'started'
    })
      .catch(function (error: any) {
        alert(`An error occurred :(`);
        alert(error);
      })
  }

  handleMessage(message: string) {
    const data = JSON.parse(message) as GameScreenState['roomState'];
    if (data) {
      couchSize = data.couch_size;
    }
    this.setState({
      loading: false,
      roomState: data,
    });
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

export class WhoYouAre extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      visible: false,
      yourId: this.props.yourId,
      participants: this.props.participants,
    };
  }

  render() {
    if (!this.state.visible) {
      return (
        <button onClick={this.handleClick.bind(this)}>Click Here to reveal</button>
      )
    }

    const you = _.find(this.state.participants, (x) => x.id === this.state.yourId);
    const fakeName = _.find(this.state.participants, (x) => x.id === you.fake_id).name
    return (
      <div><b>You are {fakeName}</b></div>
    )
  }

  handleClick() {
    this.setState({
      ...this.state,
      visible: true,
    });

    setTimeout(() => {
      this.setState({
        ...this.state,
        visible: false,
      });
    }, 5000);
  }
}

export class YourTeam extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      yourId: this.props.yourId,
      participants: this.props.participants,
    };
  }

  render() {
    const you = _.find(this.state.participants, (x) => x.id === this.state.yourId);
    const participants = _.filter(this.state.participants, (x) => x.team === you.team && x.id !== this.state.yourId);

    return (
      <ul>
        {participants.map((participant: any) => <li>{participant.name}</li>)}
      </ul>
    )
  }
}

export class CurrentSeating extends React.Component<{yourId: number, participants: RoomState['participants']}, {yourId: number, participants: RoomState['participants']}> {
  constructor(props: any) {
    super(props);
    this.state = {
      yourId: this.props.yourId,
      participants: this.props.participants,
    };
  }

  render() {
    const positions: Array<RoomState['participants'][0] | null> = [];

    const you: RoomState['participants'][0] | undefined = _.find(this.state.participants, (x) => x.id === this.state.yourId);
    if (!you) {
      return;
    }

    const totalSeats = this.state.participants.length + 1;

    for (let i = 1; i < totalSeats; i++) {
      let relativePosition = (i + you.position) % totalSeats;
      const participant = _.find(this.state.participants, (x) => x.position === relativePosition);
      if (participant) {
        positions.push(participant);
      } else {
        positions.push(null);
      }
    }

    const renderingList: JSX.Element[] = [];
    for (const participant of positions) {
      if (participant) {
        const style: CSSProperties = {};
        if (participant.team === you.team) {
          style['font-weight'] = 'bold';
        }

        const emoji = participant.state.on_couch ? `🛋️` : `🤷`;

        renderingList.push(<span style={style}>{emoji} {participant.name}</span>)
      } else {
        const isEmptyOnCouch = _.filter(this.state.participants, (x: RoomState['participants'][0]) => x.state.on_couch).length < couchSize;

        const emoji = isEmptyOnCouch ? `🛋️` : `🤷`;

        renderingList.push(<span>{emoji} [EMPTY]</span>);
      }
    }

    return (
      <ul>
        {renderingList.map(item => <li>{item}</li>)}
      </ul>
    )
  }
}

/*
export class GameStatus extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
  }
}
*/

/*
export class GameTurn extends React.Component<any, any> {

}
*/