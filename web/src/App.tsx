import * as React from 'react';
import './App.css';
import {HomeScreen} from './screens/home-screen';
import {GameScreen} from "./screens/game-screen";

class App extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      screen: 'home',
      code: '',
      name: '',
    }
  }

  public render() {
    if (this.state.screen === 'home') {
        return (<HomeScreen startGame={(code: string, name: string, id: number) => this.startGame(code, name, id)}/>);
    } else {
      return (<GameScreen code={this.state.code} name={this.state.name} id={this.state.id}/>);
    }
  }

  startGame(code: string, name: string, id: number) {
    this.setState({
      screen: 'game',
      code: code,
      name: name,
      id: id,
    })
  }
}

export default App;
