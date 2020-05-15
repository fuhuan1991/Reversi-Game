import React from 'react';
import Square from './Square';
import config from './config';

let SIZE = config.size;
if (SIZE < 8) {
	console.log('minium size is 8*8');
	SIZE = 8;
}else if(SIZE > 16) {
	console.log('maximum size is 16*16');
	SIZE = 16;
}
if (SIZE%2 !== 0) {
	console.log('length must be even');
	SIZE++;
}

type availableState = Array<Array<boolean>>;

interface PropsType {
  currentState: Array<Array<string | null>>,
  currentAvailabeState: availableState, // the positions that can land a piece
  gameFinished: boolean, // is the game over
  initialization: boolean, // is the game in the initial stage
  number_of_O: number, // number of pieces of O(head)
  number_of_X: number, // number of pieces of X(tail)
  handleClick: Function, 
  handleModeSelection: Function,
}

class Board extends React.Component<PropsType> {

  renderSquare(i: number, j: number) {
    return (
      <Square 
        chess_pieces={this.props.currentState[i][j]} // the peice on that location
        available={this.props.currentAvailabeState[i][j]} // is this position available
        handleClick={() => this.props.handleClick(i,j)} 
        key={i*100+j}
      />
    );
  }   

  generateSquares(index: number) {
    let row = [];
    for(let i=0; i<=SIZE-1; i++) {
      row.push(this.renderSquare(index,i));
    }
    return row;
  }

  generateRows() {
    let rows = [];
    for(let i=0; i<=SIZE-1; i++) {
      rows.push(
        <div className="board-row" key={'R'+i}>
          {this.generateSquares(i)}
        </div>
      );
    }
    return rows;
  }

  generateFinishPopup() {
    const winner = this.props.number_of_O > this.props.number_of_X ? 'tail' : 'head';

    return(
      <div className="mask">
        <div className="finish_popup">
          <div className={winner}></div>
          <span>{winner} is the winner!</span>
        </div>
      </div>
    );
  }

  generateInitialPopup() {
    return(
      <div className="mask">
        <div className="finish_popup">
          <div className='selection' onClick={() => {this.props.handleModeSelection(true)}}>Single Player</div>
          <div className='selection' onClick={() => {this.props.handleModeSelection(false)}}>Two Players</div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="board">
        {this.props.gameFinished && this.generateFinishPopup()}
        {this.props.initialization && this.generateInitialPopup()}
        {this.generateRows()}
      </div>
    );
  }
}

export default Board;