
import React from 'react';
import './style/game.scss';
import Board from './Board';
import Scores from './Scores.jsx';
import Search from './search';
import config from './config';
import { pickLocation } from './auto';
import { getRival } from './util';

type BOARD = Array<Array<string>>;
interface IProps {}

interface IState {
  _currentState: BOARD,
  _initialization: boolean,
  _single: boolean,
  _currentAvailabeState: BOARD, // available locations
  _isForX: boolean, // is current piece a X? 
  _numberO: number, // the number of Os
  _numberX: number, // the number of Xs
  _gameFinished: boolean,
  _doubleMove: boolean,
}

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

class Game extends React.Component<IProps, IState> {

  // setup the initial pieces on the board
  initialCurrentState() {
  	let temp = Array(SIZE).fill(null);
  	let board = [];
  	for (let i=0; i<=SIZE-1; i++){
  		board[i] = temp.slice(0);
  	}
  	// initialize 4 pieces (X is head, O is tail)
    board[SIZE/2 - 1][SIZE/2 - 1] = 'X';
    board[SIZE/2 - 1][SIZE/2] = 'O';
    board[SIZE/2][SIZE/2 - 1] = 'O';
    board[SIZE/2][SIZE/2] = 'X'; 
    return board;
  }

  // calculate all the possible available positions 
  initializeCurrentAvailabeState(initialBoard: BOARD) {
    let temp = Array(SIZE).fill(null);
  	let board = [];
  	for (let i=0; i<=SIZE-1; i++){
  		board[i] = temp.slice(0);
  	}

    const { availableState } = Search.searchAvailable('X', initialBoard);
    for (let i = 0; i <= SIZE-1; i++) {
      for (let j = 0; j <= SIZE-1; j++) {
        if (availableState[i][j]) board[i][j] = true;
      }
    }

    return board;
  }

  constructor(props: any) {
    super(props);
    const initialBoard = this.initialCurrentState();
    this.state = {
      _initialization: true,
      _single: true,
      _currentState: initialBoard, // current location
      _currentAvailabeState: this.initializeCurrentAvailabeState(initialBoard), // available locations
      _isForX: false, // is current piece a X? 
      _numberO: 2, // the number of Os
      _numberX: 2, // the number of Xs
      _gameFinished: false,
      _doubleMove: false
    };
  }

  handleClick(x: number,y: number) { 
    // cannot place a piece on another one
    if (this.state._currentState[x][y] === 'O' || this.state._currentState[x][y] === 'X'){
      console.log('occupied!');
      return false;
    } else if(this.state._gameFinished){
      // cannot place a piece outside available zone
      console.log('game is over!');
      return false;
    } else if(this.state._isForX && this.state._single) {
      // in single mode, human player is (O)tail
      console.log('not your turn!');
      return false;
    }
    if (this.state._currentAvailabeState[x][y]) this.land(x, y, this.state._single); 
  }

  // put down a piece and change state
  // If autoMove is true, computer shall be the next one to move
  land (x: number, y: number, autoMove: boolean) {
    let currentToken = this.state._isForX? 'X' : 'O';
    let opponent = this.state._isForX? 'O':'X';
    let tempState = this.state._currentState; // copy current board
    let result;
    let nextPlayersMoves;
    let points;
    let finishOrNot = false;

    result = Search.SearchForReversiblePieces(x, y, opponent, tempState);
    // change board state, record the current move
    tempState[x][y] = currentToken;

    // change board state, reverse opponent's pieces
    for (let i = result.length - 1; i >= 0; i--) {
      let temp_x = result[i][0];
      let temp_y = result[i][1];
      tempState[temp_x][temp_y] = currentToken;
    };

    // calculate the available locations for next player
    nextPlayersMoves = Search.searchAvailable(currentToken, tempState);
    // count piece numbers
    points = Search.CaculatePoints(tempState);

    // inverse side
    let isXNext = !this.state._isForX;
    let nextPlayersAvailabeState = nextPlayersMoves.availableState;
    let doubleMove = false;

    // check finish
    if( (points.X + points.O) === 64){
      // board full
      finishOrNot = true;
      autoMove = false;
    } else if( nextPlayersMoves.noMoreMove ){
      // After current player's move, next player cannot make a move.
      // There are several different situations.
      const currentPlayersMoves = Search.searchAvailable(getRival(currentToken), tempState);
      if (currentPlayersMoves.noMoreMove) {
        // both player cannot make any move, game over
        finishOrNot = true;
        autoMove = false;
      } else {
        // After player 1 made a move, player 2 cannot move, but player 1 can still make a move
        // Thus, player 1 moves again
        if (this.state._single) {
          if (this.state._isForX) {
            console.log('computer double move')
            autoMove = true;
            isXNext = this.state._isForX;
            nextPlayersAvailabeState = currentPlayersMoves.availableState;
            doubleMove = true;
          } else {
            console.log('human double move');
            autoMove = false;
            isXNext = this.state._isForX;
            nextPlayersAvailabeState = currentPlayersMoves.availableState;
            doubleMove = true;
          }
        } else {
          isXNext = this.state._isForX;
          nextPlayersAvailabeState = currentPlayersMoves.availableState;
          doubleMove = true;
        }
      }
    }

    if (autoMove) {
      const p = new Promise((resolve, reject) => {
        setTimeout(() => resolve(), 400);
      });
      p.then(()=>{
        this.computerMove();
      });
    }

    // change state
    this.setState({
      _currentState: tempState,
      _currentAvailabeState: nextPlayersAvailabeState,
      _isForX: isXNext,
      _numberO: points.O,
      _numberX: points.X,
      _gameFinished: finishOrNot,
      _doubleMove: doubleMove,
    });
  }

  clearBoard(){
    let tempState = this.initialCurrentState();
    let tempAvailabe = this.initializeCurrentAvailabeState(tempState);

    this.setState({
      _initialization: true,
      _single: true,
      _currentState: tempState,
      _currentAvailabeState: tempAvailabe,
      _isForX: false,
      _numberO: 2,
      _numberX: 2,
      _gameFinished: false
    });
  }

  handleModeSelection = (single: boolean) => {
    this.setState({
      _single: single,
      _initialization: false,
    });
  }

  computerMove() {
    const pos = pickLocation('O', this.state._currentState);
    this.land(pos[0], pos[1], false);
  }

  render() {
    let nextPlayer = "";
    let status = "";

    if (this.state._gameFinished){
      if (this.state._numberO > this.state._numberX){
        status = "winner is tail!";
      } else if ( this.state._numberO < this.state._numberX ){
        status = "winner is head!";
      } else {
        status = "want a second round?";
      }
    } else if (this.state._doubleMove) {
      const doubleMovePlayer = this.state._isForX? "head" : "tail";
      const theOther = this.state._isForX? "tail" : "head";
      status = `${theOther} has no moves, so ${doubleMovePlayer} moves again.`;
    } else{
      nextPlayer = this.state._isForX? "head" : "tail";
      status = "Current player: " + nextPlayer;
    }

    ///////test////////////////////////////////////
    // window.move = () => {
    //   const pos = pickLocation('O', this.state._currentState);
    //   this.land(pos[0], pos[1], false);
    // }
    ///////////////////////////////////////////////

    return (
      <React.Fragment>
        <div className="status white_font" >
          If you play alone, you play as tail and you move first, computer play as head.
        </div>
        <div className="game">
          <div className="game-board">
            <div className="status white_font" style={{display: 'inline-block'}}>{status}</div>
            <span className={this.state._isForX? 'coin_icon head' : 'coin_icon tail'}></span>
            <Board 
              initialization = {this.state._initialization}
              currentState={this.state._currentState} 
              currentAvailabeState={this.state._currentAvailabeState}
              gameFinished = {this.state._gameFinished}  
              number_of_O = {this.state._numberO}
              number_of_X = {this.state._numberX}   
              handleClick={(i: number, j: number) => this.handleClick(i,j)}
              handleModeSelection={this.handleModeSelection} 
            />
            <Scores x_number={this.state._numberX} o_number={this.state._numberO} />
            <div className="status white_font">number of "tail"s: {this.state._numberO}</div>
            <div className="status white_font">number of "head"s: {this.state._numberX}</div>
          </div>
          <button className='clear' onClick={() => this.clearBoard()}>RESET</button>
        </div>
      </React.Fragment>
    );
  }
};

export default Game; 