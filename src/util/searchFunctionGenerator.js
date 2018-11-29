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

/**
   * 生成一个针对于某个具体方向的搜索函数
   * @param  String dirction 要生成的搜索函数的方向
   */
function searchFunctionGenerator (dirction) {
	if (Object.prototype.toString.call(dirction) !== '[object String]') {
		throw new String('searchFunctionGenerator 的参数只能是字符串');
	}

	var nextTraget;
	var impasse;

	switch (dirction) {

		case 'left_up':
			nextTraget = function(x,y) { return {x: x-1, y: y-1}; };
			impasse = function(x,y) { return x===0 || y===0};
		break;
		case 'right_up':
			nextTraget = function(x,y) { return {x: x-1, y: y+1}; };
			impasse = function(x,y) { return x===0 || y===SIZE-1};
		break;
		case 'right_down':
			nextTraget = function(x,y) { return {x: x+1, y: y+1}; };
			impasse = function(x,y) { return x===SIZE-1 || y===SIZE-1};
		break;
		case 'left_down':
			nextTraget = function(x,y) { return {x: x+1, y: y-1}; };
			impasse = function(x,y) { return x===SIZE-1 || y===0};
		break;
		case 'up':
			nextTraget = function(x,y) { return {x: x-1, y: y}; };
			impasse = function(x,y) { return x===0 };
		break;
		case 'down':
			nextTraget = function(x,y) { return {x: x+1, y: y}; };
			impasse = function(x,y) { return x===SIZE-1 };
		break;
		case 'left':
			nextTraget = function(x,y) { return {x: x, y: y-1}; };
			impasse = function(x,y) { return y===0};
		break;
		case 'right':
			nextTraget = function(x,y) { return {x: x, y: y+1}; };
			impasse = function(x,y) { return y===SIZE-1 };
		break;
		default:
	  		throw 'searchFunctionGenerator: unknow dirction!';
	}
	//Function nextTraget 搜索下一个目标格子的函数
	//Function impasse 判断是否能够在此方向进一步搜索的函数

	/**
	   * 针对于某个具体方向的搜索函数
	   * @param Number x x轴坐标 （向下）
	   * @param Number y y轴坐标 （向右）
	   * @param String opponent 对手的棋子类型
	   * @param Object currentState 当前的棋子状态
	   */
	return function(x,y,opponent,currentState) {
		// console.log('-------')
		let mate = (opponent==='X')? 'O' : 'X';
		let opponentNear = false;
		let result = {
			available:false,
			changeList:[]
		};
		if(!impasse(x,y)) {//能否沿着此方向进行搜索？
			var target = nextTraget(x,y);
			// console.log(target.x, target.y)
		}else {
			//不行就结束，换下一个方向搜索。
			return result;
		}

		while(currentState[target.x][target.y]){//此方向临近的第一个格子里是否有棋子？若没有则不能落子，结束搜索。
			// console.log(target.x, target.y)
			if(currentState[target.x][target.y]===mate){
				// 目前分析的格子上存在己方棋子
				if(opponentNear){
					// 在此方向上先遭遇对手棋子，在遭遇己方棋子，结算反转棋子数量并停止在此方向上的搜索
					result.available = true;
					return result;
				}
				else{
					//在此方向上遇到对手棋子之前先遭遇了己方棋子，该方向不会再有反转棋子，结束搜索
					return result;
				}
			}
			else{
				// 目前分析的格子上存在对方棋子
				opponentNear = true;

				if( !impasse(target.x, target,y) ){
					//如果未触碰此方向的边界
					result.changeList.push({x:target.x,y:target.y});
					target = nextTraget(target.x, target.y)
				}
				else{
					//如果触碰了此方向的边界，则在此方向上无法反转对手棋子
					result.changeList = [];
					return result;
				}	
			}
		}
		result.changeList = [];
		return result;
	}
}


export default searchFunctionGenerator;
