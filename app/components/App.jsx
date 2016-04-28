
import React from 'react';
import Modal from 'react-modal';

import tic from '../code/tic';



export default class App extends React.Component {
    
    constructor() {
        super();
        var state = {};
        state.playerUser = null;
        state.playerCpu = null;
        state.board = [[0,0,0],[0,0,0],[0,0,0]];
        state.lookahead = 3;
        state.showStart = true;
        state.showEnd = false;
        state.score = 0;
        state.delayCpu = 500; // ms
        state.delayEnd = 2000; // ms
        // state.showStart = false;
        // state.showEnd = true;
        // state.score = 1;
        state.gameState = tic.stateStart;
        this.state = state;
    }
    
    onStart() {
        var state = {};
        state.showStart = true;
        state.showEnd = false;
        state.gameState = tic.stateStart;
        this.setState(state);
console.log(state);        
    }
    
    onChooseSide(evt) {
        console.log(evt.target.innerHTML);
        var side = evt.target.innerHTML;
        var player = (side=='X') ? tic.X : tic.O;
        var gameState = (side=='X') ? tic.stateUser : tic.stateCpu;
        var board = [[0,0,0],[0,0,0],[0,0,0]];
        
        var state = this.state;
        state.playerUser = player;
        state.playerCpu = - player;
        state.showStart = false; // hide the dialog
        state.gameState = gameState;
        state.board = board;
        this.setState(state);
        this.forceUpdate();
        if (gameState==tic.stateCpu) {
            setTimeout(this.onCpuMove.bind(this), this.state.delayCpu);
        }
    }

    onCpuMove() {
        var move = tic.getMove(this.state.board, this.state.playerCpu, this.state.lookahead);
        console.log(move);
        var state = this.state;
        state.board[move.i][move.j] = this.state.playerCpu;
        tic.log(state.board);
        this.setState(state);
        this.forceUpdate();
        if (this.checkBoard()) {
        } else {
            this.onDone();
        }
    }
    
    onChooseSquare(i, j) {
        var state = this.state;
        if (state.board[i][j]===0) {
            state.board[i][j] = this.state.playerUser;
            this.setState(state);
            tic.log(state.board);
            this.forceUpdate();
            if (this.checkBoard()) {
                setTimeout(this.onCpuMove.bind(this), this.state.delayCpu);
            } else {
                this.onDone();
            }            
        }
    }
    
    checkBoard() {
        var moves = tic.getMoves(this.state.board);
        var score = tic.getScore(this.state.board);
        var cont = !(score!==0 || moves.length==0);
        var state = this.state;
        state.score = score;
        this.setState(state);
        return cont;
    }
    
    onDone() {
        //. show line through win
        var state = this.state;
        state.gameState = tic.stateDone;
        state.showEnd = true;
        var s = "";
        if (this.state.score==this.state.playerUser)
            s = "You won!!";
        else if (this.state.score==this.state.playerCpu)
            s = "You lost!!";
        else
            s = "Draw!";
        state.endMessage = s;
        this.setState(state);
        // delay n secs and goto start
        setTimeout(this.onStart.bind(this), this.state.delayEnd);
    }
    
    
    render() {
        
        var modalStyles = {
        };
        
        return (
                <div id="content">
                
                <Modal
            isOpen={this.state.showStart}
            style={modalStyles}
                >
                <div>
                <br />
                <div>Choose a side</div><br />
                <div>
                <a href="#" onClick={this.onChooseSide.bind(this)}>X</a>
                &nbsp;
                <a href="#" onClick={this.onChooseSide.bind(this)}>O</a>
                </div><br />
                <div>(X goes first)</div><br />
                </div>
                </Modal>
                
                <Modal
            isOpen={this.state.showEnd}
                >
                <div className='end-message'>{this.state.endMessage}</div>
                </Modal>
                
                <Board
            board={this.state.board}
            onChooseSquare={this.onChooseSquare.bind(this)}
                />
                
                </div>
        );
    }
}


class Board extends React.Component {

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
        this.props.onChooseSquare(i, j);
        this.updateCanvas();
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
        
        if (!canvas) return;
        
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
        const board = this.props.board;
        for (var i=0; i<3; i++) {
            for (var j=0; j<3; j++) {
                const piece = board[i][j];
                if (piece!==0) {
                    // const letter = (piece > 0) ? 'X' : 'O';
                    const letter = (piece==tic.X) ? 'X' : (piece==tic.O) ? 'O' : '-';
                    ctx.fillText(letter, x[j], y[i]);
                }
            }
        }
    }

    render() {
        this.updateCanvas();
        return (
                <canvas id="canvas" ref="canvas" width='100%' height='100%'/>
        );
    }
}


