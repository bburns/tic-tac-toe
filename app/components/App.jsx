
import React from 'react';
import Modal from 'react-modal';


export default class App extends React.Component {
    constructor() {
        super();
        var state = {};
        state.showModal = true;
        this.state = state;
    }
    onCloseModal() {
        this.setState({showModal: false});
    }
    
  render() {
        // onAfterOpen={null}
        // style={{}}
    return (
      <div id="content">
            <Modal
        isOpen={this.state.showModal}
        onRequestClose={this.onCloseModal.bind(this)}
        closeTimeoutMS={0}
            >
            <h1>Choose a side</h1>
            <p>(X goes first)</p>
            </Modal>
            <Board />
      </div>
    );
  }
}


class Board extends React.Component {
    
    constructor() {
        super();
        var state = {};
        // state.board = [[0,0,0],[0,0,0],[0,0,0]];
        state.board = [[0,1,0],[0,-1,0],[1,0,0]];
        this.state = state;
    }
    
    componentDidMount() {
        this.updateCanvas();
        window.addEventListener('resize', this.updateCanvas.bind(this));
        const canvas = this.refs.canvas;
        canvas.addEventListener('click', this.handleClick.bind(this));
    }
    
    handleClick(evt) {
        const canvas = this.refs.canvas;
        var x = evt.pageX - canvas.offsetLeft;
        var y = evt.pageY - canvas.offsetTop;
        const third = canvas.width / 3;
        const j = (x<third) ? 0 : (x<third+third) ? 1 : 2;
        const i = (y<third) ? 0 : (y<third+third) ? 1 : 2;
        var state = this.state;
        state.board[i][j] = 1;
        this.setState(state);
        this.updateCanvas();
        this.logBoard();
    }

    
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateCanvas.bind(this));
        const canvas = this.refs.canvas;
        canvas.removeEventListener('click', this.handleClick.bind(this));
    }
    
    updateCanvas() {
        
        const gridColor = "gray";
        
        const w = window.innerWidth - 2;
        const h = window.innerHeight - 2;
        const wh = Math.min(w, h) * 0.8;
        const third = wh/3;
        const sixth = third/2;
        
        const canvas = this.refs.canvas;
        canvas.width = wh;
        canvas.height = wh;
        
        const ctx = this.refs.canvas.getContext('2d');
        ctx.translate(0.5, 0.5); // so lines look better
        
        // draw grid
        ctx.beginPath();
        ctx.lineWidth = 1; //. still too wide, as is 0.1
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


