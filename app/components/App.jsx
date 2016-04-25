
import React from 'react';


class Board extends React.Component {
    componentDidMount() {
        this.updateCanvas();
    }
    updateCanvas() {
        const ctx = this.refs.canvas.getContext('2d');
        const canvas = this.refs.canvas;
        canvas.width = window.innerWidth - 2;
        canvas.height = window.innerHeight - 2;
        ctx.translate(0.5, 0.5);
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.rect(0,0,canvas.width, canvas.height);
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
