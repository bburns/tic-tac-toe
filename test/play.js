

// nowork
// var readlineSync = require('readline-sync');
// // var answer = readlineSync.question('Choose a side, x or o (x goes first): ');
// // console.log(answer);
// var key = readlineSync.keyIn('Choose a side, x or o (x goes first): ');
// // console.log(key);

// nowork
// var prompt = require('prompt-sync');
// var name = prompt('enter name: ');


// works
// var stdin = process.stdin;
// stdin.setRawMode(true); // else would only get lines
// stdin.resume();
// stdin.setEncoding('utf8');
// stdin.on('data', function(key) {
//     if (key === '\u0003') { // ctrl+c nowork
//         process.exit();
//     }
//     process.stdout.write(key);
// });



function askSide(next) {
    var stdin = process.stdin;
    stdin.setRawMode(true); // else would only get lines
    stdin.resume();
    stdin.setEncoding('utf8');
    process.stdout.write('x/o: '); // no linefeed
    stdin.on('data', function(key) {
        if (key === '\u0003') { // ctrl+c
            process.exit();
        }
        process.stdout.write(key);
        next(key);
        process.exit();
    });
}

// var onKey = function(key) {
//     console.log(key);
//     var side = 0;
//     if (key=='x')
//         side = 1;
//     else if (key=='o')
//         side = -1;
//     else return false;
//     return true;
// };

// var askSide = function(next) {
//     getChar('Choose side, x or o: ', onKey, next);
// };

var playGame = function(key) {
    console.log('playgame as ' + key);
    process.exit();
};

// getChar('x/o:');
// getChar('x/o:', process.exit);
askSide(playGame);

// askSide(playGame);

// var tic = require('../app/code/tic');
// var game = new tic.Game();
// // var chooseSide = function() {
// // };
// // var chooseSquare = function() {
// // };
// // var winLose = function() {
// // };
// // game.run(chooseSide, chooseSquare, winLose);

// var askSide = function(playerUser) {
    
// };
// var askMove = function() {
// };
// game.askSide = askSide;
// game.askMove = askMove;
// game.run();



// // // game.on('chooseSide', side);

// const readline = require('readline');
// const rl = readline.createInterface(process.stdin, process.stdout);

// var askSide = function() {
//     rl.setPrompt('Choose side, x or o (x goes first): ');
//     rl.on('line', (side) => {
//         //   switch(line.trim()) {
//         //     case 'hello':
//         //       console.log('world!');
//         //       break;
//         //     default:
//         //       console.log('Say what? I might have heard `' + line.trim() + '`');
//         //       break;
//         // }
//         // rl.prompt();
//         console.log(side);
//         process.exit(0);
//     }).on('close', () => {
//         console.log('Quitting...');
//         process.exit(0);
//     });
//     rl.prompt();
// };

// askSide();




// rl.question('> ', function(s) {process.exit(0);});


// rl.on('line', (cmd) => {
//     console.log(`You just typed: ${cmd}`);
//     process.exit(0);
// });

// rl.prompt();
