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
  needToMove: boolean;
}

interface RoomState {
  state: 'pending' | 'started' | 'finished';
  couch_size: number;
  last_selected_id?: number;
  payload?: any;
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
let roomCode: string;

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

    roomCode = this.props.code;

    this.state = {
      code: this.props.code,
      name: this.props.name,
      id: this.props.id,
      needToMove: false,
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
      const ableToStart = this.state.roomState.participants.length >= (this.state.roomState.couch_size * 2);
      const startButtonText = ableToStart ? 'Start the Game' : 'Need more Players!';

      screenData = (
        <div>
          <h2>Game Code</h2>
          <h3>{this.state.code}</h3>
          <h2>Participants</h2>
          <ParticipantList participants={this.state.roomState.participants}/>
          <br/>
          <button className="btn-block" type="button" disabled={!ableToStart} onClick={this.startGame.bind(this)}>{startButtonText}</button>
        </div>
      )
    } else if (this.state.roomState.state === 'finished') {
      navigator.vibrate([300, 100, 300, 100, 300, 100, 300, 100, 300]);

      screenData = (
        <div>
          <br />
          <br />
          <b>Game over!</b>
          <br />
          Winners:
          <ul>
            {this.state.roomState.payload.winners.map((participant: any) => <li>{participant.name}</li>)}
          </ul>
        </div>
      )
    } else {
      const you: RoomState['participants'][0] | undefined = _.find(this.state.roomState.participants, (x) => x.id === this.state.id);

      if (!you) {
        return;
      }

      if (this.state.needToMove) {
        const style = {
          'background-color': 'red',
          'height': '100%',
        };

        navigator.vibrate(2000);

        screenData = (
          <div style={style}>
            <br />
            <br />
            <b>You need to move!</b>
            <br />
            <br />
            <button onClick={() => this.setState({needToMove: false})}>Yep I've Moved!</button>
            <br />
            <br />
          </div>
        )
      }
      else if (you.state.turn) {
        screenData = (
          <div>
            <h1>Your Turn!</h1>
            <h1>Who You Currently Have</h1>
            <WhoYouAre yourId={this.state.id} participants={this.state.roomState.participants} />
            <h1>Your Team</h1>
            <YourTeam yourId={this.state.id} participants={this.state.roomState.participants} />
            <h2>Choose someone</h2>
            <ChooseSomeone you={you} participants={this.state.roomState.participants} last_selected_id={this.state.roomState.last_selected_id}/>
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

    const previousRoomState = this.state.roomState;

    this.setState({
      loading: false,
      roomState: data,
    });

    this.stateChanged(previousRoomState, data);
  }

  stateChanged(previousState: GameScreenState['roomState'], newState: GameScreenState['roomState']) {
    if (!previousState || !newState) {
      return;
    }

    const youPrevious: Participant | undefined = _.find(previousState.participants, (p) => p.id === this.state.id);
    const youCurrent: Participant | undefined = _.find(newState.participants, (p) => p.id === this.state.id);

    if (!youPrevious || !youCurrent || !youPrevious.position) {
      return;
    }

    if (youPrevious.position != youCurrent.position) {
      this.setState({
        needToMove: true,
      });
    }
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
      <ul className="list-group">
        {this.props.participants.map((participant: any) => <li className="list-group-item">{participant.name}</li>)}
      </ul>
    );
  }
}

export class WhoYouAre extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      visible: false,
    };
  }

  render() {
    if (!this.state.visible) {
      return (
        <button onClick={this.handleClick.bind(this)}>Click Here to reveal</button>
      )
    }

    const you = _.find(this.props.participants, (x) => x.id === this.props.yourId);
    const fakeName = _.find(this.props.participants, (x) => x.id === you.fake_id).name;
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
      <ul className="list-group">
        {participants.map((participant: any) => <li className="list-grou-item">{participant.name}</li>)}
      </ul>
    )
  }
}

export class CurrentSeating extends React.Component<{yourId: number, participants: RoomState['participants']}, {yourId: number, participants: RoomState['participants']}> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const positions: Array<RoomState['participants'][0] | null> = [];

    const you: RoomState['participants'][0] | undefined = _.find(this.props.participants, (x) => x.id === this.props.yourId);
    if (!you) {
      return;
    }

    const totalSeats = this.props.participants.length + 1;

    positions.push(you);
    for (let i = 1; i < totalSeats; i++) {
      let relativePosition = (i + you.position) % totalSeats;
      const participant = _.find(this.props.participants, (x) => x.position === relativePosition);
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
        const isEmptyOnCouch = _.filter(this.props.participants, (x: RoomState['participants'][0]) => x.state.on_couch).length < couchSize;

        const emoji = isEmptyOnCouch ? `🛋️` : `🤷`;

        renderingList.push(<span>{emoji} [EMPTY]</span>);
      }
    }

    return (
      <ul className="list-group">
        {renderingList.map(item => <li className="list-group-item">{item}</li>)}
      </ul>
    )
  }
}

export class ChooseSomeone extends React.Component<{you: Participant, participants: Participant[], last_selected_id?: number}, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const participantsOrdered = getParticipantsLeftOfCurrent(this.props.you, this.props.participants);
    participantsOrdered.push(this.props.you);
    const buttons = participantsOrdered.map((x) => x ? <button className="btn-block" onClick={() => this.pickPlayer(x.id)} disabled={x.id === this.props.last_selected_id || x.id === this.props.you.fake_id}>{x.name}</button> : <button className="btn-block" disabled={true}>[Empty]</button>);

    return <div>{buttons.map((x) => <div>{x}</div>)}</div>
  }

  pickPlayer(fake_id: number) {
    axios.post(`http://${API_URL}/rooms/${roomCode}/actions/select_player`, {
      participant_id: fake_id
    })
      .catch(function (error: any) {
        alert('an error occurred :(');
        alert(error);
      });
  }
}
