
// test tictactoe

// note: to run the tests in this file, must run mocha on cmdline,
// can't just run it from node.

var chai = require('chai');
var should = chai.should();

var tic = require('../app/code/tic');

var X=tic.X;
var O=tic.O;
var _=0;
var playerUser = X;
var playerCpu = O;

var boardEmpty =
    [[_,_,_],
     [_,_,_],
     [_,_,_]];
var boardXXX =
    [[X,O,X],
     [O,X,_],
     [_,O,X]];
var boardOOO =
    [[X,O,X],
     [O,X,X],
     [O,O,O]];
var boardOO =
    [[X,O,_],
     [O,O,_],
     [X,X,_]];
var boardXX =
    [[_,_,O],
     [_,X,X],
     [X,_,O]];

describe('tictactoe', function() {
    // it('should calculate score correctly', function() {
    //     tic.getScore(boardEmpty).should.equal(0);
    //     tic.getScore(boardXX).should.equal(0);
    //     tic.getScore(boardOO).should.equal(0);
    //     tic.getScore(boardXXX).should.equal(X);
    //     tic.getScore(boardOOO).should.equal(O);
    // });
    // it('should get list of available moves', function() {
    //     tic.getMoves(boardEmpty).length.should.equal(9);
    //     tic.getMoves(boardXX).length.should.equal(4);
    //     tic.getMoves(boardXXX).should.eql([{i:1,j:2},{i:2,j:0}]);
    // });
    // it('should finish oo', function() {
// var boardOO =
    // [[X,O,_],
     // [O,O,_],
     // [X,X,_]];
    //     tic.getMove(boardOO, O, 3).should.eql({i:1,j:2,score:1});
    // });
    // it('should block xx', function() {
// var boardXX =
    // [[_,_,O],
     // [_,X,X],
     // [X,_,O]];
    //     tic.getMove(boardXX, O, 3).should.eql({i:1,j:0,score:0});
    // });
    // this board led to a bug
    it('should block xx again', function() {
        var board =
            [[O,_,2],
             [_,X,X],
             [_,2,2]];
        // tic.getMove(board, O, 3).should.eql({i:1,j:0,score:0});
        tic.getMove(board, O, 2).should.eql({i:1,j:0,score:0});
    });
    // it('should play a game against itself', function() {
    //     tic.playAgainstSelf();
    // });
});


