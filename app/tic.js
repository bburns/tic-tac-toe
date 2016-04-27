
// tictactoe
// note: moves are given in row, col

var tic = {};

var X=1;
var O=-1;
var _=0;
var playerUser = X;
var playerCpu = O;
const LOOKAHEAD = 3;


var board_empty =
    [[_,_,_],
     [_,_,_],
     [_,_,_]];

// * logboard

tic.logBoard = function(board) {
    var s = board.map(row=>row.join('')).join('\n');
    s = s.replace(/-1/g,'O');
    s = s.replace(/1/g,'X');
    s = s.replace(/0/g,'_');
    s += '\n';
    s += tic.getScore(board);
    // s +='\n';
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
    var score = tic.getScore(board);
    if (lookahead==0 || score !==0 || moves.length==0) {
        var move = {i:-1, j:-1, score: score};
        return move;
    }
    var bestMove = {i:null, j:null, score:-9e9};
    for (var move of moves) {
        board[move.i][move.j] = player;
        var nextMove = tic.getMove(board, -player, lookahead - 1);
        nextMove.score = nextMove.score * player;
        if (nextMove.score==0) nextMove.score=0; // -0 -> 0, for chai assert
        board[move.i][move.j] = 0;
        if (nextMove.score > bestMove.score) {
            move.score = nextMove.score;
            bestMove = move;
        }
    }
    return bestMove;
};


// var board_oo =
//     [[X,O,_],
//      [O,O,_],
//      [X,X,_]];
// console.log(tic.getMove(board_oo, O, 2));

// var board_xx =
//     [[X,O,O],
//      [_,X,X],
//      [X,_,O]];
// console.log(tic.getMove(board_xx, O, 3));



// * run

// play a game against itself

tic.playAgainstSelf = function() {
    var board = board_empty;
    var score = 0;
    var gameState = 0;
    var playerUser = X;
    var playerCpu = -playerUser;
    gameState = 1;
    var player = X;
    while (gameState==1) {
        var move = tic.getMove(board, player, LOOKAHEAD);
        board[move.i][move.j] = player;
        score = tic.getScore(board);
        var moves = tic.getMoves(board);
        if (score!==0 || moves==0)
            gameState = 2;
        player = -player;
    }
    tic.logBoard(board);
};


// * export

module.exports = tic;


