
// tictactoe

// note: moves are given in row, col

var tic = {};

// var playerUser = -1;
// var playerCpu = -playerUser;

var X=1;
var O=-1;
var _=0;
var playerUser = X;
var playerCpu = O;


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



// * export

module.exports = tic;


