import React, { Component } from 'react';
import Game from './game/Game';
import './style.scss';

class App extends Component {
  render() {
    return (
      <div className='main'>
        <Game />
      </div>
    );
  }
}

export default App;
