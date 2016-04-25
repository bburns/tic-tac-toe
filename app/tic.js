
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

// get best move for the given player
// minimax algorithm
tic.getMove = function(board, maximizingPlayer, lookahead) {
    var score = tic.getScore(board) * playerCpu;
    if (lookahead==0 || score !==0) {
tic.logBoard(board);        
        var move = {i:null, j:null, score: score};
        return move;
    }
    var moves = tic.getMoves(board);
    if (maximizingPlayer) {
        var bestMove = {i:null, j:null, score:-9e9};
        for (var move of moves) {
// console.log(move);
            // place our piece
            board[move.i][move.j] = playerCpu;
            // given that move, what's the other player's best move (just assume they take it)
            var theirMove = tic.getMove(board, false, lookahead - 1); //. -2? 
            board[move.i][move.j] = 0;
            if (theirMove.score > bestMove.score) {
                move.score = theirMove.score;
                bestMove = move;
            }
        }
        return bestMove;
    } else {
        var bestMove = {i:null, j:null, score:9e9};
        for (var move of moves) {
            // place their piece
            board[move.i][move.j] = playerUser;
            // given that move, what's our best move
            var ourMove = tic.getMove(board, true, lookahead - 1);
            board[move.i][move.j] = 0;
            if (ourMove.score < bestMove.score) {
                move.score = ourMove.score;
                bestMove = move;
            }
        }
        return bestMove;
    }
};




// * export

module.exports = tic;


