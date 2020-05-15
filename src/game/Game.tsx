import React from 'react';
import './style/game.scss';
import Board from './Board';
import Scores from './Scores.jsx';
import Search from './search';
import config from './config';
import { pickLocation, isFinalState } from './auto';
import { getRival } from './util';


type gameState = Array<Array<string | null>>;
type coor = Array<number>; 
type availableState = Array<Array<boolean>>;
interface IProps {}

interface IState {
  _currentState: gameState,
  _gameStarted: boolean,
  _singleMode: boolean,
  _currentAvailabeState: availableState, // available locations
  _isForX: boolean, // is current player X? 
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

  constructor(props: any) {
    super(props);
    // const initialBoard = this.initializeGameState();
    const initialBoard = this.initializeGameState_special();
    this.state = {
      _gameStarted: false,
      _singleMode: true,
      _currentState: initialBoard, // current location
      _currentAvailabeState: this.initializeAvailabeState(initialBoard), // available locations
      _isForX: false, // is current piece a X? 
      _numberO: 2, // the number of Os
      _numberX: 2, // the number of Xs
      _gameFinished: false,
      _doubleMove: false
    };
  }

   // setup the initial pieces on the board
   initializeGameState(): gameState {
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

  initializeGameState_special() {
    return config.set1;
  }

  // calculate all the possible available positions 
  initializeAvailabeState(initialBoard: gameState) {
    let temp = Array(SIZE).fill(null);
  	let board = [];
  	for (let i=0; i<=SIZE-1; i++){
  		board[i] = temp.slice(0);
  	}
    const { availableState } = Search.searchAvailable('X', initialBoard);
    return availableState;
  }

  handleModeSelection = (single: boolean) => {
    this.setState({
      _singleMode: single,
      _gameStarted: true,
    });
  }

  // click event handler
  handleClick(x: number, y: number) {
    // check if the user clicled a valid position
    if (this.state._currentState[x][y] === 'O' || this.state._currentState[x][y] === 'X'){
      // cannot place a piece on another one
      console.log('occupied!');
      return false;
    } else if(this.state._gameFinished){
      // cannot place a piece outside available zone
      console.log('game is over!');
      return false;
    } else if(this.state._isForX && this.state._singleMode) {
      // in single mode, human player is (O)tail
      console.log('not your turn!');
      return false;
    } else if(!this.state._currentAvailabeState[x][y]){
      // no piece shall be reversed after this move
      // then it is invalid move
      console.log('invalid move!');
      return false;
    }

    const newState = this.land(x, y);
    this.setUpForNextPlayer(newState);
  }

  land(x: number, y: number): gameState {
    let currentPlayer = this.state._isForX? 'X' : 'O';
    let opponent = getRival(currentPlayer);
    let tempState = this.state._currentState;

    // We assume that there is at least one possible move.
    // Otherwise, this method won't be called
    let positionList: Array<coor> = Search.SearchForReversiblePieces(x, y, opponent, this.state._currentState);
    
    // add a new piece to the board and reverse opponent's pieces
    tempState[x][y] = currentPlayer;
    for (let pos of positionList) {
      tempState[pos[0]][pos[1]] = currentPlayer;
    }
    this.setState({
      _currentState: tempState,
    });
    return tempState;
  }

  setUpForNextPlayer(newState: gameState) {
    const currentPlayer = this.state._isForX? 'X' : 'O';
    const nextPlayer = getRival(currentPlayer);
    const nextPlayerMoves = Search.searchAvailable(currentPlayer, newState);
    const currentPlayerMoves = Search.searchAvailable(nextPlayer, newState);
    const point = Search.CaculatePoints(newState);

    if (nextPlayerMoves.noMoreMove && currentPlayerMoves.noMoreMove) {
      // No one can make further move, game over.
      this.setState({
        _gameFinished: true,
        _numberO: point.O,
        _numberX: point.X,
      });
    } else if (isFinalState(newState)) {
      // No space for further move, game over.
      this.setState({
        _gameFinished: true,
        _numberO: point.O,
        _numberX: point.X,
      });
    } else if (nextPlayerMoves.noMoreMove) {
      // next player cannot move, current player shall move again
      this.setState({
        _currentAvailabeState: currentPlayerMoves.availableState,
        _numberO: point.O,
        _numberX: point.X,
        _doubleMove: true,
      });

      if (this.state._singleMode && currentPlayer === 'X') {
        const p = new Promise((resolve, reject) => {
          setTimeout(() => resolve(), 1000);
        });
        p.then(()=>{
          this.computerMove(newState);
        });
      }
    } else {
      // general cases, toggle players
      this.setState({
        _currentAvailabeState: nextPlayerMoves.availableState,
        _isForX: nextPlayer === 'X', 
        _numberO: point.O,
        _numberX: point.X,
        _doubleMove: false
      })

      if (this.state._singleMode && nextPlayer === 'X') {
        const p = new Promise((resolve, reject) => {
          setTimeout(() => resolve(), 1000);
        });
        p.then(()=>{
          this.computerMove(newState);
        });
      }
    }
  }

  computerMove(state: gameState) {
    const pos = pickLocation('O', state);
    const newState = this.land(pos[0], pos[1]);
    this.setUpForNextPlayer(newState);
  }

  clearBoard(){
    let initialState = this.initializeGameState();
    this.setState({
      _gameStarted: false,
      _singleMode: true,
      _currentState: initialState,
      _currentAvailabeState: this.initializeAvailabeState(initialState),
      _isForX: false,
      _numberO: 2,
      _numberX: 2,
      _gameFinished: false
    });
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
              initialization = {!this.state._gameStarted}
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
}

export default Game; 