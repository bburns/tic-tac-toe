
// tictactoe
// note: moves are given in row, col

var tic = {};

tic.LOOKAHEAD = 3;

tic.X=1;
tic.O=-1;

// game states
tic.stateStart = 0; // wait for user to choose x or o
tic.stateUser = 1; // user's turn
tic.stateCpu = 2; // computer's turn
tic.stateLastMove = 3; // show last move
tic.stateEnd = 4; // show end dialog

tic.statePlay = 9; // for playAgainstSelf()

var _=0;
tic.boardEmpty =
    [[_,_,_],
     [_,_,_],
     [_,_,_]];

// * log

tic.log = function(board, indent) {
    var spaces = '';
    while (indent > 0) {
        spaces += '  ';
        indent --;
    }
    var s = board.map(row=>spaces+row.join('')).join('\n');
    s = s.replace(/-1/g,'O');
    s = s.replace(/1/g,'X');
    s = s.replace(/0/g,'_');
    s += '\n';
    s += spaces + 'score ' + tic.getScore(board);
    console.log(s);
};


// * getScore

// return score for a board - +1 for + win, -1 for - win
tic.getScore = function(board) {
    // there are 8 ways to win for each side - 3 horiz, 3 vert, 2 diagonal
    var xwin = [1,1,1,1,1,1,1,1];
    var ywin = [1,1,1,1,1,1,1,1];
    for (var i=0; i<3; i++) {
        for (var j=0; j<3; j++) {
            // check columns
            xwin[i] *= (board[i][j]===1);
            ywin[i] *= (board[i][j]===-1);
            // check rows
            xwin[i+3] *= (board[j][i]===1);
            ywin[i+3] *= (board[j][i]===-1);
        }
        // check diagonals
        xwin[6] *= (board[i][i]===1);
        ywin[6] *= (board[i][i]===-1);
        xwin[7] *= (board[i][2-i]===1);
        ywin[7] *= (board[i][2-i]===-1);
    }
    var xscore = xwin.reduce((a,b)=>a || b, 0);
    var yscore = ywin.reduce((a,b)=>a || b, 0);
    var score = xscore - yscore;
    return score;
};


// * getMoves

// get list of available moves
// each move is an object with {i,j}
// function getMoves(board) {
tic.getMoves = function(board) {
    var moves = [];
    for (var i=0; i<3; i++) {
        for (var j=0; j<3; j++) {
            if (board[i][j]===0) {
                var move = {i:i, j:j};
                moves.push(move);
            }
        }
    }
    return moves;
};


// * getMove

// get best move for given board and player
// this is the negamax algorithm
tic.getMove = function(board, player, lookahead) {
    var moves = tic.getMoves(board);
    var score = tic.getScore(board) * player;
    if (lookahead==0 || score !==0 || moves.length==0) {
        var move = {i:null, j:null, score: score};
        return move;
    }
    var bestMove = {i:null, j:null, score:-9e9};
    for (var move of moves) {
        board[move.i][move.j] = player; // place piece
        var nextMove = tic.getMove(board, -player, lookahead - 1);
        nextMove.score = - nextMove.score;
        if (nextMove.score==0) nextMove.score=0; // -0 -> 0, for chai assert
        board[move.i][move.j] = 0; // remove piece
        if (nextMove.score > bestMove.score) {
            move.score = nextMove.score;
            bestMove = move;
        }
    }
    return bestMove;
};

// var X = tic.X, O = tic.O, _ = 0;

// var boardOO =
//     [[X,O,_],
//      [O,O,_],
//      [X,X,_]];
// console.log(tic.getMove(boardOO, O, 2));

// var boardXX =
//     [[X,O,O],
//      [_,X,X],
//      [X,_,O]];
// console.log(tic.getMove(boardXX, O, 3));

// var boardXX =
//     [[X,O,O],
//      [O,X,X],
//      [X,_,O]];
// console.log(tic.getMove(boardXX, O, 3));

// var board =
//     [[O,_,2],
//      [_,X,X],
//      [_,2,2]];
// console.log(tic.getMove(board, O, 3));
// console.log(tic.getMove(board, O, 2));

// * run

// play a game against itself

tic.playAgainstSelf = function() {
    var board = tic.boardEmpty;
    var score = 0;
    var gameState = tic.stateStart;
    var playerUser = tic.X;
    var playerCpu = -playerUser;
    gameState = tic.statePlay;
    var player = tic.X;
    // game loop
    while (gameState==tic.statePlay) {
        var move = tic.getMove(board, player, tic.LOOKAHEAD);
        board[move.i][move.j] = player;
        score = tic.getScore(board);
        var moves = tic.getMoves(board);
        if (score!==0 || moves==0)
            gameState = tic.stateDone;
        player = -player;
    }
    tic.log(board);
};


// * game

// class Game {
    
//     constructor() {
//         this.askSide = null;
//         this.askMove = null;
//     }

//     play() {
//         this.board = tic.boardEmpty; //. need to clone arrays
//         this.score = 0;
//         this.gameState = tic.stateStart;
//         // var playerUser = tic.X;
//         this.askSide(function(playerUser) {
//             this.playerUser = playerUser;
//             this.playerCpu = -playerUser;
//             this.gameState = tic.statePlay;
//             this.player = tic.X; // x goes first
//             // game loop
//             function loop() {
//                 if (this.gameState==tic.statePlay) {
//                     if (this.player==playerUser) {
//                         // log;
//                         var move = this.askMove('move?');
//                     } else {
//                         var move = tic.getMove(this.board, this.player, tic.LOOKAHEAD);
//                     }
//                     this.board[move.i][move.j] = this.player;
//                     this.score = tic.getScore(this.board);
//                     var moves = tic.getMoves(this.board);
//                     if (this.score!==0 || moves==0)
//                         this.gameState = tic.stateDone;
//                     this.player = -this.player;
//                     loop();
//                 }
//             }
//             loop();
//             tic.log(this.board);
//             tic.play(); // rerun/recurse
//         });
//     };
// }


// * export

module.exports = tic;


