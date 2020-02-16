import React from 'react';

class Square extends React.Component {

  constructor() {
    super();
    this.degree = Math.floor(Math.random()*360);
  }

  render() {
    let available = this.props.available;
    let squareStyle = {};
    if (available) {
      squareStyle = 'square available';
    } else if (this.props.chess_pieces === 'X') {
      squareStyle = 'square head';
    } else if (this.props.chess_pieces === 'O') {
      squareStyle = 'square tail';
    } else {
      squareStyle = 'square';
    }

    return (
      <button
        className={squareStyle}
        onClick={this.props.handleClick}
      >
        <div className='inner' style={{transform: `rotate(${this.degree}deg)`}}></div>
      </button>
    );


  }
}

export default Square;