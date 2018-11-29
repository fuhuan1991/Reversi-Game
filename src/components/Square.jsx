import React from 'react';

class Square extends React.Component {

  render() {
	let available = this.props.available; 
	let squareStyle = {}; 
	if (available) {
		squareStyle = 'square available';
	}else if(this.props.chess_pieces === 'X'){
		squareStyle = 'square head';
	}else if(this.props.chess_pieces === 'O'){
		squareStyle = 'square tail';
	}else{
		squareStyle = 'square';
	}

	return(
		<button 
			className={squareStyle} 
			onClick={this.props.handleClick}>
	    </button>
	);

    
  }
}

export default Square;