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

const dirs = [[0, 1], [1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1], [-1, 0], [0, -1]];


/*
  * Check if a certain position is inside the board(is valid).
  */
export const isInBoundary = (o: Array<number>) => {
	if (o[0] < 0 || o[0] >= SIZE) return false;
	if (o[1] < 0 || o[1] >= SIZE) return false;
	return true;
};

const searchDir = (x: number, y: number, dir: coor, currentPlayer: string, state: gameState): number => {
  let target:coor = [x + dir[0], y + dir[1]];
  let FCD: number = 2; // Friendly Complete Direction    OOOOO|
  let CD: number = 1; // Complete Direction    OOXOX|

  while (isInBoundary(target)) {
    if (state[target[0]][target[1]] === null) {
      FCD = 0;
      CD = 0;
      break;
    } else if (state[target[0]][target[1]] === currentPlayer) {
      //
    } else {
      FCD = 0;
    }
    target[0] += dir[0];
    target[1] += dir[1];
  }
  return Math.max(FCD, CD);
};

var Search = {
  
  /*
  * Given a certain position, opponent and current state, calculate how many pieces can be reversed 
  * by this move.
  */
  searchForReversiblePieces: (x: number, y: number, opponent: string, currentState: Array<Array<string|null>>): Array<coor> => {
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

  getSecureAxis: function (x:number, y:number, currentPlayer: string, state: gameState): number {
    if(state[x][y] != currentPlayer) return 0;
    let axis = 0;
    for (let i = 0; i < dirs.length/2; i++) {
      let mainDirection = dirs[i];
      let reverseDirection = dirs[dirs.length - i - 1];
      let value: number = searchDir(x, y, mainDirection, currentPlayer, state) + searchDir(x, y, reverseDirection, currentPlayer, state);
      if (value >= 2) axis++;
    }

    return axis;
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

        let result = this.searchForReversiblePieces(i, j, opponent, currentState);

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
        let reversibles = Search.searchForReversiblePieces(i, j, getRival(currentPlayer), state);
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