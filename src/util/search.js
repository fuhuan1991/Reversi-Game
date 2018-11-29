import searchFunctionGenerator from './searchFunctionGenerator.js';
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

let left_up = searchFunctionGenerator('left_up');
let right_up = searchFunctionGenerator('right_up');
let right_down = searchFunctionGenerator('right_down');
let left_down = searchFunctionGenerator('left_down');
let up = searchFunctionGenerator('up');
let right = searchFunctionGenerator('right');
let down = searchFunctionGenerator('down');
let left = searchFunctionGenerator('left');

var Search = {
	SearchForReversalPieces: function(x,y,opponent,currentState){
		let final_result = {
			available:false,
			changeList:[]
		};

		let left_up_result = left_up(x,y,opponent,currentState);	
		let right_up_result = right_up(x,y,opponent,currentState);
		let right_down_result = right_down(x,y,opponent,currentState);
		let left_down_result = left_down(x,y,opponent,currentState);

		let up_result = up(x,y,opponent,currentState);
		let right_result = right(x,y,opponent,currentState);
		let down_result = down(x,y,opponent,currentState);
		let left_result = left(x,y,opponent,currentState);

		// 8个方向中至少有一个方向存在反转的可能性时才可以落子
		final_result.available=(left_up_result.available   ||up_result.available   ||
			                    right_up_result.available  ||right_result.available||
			                    right_down_result.available||down_result.available ||
			                    left_down_result.available ||left_result.available    )? true : false;

		final_result.changeList = left_up_result.changeList.concat(up_result.changeList,right_up_result.changeList,
																   right_result.changeList,right_down_result.changeList,
																   down_result.changeList,left_down_result.changeList,
																   left_result.changeList);
		return final_result;
	},

	searchAvailable:function(opponent,currentState){//搜索全部的方格，找出其中可以落子方格。

		let noMoreMove = true;

		let a0 = Array(SIZE).fill(null);
	  	let availableState = [];
	  	for (let i=0; i<=SIZE-1; i++){
	  		availableState[i] = a0.slice(0);
	  	}

		for (let i = SIZE - 1; i >= 0; i--) {
			for (let j = SIZE - 1; j >= 0; j--) {
				let result = this.SearchForReversalPieces(i,j,opponent,currentState);
				if(result.available && !currentState[i][j]){ 
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

	CaculatePoints:function(currentState){
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