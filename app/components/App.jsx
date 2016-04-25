
import React from 'react';


class Board extends React.Component {
    // constructor() {
    //     super();
    //     const w = window.innerWidth - 2;
    //     const h = window.innerHeight - 2;
    //     const wh = Math.min(w, h) * 0.8;
    //     var state = {};
    //     state.wh = wh;
    //     this.state = state;
    // }
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
        
        const ctx = this.refs.canvas.getContext('2d');
        
        const w = window.innerWidth - 2;
        const h = window.innerHeight - 2;
        const wh = Math.min(w, h) * 0.8;
        const third = wh/3;
        const sixth = third / 2;
        
        const canvas = this.refs.canvas;
        canvas.width = wh;
        canvas.height = wh;
        
        ctx.translate(0.5, 0.5); // so lines look better
        
        ctx.beginPath();
        
        ctx.moveTo(0, third);
        ctx.lineTo(wh, third);
        
        ctx.moveTo(0, third+third);
        ctx.lineTo(wh, third+third);
        
        ctx.moveTo(third, 0);
        ctx.lineTo(third, wh);
        
        ctx.moveTo(third+third, 0);
        ctx.lineTo(third+third, wh);
        
        ctx.strokeStyle = "gray";
        ctx.stroke();
        
        
        
        // ctx.beginPath();
        
        // ctx.moveTo(0, sixth);
        // ctx.lineTo(wh, sixth);
        
        // ctx.moveTo(0, third + sixth);
        // ctx.lineTo(wh, third + sixth);
        
        // ctx.moveTo(0, third+third + sixth);
        // ctx.lineTo(wh, third+third + sixth);
        
        // ctx.moveTo(sixth, 0);
        // ctx.lineTo(sixth, wh);
        
        // ctx.moveTo(third + sixth, 0);
        // ctx.lineTo(third + sixth, wh);
        
        // ctx.moveTo(third+third + sixth, 0);
        // ctx.lineTo(third+third + sixth, wh);
        
        // ctx.stroke();
        
        
        // draw X's and O's
        // const fontSize = third * 1.25;
        const fontSize = third;
        // const fontOffsetX = third * 0.0625;
        // const fontOffsetY = third * 0.125;
        ctx.font = fontSize + "px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        
        
        // ctx.fillText("X",0 + fontOffsetX, third - fontOffsetY);
        // ctx.fillText("O",third + fontOffsetX, third+third - fontOffsetY);
        // ctx.fillText("X",sixth, sixth);
        // ctx.fillText("O",third + sixth, third+third + sixth);
        
        
        const x = [];
        const y = [];
        const yoffset = sixth / 8;
        x[0] = sixth;
        y[0] = sixth + yoffset;
        x[1] = third + sixth;
        y[1] = third + sixth + yoffset;
        x[2] = third + third + sixth;
        y[2] = third + third + sixth + yoffset;
        
        ctx.fillText("X",x[0], y[0]);
        ctx.fillText("X",x[1], y[0]);
        ctx.fillText("O",x[1], y[2]);
        
        
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
