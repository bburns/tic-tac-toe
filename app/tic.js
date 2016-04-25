
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




// * export

module.exports = tic;


