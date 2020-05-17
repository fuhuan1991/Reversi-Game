//{ [index: string]: string; }
export default {
	size: 8,
	wait: 300, // millisecond
	iterations: 4,
	set1: [
		['O', null, null, null, 'X', 'X', 'X', null],
		['X', null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null],
	],
	set2: [
		['X', 'X', null, 'X', null, 'O', 'O', 'O'],
		['X', null, null, 'O', null, null, 'O', 'O'],
		['X', null, null, null, null, null, null, 'O'],
		['O', null, null, null, null, null, null, 'O'],
		['X', null, null, null, null, null, null, null],
		['X', null, null, null, null, null, null, null],
		['X', null, 'X', null, 'O', null, 'O', null],
		['O', null, 'O', null, 'X', null, 'X', null],
	],
};

