import config from './config';
import { getRival } from './util';

type coor = Array<number>; 
type move = {pos: coor, reversibles: Array<coor>};
type gameState = Array<Array<string | null>>;
type availableState = Array<Array<boolean>>;

let SIZE = config.size;
if (SIZE < 8) {
  console.log('min size is 8*8');
  SIZE = 8;
} else if (SIZE > 16) {
  console.log('max size is 16*16');
  SIZE = 16;
}
if (SIZE % 2 !== 0) {
  console.log('size must be an even number');
  SIZE = 8;
}

const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];

/*
  * Check if a certain position is inside the board(is valid).
  */
export const isInBoundary = (o: Array<number>) => {
	if (o[0] < 0 || o[0] >= SIZE) return false;
	if (o[1] < 0 || o[1] >= SIZE) return false;
	return true;
}

var Search = {
  
  /*
  * Given a certain position, opponent and current state, calculate how many pieces can be reversed 
  * by this move.
  */
  SearchForReversiblePieces: (x: number, y: number, opponent: string, currentState: Array<Array<string|null>>): Array<coor> => {
    const finalResult: Array<coor> = [];
    const initialTarget = [x, y];
    const friendly = getRival(opponent);
  
    for (let dir of dirs) {
      const target = [...initialTarget];
      const reversibles: Array<coor> = [];
      const temp = [];
      target[0] += dir[0];
      target[1] += dir[1];
  
      while (isInBoundary(target)) {
        if (currentState[target[0]][target[1]] === null) {
          break;
        } else if (currentState[target[0]][target[1]] === friendly) {
          reversibles.splice(reversibles.length, 0, ...temp);
          break;
        } else {
          // encounter a opponent's piece. It is potential verersiable piece.
          temp.push([...target]);
        }
        target[0] += dir[0];
        target[1] += dir[1];
      }
  
      finalResult.splice(finalResult.length, 0, ...reversibles);
    }
    return finalResult;
  },

  /*
  * Search all positions, find out the ones you can make your next move. 
  * Return the available positions as a 2D array.
  */
	searchAvailable: function(opponent: string, currentState: gameState) {

		let noMoreMove = true;

		let temp = Array(SIZE).fill(null);
    let availableState = [];
    for (let i=0; i<=SIZE-1; i++){
      availableState[i] = temp.slice(0);
    }

		for (let i = SIZE - 1; i >= 0; i--) {
			for (let j = SIZE - 1; j >= 0; j--) {

        if (currentState[i][j] !== null) continue;

        let result = this.SearchForReversiblePieces(i, j, opponent, currentState);

        if (result.length > 0) {
          availableState[i][j] = true;
					noMoreMove = false;
        }
			};
		};

		return {
			availableState: availableState,
			noMoreMove: noMoreMove
		};
  },
  

  /*
  * Search all positions, find out the ones you can make your next move. 
  * Return all the available moves in a list
  */
  searchAvailableAuto: function(currentPlayer: string, state: gameState): Array<move> {
    const possibleMoves: Array<move> = [];
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (state[i][j] !== null) continue;
        let reversibles = Search.SearchForReversiblePieces(i, j, getRival(currentPlayer), state);
        if (reversibles.length > 0) {
          possibleMoves.push({pos: [i, j], reversibles: reversibles});
        }
      }
    }
    return possibleMoves;
  },

	CaculatePoints:function(currentState: Array<Array<string|null>>){
		let points = {
			X: 0,
			O: 0
		};

		for (let i = SIZE - 1; i >= 0; i--) {
			for (let j = SIZE - 1; j >= 0; j--) {
				if(currentState[i][j]==='X'){ points.X++; }
				if(currentState[i][j]==='O'){ points.O++; }
			};
		};

		return points;
	}, 
};

export default Search; 