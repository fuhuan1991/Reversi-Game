import React from 'react';

class Scores extends React.Component {

  generateCoin (type, n) {
    const klass = type === 'X' ? 'head' : 'tail';
    const r = [];
    let bottom = 60;

    while (n > 0) {
        r.push(<div className={klass} style={{bottom: bottom + 'px'}} key={bottom}/>);
        bottom += 10;
        n--;
    }
    return r;
  }

  render() {
    const xNumber = this.props.x_number;
    const oNumber = this.props.o_number;

    return (
        <div className='scores'>
            <div style={{ height: '100%', width: '50%'}}>
                {this.generateCoin('X', xNumber)}
                <div style={{position: 'absolute', bottom: '0px', width: '80px', textAlign: 'center'}}>{xNumber}</div>
            </div>
            <div style={{ height: '100%', width: '50%'}}>
                {this.generateCoin('O', oNumber)}
                <div style={{position: 'absolute', bottom: '0px', width: '80px', textAlign: 'center'}}>{oNumber}</div>
            </div>
        </div>
    );


  }
}

export default Scores;