import config from './config';
import { getRival } from './util';
import Search from './search';

type coor = Array<number>;
type move = {pos: coor, reversibles: Array<coor>};
type gameState = Array<Array<string | null>>;


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

// export const pickLocation = (opponent: string, currentState: gameState) => {
//   const possibleMoves: Array<{value: number, pos: coor}> = [];
//   let maxValue: number = 0;
//   let finalMove: coor = [0, 0];

//   for (let i = SIZE - 1; i >= 0; i--) {
//     for (let j = SIZE - 1; j >= 0; j--) {
//       let result = Search.SearchForReversiblePieces(i, j, opponent, currentState);
//       if (result.length > 0 && !currentState[i][j]) {
//         let value = result.length;

//         if (atCorner(i, j)) {
//           value = Infinity;
//         } else if (atEdge(i, j)){
//           value = value * 2;
//         }

//         if (value > maxValue) {
//           finalMove = [i, j];
//           maxValue = value;
//         }

//         possibleMoves.push({
//           pos: [i, j],
//           value: value,
//         });
//       }
//     };
//   };
//   // console.log(possibleMoves);
//   return finalMove;
// }

export const pickLocation = (opponent: string, state: gameState): coor => {

  let maxScore: number = -Infinity;
  let finalMove: coor = [0, 0];
  let currentPlayer: string = getRival(opponent);

  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (state[i][j] !== null) continue;
      let reversibles = Search.SearchForReversiblePieces(i, j, opponent, state);

      if (reversibles.length > 0) {
        // console.log(i,j)
        // If there is corner to grab, grab it.
        if (atCorner(i, j)) return [i, j];

        // generate new state
        const newState: gameState = cloneState(state);
        for (let p of reversibles) {
          newState[p[0]][p[1]] = currentPlayer;
        }
        newState[i][j] = currentPlayer;

        // use recurive function to calculate score
        let score = getScoreFromState_R(newState, currentPlayer, 4);
        // console.log(score)
        if (score > maxScore) {
          maxScore = score;
          finalMove = [i, j];
        }
      }
    }
  }
  return finalMove;
}

// score is number of X's(head) - number of O's(tail) 
const getScoreFromState_S = (state: gameState): number => {
  let Xs = 0;
  let Os = 0;
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (state[i][j] === 'X') Xs++;
      if (state[i][j] === 'O') Os++;
    }
  }
  return Xs - Os;
}

const getScoreFromState_R = (state: gameState, currentPlayer: string, iCounter: number): any => {
  if (iCounter === 0 || isFinalState(state)) {
    return getScoreFromState_S(state);
  }

  const possibleMoves: Array<move> = [];

  // find all possible moves
  for (let i = SIZE - 1; i >= 0; i--) {
    for (let j = SIZE - 1; j >= 0; j--) {
      let result: Array<coor> = Search.SearchForReversiblePieces(i, j, getRival(currentPlayer), state);
      if (result.length > 0) possibleMoves.push({pos: [i, j], reversibles: result});
    }
  }

  if (possibleMoves.length === 0) {
    // no available move at current state. 
    // This means the rival can move again.
    return getScoreFromState_R(state, getRival(currentPlayer), iCounter-1);
  } else {
    // general case. If we reach here, we must got several possible moves.
    // Choose the one that can bring the maximum benefit(it depends on the identity of current player)
    const queue: Array<number> = [];
    for (let move of possibleMoves) {
      let value = 0;
      if (atCorner(move.pos[0], move.pos[1])) {
        if (currentPlayer === 'X') {
          return 999;
        } else {
          return -999;
        }
      }
      const newState: gameState = cloneState(state);
      for (let p of move.reversibles) {
        newState[p[0]][p[1]] = currentPlayer;
      }
      newState[move.pos[0]][move.pos[1]] = currentPlayer;
      value += getScoreFromState_R(newState, getRival(currentPlayer), iCounter-1);
      queue.push(value);
    }

    queue.sort((a, b) => a - b);

    if (currentPlayer === 'X') {
      return queue.pop();
    } else {
      return queue.shift();
    }
  }

}

// 
const cloneState = (state: gameState) => {

  const result = new Array(SIZE);
  for (let i = 0; i < SIZE; i++) {
    result[i] = new Array(SIZE).fill(null);
  }

  for (let i = SIZE - 1; i >= 0; i--) {
    for (let j = SIZE - 1; j >= 0; j--) {
      result[i][j] = state[i][j];
    }
  }

  return result;
}

const atCorner = (x: number, y: number): boolean => {
  if (x === 0 && y === 0) return true;
  if (x === 0 && y === SIZE-1) return true;
  if (x === SIZE-1 && y === 0) return true;
  if (x === SIZE-1 && y === SIZE-1) return true;
  return false;
}

const atEdge = (x: number, y: number): boolean => {
  if (x === 0) return true;
  if (x === SIZE-1) return true;
  if (y === 0) return true;
  if (y === SIZE-1) return true;
  return false;
}

const isFinalState = (state: gameState): boolean => {

  let Xs = 0;
  let Os = 0;

  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (state[i][j] === 'X') Xs++;
      if (state[i][j] === 'O') Os++;
    }
  }

  return (Xs + Os) === SIZE * SIZE;
}
