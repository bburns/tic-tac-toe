
import React from 'react';


class Board extends React.Component {
    constructor() {
        super();
    //     const w = window.innerWidth - 2;
    //     const h = window.innerHeight - 2;
    //     const wh = Math.min(w, h) * 0.8;
    //     var state = {};
    //     state.wh = wh;
    //     this.state = state;
        var state = {};
        // state.board = [[0,0,0],[0,0,0],[0,0,0]];
        state.board = [[0,1,0],[0,-1,0],[1,0,0]];
        this.state = state;
    }
    componentDidMount() {
        this.updateCanvas();
        // window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('resize', this.updateCanvas.bind(this));
    }
    // handleResize() {
    //     // this.updateCanvas();
    //     var state = this.state;
    //     const w = window.innerWidth - 2;
    //     const h = window.innerHeight - 2;
    //     const wh = Math.min(w, h) * 0.8;
    //     state.wh = wh;
    //     this.setState(state);
    // }
    componentWillUnmount() {
        // window.removeEventListener('resize', this.handleResize.bind(this));
        window.removeEventListener('resize', this.updateCanvas.bind(this));
    }
    updateCanvas() {
        
        const gridColor = "gray";
        
        const ctx = this.refs.canvas.getContext('2d');
        
        const w = window.innerWidth - 2;
        const h = window.innerHeight - 2;
        const wh = Math.min(w, h) * 0.8;
        const third = wh/3;
        const sixth = third/2;
        
        const canvas = this.refs.canvas;
        canvas.width = wh;
        canvas.height = wh;
        
        ctx.translate(0.5, 0.5); // so lines look better
        
        // draw grid
        ctx.beginPath();
        ctx.moveTo(0, third); ctx.lineTo(wh, third);
        ctx.moveTo(0, third+third); ctx.lineTo(wh, third+third);
        ctx.moveTo(third, 0); ctx.lineTo(third, wh);
        ctx.moveTo(third+third, 0); ctx.lineTo(third+third, wh);
        ctx.strokeStyle = gridColor;
        ctx.stroke();
        
        // get letter positions
        const x = [];
        const y = [];
        const yoffset = sixth / 8;
        x[0] = sixth;
        y[0] = sixth + yoffset;
        x[1] = third + sixth;
        y[1] = third + sixth + yoffset;
        x[2] = third + third + sixth;
        y[2] = third + third + sixth + yoffset;
        
        const fontSize = third;
        ctx.font = fontSize + "px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        // draw X's and O's
        // ctx.fillText("X",x[0], y[0]);
        // ctx.fillText("X",x[1], y[0]);
        // ctx.fillText("O",x[1], y[2]);
        
        // draw board state
        const board = this.state.board;
        for (var i=0; i<3; i++) {
            for (var j=0; j<3; j++) {
                const piece = board[i][j];
                if (piece!==0) {
                    const letter = (piece > 0) ? 'X' : 'O';
                    ctx.fillText(letter, x[j], y[i]);
                }
            }
        }
    }
    
    render() {
        return (
            <canvas id="canvas" ref="canvas" width='100%' height='100%'/>
        );
    }
}


export default class App extends React.Component {
  render() {
    return (
      <div id="content">
            <Board />
      </div>
    );
  }
}
