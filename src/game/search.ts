import config from './config.js';
import { getRival } from './util';

type coor = Array<number>; 

let SIZE = config.size;
if (SIZE < 8) {
  console.log('最小尺寸为8*8');
  SIZE = 8;
} else if (SIZE > 16) {
  console.log('最大尺寸为16*16');
  SIZE = 16;
}
if (SIZE % 2 !== 0) {
  console.log('期盼尺寸必须为偶数');
  SIZE++;
}

const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];

export const isInBoundary = (o: Array<number>) => {
	if (o[0] < 0 || o[0] >= SIZE) return false;
	if (o[1] < 0 || o[1] >= SIZE) return false;
	return true;
}

var Search = {
	// search for the pieces that can be reversed by current move
  SearchForReversiblePieces: (x: number, y: number, opponent: string, currentState: Array<Array<string|null>>) => {
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
        // console.log(target)
        if (currentState[target[0]][target[1]] === null) {
          break;
        } else if (currentState[target[0]][target[1]] === friendly) {
          reversibles.splice(reversibles.length, 0, ...temp);
          break;
        } else {
          // encounter a opponent's piece
          // console.log('target', target)
          temp.push([...target]);
        }
        target[0] += dir[0];
        target[1] += dir[1];
      }
  
      finalResult.splice(finalResult.length, 0, ...reversibles);
    }
    return finalResult;
  },

	searchAvailable:function(opponent: string, currentState: Array<Array<string|null>>){//搜索全部的方格，找出其中可以落子方格。
// console.log('searchAvailable', opponent)
		let noMoreMove = true;

		let temp = Array(SIZE).fill(null);
	  	let availableState = [];
	  	for (let i=0; i<=SIZE-1; i++){
	  		availableState[i] = temp.slice(0);
	  	}

		for (let i = SIZE - 1; i >= 0; i--) {
			for (let j = SIZE - 1; j >= 0; j--) {
        let result = this.SearchForReversiblePieces(i,j,opponent,currentState);
        if (result.length > 0 && !currentState[i][j]) {
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