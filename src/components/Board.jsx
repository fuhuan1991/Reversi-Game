import React from 'react';
import Square from './Square';
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

class Board extends React.Component {
  renderSquare(i,j) {
    return (
      <Square 
        chess_pieces={this.props.currentState[i][j]} //此格子上的棋子
        available={this.props.currentAvailabeState[i][j]}//此格子是否可点
        handleClick={() => this.props.handleClick(i,j)} 
        key={i*100+j}
      />
    );
  }   

  generateSquares(index) {
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

  render() {
    return (
      <div className="board">
        {this.generateRows()}
      </div>
    );
  }
}

export default Board;