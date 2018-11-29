
import React from 'react';
import '../style/game.css';
import Board from './Board.jsx';
import Search from '../util/search.js';
import config from '../config.js';

let SIZE = config.size;
if (SIZE < 8) {
	console.log('最小尺寸为8*8');
	SIZE = 8;
}else if(SIZE > 16) {
	console.log('最大尺寸为16*16');
	SIZE = 16;
}
if (SIZE%2 !== 0) {
	console.log('期盼尺寸必须为偶数');
	SIZE++;
}

class Game extends React.Component {
  initial_currentState() {
  	let a0 = Array(SIZE).fill(null);
  	let board = [];
  	for (let i=0; i<=SIZE-1; i++){
  		board[i] = a0.slice(0);
  	}
  	// 初始化的4枚棋子
    board[SIZE/2 - 1][SIZE/2 - 1] = 'X';
    board[SIZE/2 - 1][SIZE/2] = 'O';
    board[SIZE/2][SIZE/2 - 1] = 'O';
    board[SIZE/2][SIZE/2] = 'X'; 

    return board;
  }

  initial_currentAvailabeState() {
    let a0 = Array(SIZE).fill(null);
  	let board = [];
  	for (let i=0; i<=SIZE-1; i++){
  		board[i] = a0.slice(0);
  	}
    board[SIZE/2-2][SIZE/2-1] = true;
    board[SIZE/2 - 1][SIZE/2-2] = true;
    board[SIZE/2][SIZE/2+1] = true;
    board[SIZE/2+1][SIZE/2] = true;

    return board;
  }

  constructor(props) {
    super(props);
    this.state = {
      _currentState: this.initial_currentState(),//目前所有棋子位置
      _currentAvailabeState: this.initial_currentAvailabeState(),//此时可以落子的位置
      _isForX: false,//此时落子的是否为X
      _numberO: 2,//O棋子得到数量
      _numberX: 2,//X棋子的数量
      _gameFinished: false//是否已经分出胜负（所有格子都占满）
    };
  }

  handleClick(x,y) { 
  	console.log('click',x,y);
    if(this.state._currentState[x][y]){
      console.log('occupied!');
      return false;
    }
    else if(this.state._gameFinished){
      console.log('game is over!');
      return false;
    }

    let currentToken = this.state._isForX? 'X' : 'O';//判断此次落子是X还是O
    let opponent = this.state._isForX? 'O':'X';
    let tempState = this.state._currentState;//拷贝目前棋盘状态
    let result = {};
    let searchAvailableData = {};
    let points = {};
    let finishOrNot = false;

	if(this.state._currentAvailabeState[x][y]){
	  //如果这个点击的格子可以落子则进入结果分析阶段
	  result = Search.SearchForReversalPieces(x,y,opponent,tempState);
	  //修改棋盘状态，也就是记录此次落子
      tempState[x][y] = currentToken;

      //修改棋盘状态，反转对手棋子
      for (let i = result.changeList.length - 1; i >= 0; i--) {
        let temp_x = result.changeList[i].x;
        let temp_y = result.changeList[i].y;
        tempState[temp_x][temp_y] = currentToken;
      };

      //重新计算可以落子的区域
      searchAvailableData = Search.searchAvailable(currentToken,tempState);
      
      //计算双方棋子数量
      points = Search.CaculatePoints(tempState);

      //判断游戏是否结束
      if( (points.X+points.O) === 64 ){
        finishOrNot = true;
      }
      else if( searchAvailableData.noMoreMove ){
        finishOrNot = true;
      }

      //XO反转
      let isForXNext = !this.state._isForX;

      //正式修改状态
      this.setState({
          _currentState: tempState,
          _currentAvailabeState: searchAvailableData.availableState,
          _isForX: isForXNext,
          _numberO: points.O,
          _numberX: points.X,
          _gameFinished: finishOrNot,
      });
	};  
  }

  clearBoard(){
    let tempState = this.initial_currentState();
    let tempAvailabe = this.initial_currentAvailabeState();

    this.setState({
      _currentState: tempState,
      _currentAvailabeState: tempAvailabe,
      _isForX: false,
      _numberO: 2,
      _numberX: 2,
      _gameFinished: false
    });
  }

  render() {
    let nextPlayer = "";
    let status = "";

    if(this.state._gameFinished){
      if(this.state._numberO > this.state._numberX){
        status = "winner is tail!";
      }
      else if( this.state._numberO < this.state._numberX ){
        status = "winner is head!";
      }
      else{
        status = "want a second round?";
      }
    }
    else{
      nextPlayer = this.state._isForX? "head" : "tail";
      status = "Next player is: " + nextPlayer;
    }

    return (
      <div className="game">
        <div className="game-board">
          <div className="status">{status}</div>
          <Board currentState={this.state._currentState} 
                 handleClick={(i,j) => this.handleClick(i,j)}
                 currentAvailabeState={this.state._currentAvailabeState}/>
          <div className="status">number of "tail"s: {this.state._numberO}</div>
          <div className="status">number of "head"s: {this.state._numberX}</div>
        </div>
        <button className='clear' onClick={() => this.clearBoard()}>CLEAR</button>
      </div>
    );
  }
};

export default Game; 