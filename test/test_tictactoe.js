
// test tictactoe

// note: to run the tests in this file, must run mocha on cmdline,
// can't just run it from node.

var chai = require('chai');
var should = chai.should();

var tic = require('../app/code/tic');

var X=1;
var O=-1;
var _=0;
var playerUser = X;
var playerCpu = O;

var board_empty =
    [[_,_,_],
     [_,_,_],
     [_,_,_]];
var board_xxx =
    [[X,O,X],
     [O,X,_],
     [_,O,X]];
var board_ooo =
    [[X,O,X],
     [O,X,X],
     [O,O,O]];
var board_oo =
    [[X,O,_],
     [O,O,_],
     [X,X,_]];
var board_xx =
    [[_,_,O],
     [_,X,X],
     [X,_,O]];

describe('tictactoe', function() {
    it('should calculate score correctly', function() {
        tic.getScore(board_empty).should.equal(0);
        tic.getScore(board_xx).should.equal(0);
        tic.getScore(board_oo).should.equal(0);
        tic.getScore(board_xxx).should.equal(X);
        tic.getScore(board_ooo).should.equal(O);
    });
    it('should get list of available moves', function() {
        tic.getMoves(board_empty).length.should.equal(9);
        tic.getMoves(board_xx).length.should.equal(4);
        tic.getMoves(board_xxx).should.eql([{i:1,j:2},{i:2,j:0}]);
    });
    it('should finish oo', function() {
        tic.getMove(board_oo, O, 1).should.eql({i:1,j:2,score:1});
    });
    it('should block xx', function() {
        tic.getMove(board_xx, O, 2).should.eql({i:1,j:0,score:0});
    });
    it('should play a game against itself', function() {
        tic.playAgainstSelf();
    });
});


