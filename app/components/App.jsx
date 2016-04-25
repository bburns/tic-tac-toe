
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
        const canvas = this.refs.canvas;
        const w = window.innerWidth - 2;
        const h = window.innerHeight - 2;
        const wh = Math.min(w, h) * 0.8;
        canvas.width = wh;
        canvas.height = wh;
        ctx.translate(0.5, 0.5); // so lines look better
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(wh, wh);
        ctx.rect(0,0,wh,wh);
        ctx.stroke();
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
