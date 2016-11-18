(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = null;
    hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("code/tic.js", function(exports, require, module) {
'use strict';

// tictactoe
// note: moves are given in row, col

var tic = {};

// * constants

tic.X = 1;
tic.O = -1;

// game states
tic.stateStart = 0; // wait for user to choose x or o
tic.stateUser = 1; // user's turn
tic.stateCpu = 2; // computer's turn
tic.stateLastMove = 3; // show last move
tic.stateEnd = 4; // show end dialog

tic.statePlay = 9; // for playAgainstSelf()

var _ = 0;
tic.boardEmpty = [[_, _, _], [_, _, _], [_, _, _]];

// * log

tic.getSpaces = function (nspaces) {
    var spaces = '';
    while (nspaces > 0) {
        spaces += '  ';
        nspaces--;
    }
    return spaces;
};

tic.log = function (board, indent) {
    var spaces = tic.getSpaces(indent);
    var s = board.map(function (row) {
        return spaces + row.join('');
    }).join('\n');
    s = s.replace(/-1/g, 'O');
    s = s.replace(/1/g, 'X');
    s = s.replace(/0/g, '_');
    s = s.replace(/2/g, '-');
    s += '\n';
    var score = spaces + 'score ' + tic.getScore(board) + '\n';
    s = score + s;
    console.log(s);
};

// * getScore

// return score for a board - +1 for + win, -1 for - win
tic.getScore = function (board) {
    // there are 8 ways to win for each side - 3 horiz, 3 vert, 2 diagonal
    var xwin = [1, 1, 1, 1, 1, 1, 1, 1];
    var ywin = [1, 1, 1, 1, 1, 1, 1, 1];
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            // check columns
            xwin[i] *= board[i][j] === 1;
            ywin[i] *= board[i][j] === -1;
            // check rows
            xwin[i + 3] *= board[j][i] === 1;
            ywin[i + 3] *= board[j][i] === -1;
        }
        // check diagonals
        xwin[6] *= board[i][i] === 1;
        ywin[6] *= board[i][i] === -1;
        xwin[7] *= board[i][2 - i] === 1;
        ywin[7] *= board[i][2 - i] === -1;
    }
    var xscore = xwin.reduce(function (a, b) {
        return a || b;
    }, 0);
    var yscore = ywin.reduce(function (a, b) {
        return a || b;
    }, 0);
    var score = xscore - yscore;
    return score;
};

// * getMoves

// get list of available moves
// each move is an object with {i,j}
// function getMoves(board) {
tic.getMoves = function (board) {
    var moves = [];
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (board[i][j] === 0) {
                var move = { i: i, j: j };
                moves.push(move);
            }
        }
    }
    return moves;
};

// * getMove

// get best move and score for given board and player
// returns [move, score], with move={i,j}
// this is the negamax algorithm
// https://en.wikipedia.org/wiki/Negamax
tic.getMove = function (board, player, lookahead) {

    // check if we're at a terminal node - if so just return the score
    var moves = tic.getMoves(board);
    var score = tic.getScore(board);
    if (lookahead == 0 || score !== 0 || moves.length == 0) {
        return [null, score];
    }

    // find the best move available for this player
    var bestMove = null;
    var bestScore = -Infinity;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = moves[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var move = _step.value;

            board[move.i][move.j] = player; // place piece
            var moveScore = tic.getMove(board, -player, lookahead - 1);
            board[move.i][move.j] = 0; // remove piece
            score = moveScore[1];
            score = score * player; // flip sign if needed
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    bestScore = bestScore * player; // flip sign back again
    if (bestScore == 0) bestScore = 0; // -0 -> 0, for chai assert
    return [bestMove, bestScore];
};

// * export

module.exports = tic;
});

require.register("components/App.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactModal = require('react-modal');

var _reactModal2 = _interopRequireDefault(_reactModal);

var _tic = require('../code/tic');

var _tic2 = _interopRequireDefault(_tic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App() {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(App).call(this));

        var state = {};
        state.playerUser = null;
        state.playerCpu = null;
        state.board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        state.lookahead = 4;
        state.showStart = true;
        state.showEnd = false;
        state.score = 0;
        state.delayCpu = 250; // ms
        state.delayLastMove = 1000; // ms
        state.delayEnd = 2000; // ms
        state.gameState = _tic2.default.stateStart;
        _this.state = state;
        return _this;
    }

    _createClass(App, [{
        key: 'onStart',
        value: function onStart() {
            var state = {};
            state.showStart = true;
            state.showEnd = false;
            state.gameState = _tic2.default.stateStart;
            this.setState(state);
        }
    }, {
        key: 'onChooseSide',
        value: function onChooseSide(evt) {
            console.log(evt.target.innerHTML);
            var side = evt.target.innerHTML;
            var player = side == 'X' ? _tic2.default.X : _tic2.default.O;
            var gameState = side == 'X' ? _tic2.default.stateUser : _tic2.default.stateCpu;
            var board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

            var state = this.state;
            state.playerUser = player;
            state.playerCpu = -player;
            state.showStart = false; // hide the dialog
            state.gameState = gameState;
            state.board = board;
            this.setState(state);
            this.forceUpdate();
            if (gameState == _tic2.default.stateCpu) {
                setTimeout(this.onCpuMove.bind(this), this.state.delayCpu);
            }
        }
    }, {
        key: 'onCpuMove',
        value: function onCpuMove() {
            var moveScore = _tic2.default.getMove(this.state.board, this.state.playerCpu, this.state.lookahead);
            var move = moveScore[0];
            console.log(move);
            var state = this.state;
            state.board[move.i][move.j] = this.state.playerCpu;
            _tic2.default.log(state.board);
            this.setState(state);
            this.forceUpdate();
            if (this.checkBoard()) {} else {
                this.onLastMove();
            }
        }
    }, {
        key: 'onChooseSquare',
        value: function onChooseSquare(i, j) {
            var state = this.state;
            if (state.board[i][j] === 0) {
                state.board[i][j] = this.state.playerUser;
                this.setState(state);
                _tic2.default.log(state.board);
                this.forceUpdate();
                if (this.checkBoard()) {
                    setTimeout(this.onCpuMove.bind(this), this.state.delayCpu);
                } else {
                    // this.onDone();
                    this.onLastMove();
                }
            }
        }
    }, {
        key: 'checkBoard',
        value: function checkBoard() {
            var moves = _tic2.default.getMoves(this.state.board);
            var score = _tic2.default.getScore(this.state.board);
            var cont = !(score !== 0 || moves.length == 0);
            var state = this.state;
            state.score = score;
            this.setState(state);
            return cont;
        }
    }, {
        key: 'onLastMove',
        value: function onLastMove() {
            //. show line through win
            var state = this.state;
            state.gameState = _tic2.default.stateLastMove;
            this.setState(state);
            // delay n secs and goto end
            setTimeout(this.onEnd.bind(this), this.state.delayLastMove);
        }
    }, {
        key: 'onEnd',
        value: function onEnd() {
            var state = this.state;
            state.gameState = _tic2.default.stateEnd;
            state.showEnd = true;
            var s = "";
            if (this.state.score == this.state.playerUser) s = "You won!!";else if (this.state.score == this.state.playerCpu) s = "You lost!!";else s = "Draw!";
            state.endMessage = s;
            this.setState(state);
            // delay n secs and goto start
            setTimeout(this.onStart.bind(this), this.state.delayEnd);
        }
    }, {
        key: 'render',
        value: function render() {

            var modalStyles = {};

            return _react2.default.createElement(
                'div',
                { id: 'content' },
                _react2.default.createElement(
                    _reactModal2.default,
                    {
                        isOpen: this.state.showStart,
                        style: modalStyles
                    },
                    _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement('br', null),
                        _react2.default.createElement(
                            'div',
                            null,
                            'Choose a side'
                        ),
                        _react2.default.createElement('br', null),
                        _react2.default.createElement(
                            'div',
                            null,
                            _react2.default.createElement(
                                'a',
                                { href: '#', onClick: this.onChooseSide.bind(this) },
                                'X'
                            ),
                            ' ',
                            _react2.default.createElement(
                                'a',
                                { href: '#', onClick: this.onChooseSide.bind(this) },
                                'O'
                            )
                        ),
                        _react2.default.createElement('br', null),
                        _react2.default.createElement(
                            'div',
                            null,
                            '(X goes first)'
                        ),
                        _react2.default.createElement('br', null)
                    )
                ),
                _react2.default.createElement(
                    _reactModal2.default,
                    {
                        isOpen: this.state.showEnd
                    },
                    _react2.default.createElement(
                        'div',
                        { className: 'end-message' },
                        this.state.endMessage
                    )
                ),
                _react2.default.createElement(Board, {
                    board: this.state.board,
                    onChooseSquare: this.onChooseSquare.bind(this)
                })
            );
        }
    }]);

    return App;
}(_react2.default.Component);

exports.default = App;

var Board = function (_React$Component2) {
    _inherits(Board, _React$Component2);

    function Board() {
        _classCallCheck(this, Board);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Board).apply(this, arguments));
    }

    _createClass(Board, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.updateCanvas();
            window.addEventListener('resize', this.updateCanvas.bind(this));
            var canvas = this.refs.canvas;
            canvas.addEventListener('click', this.handleClick.bind(this));
        }
    }, {
        key: 'handleClick',
        value: function handleClick(evt) {
            var canvas = this.refs.canvas;
            var x = evt.pageX - canvas.offsetLeft;
            var y = evt.pageY - canvas.offsetTop;
            var third = canvas.width / 3;
            var j = x < third ? 0 : x < third + third ? 1 : 2;
            var i = y < third ? 0 : y < third + third ? 1 : 2;
            this.props.onChooseSquare(i, j);
            this.updateCanvas();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.removeEventListener('resize', this.updateCanvas.bind(this));
            var canvas = this.refs.canvas;
            canvas.removeEventListener('click', this.handleClick.bind(this));
        }
    }, {
        key: 'updateCanvas',
        value: function updateCanvas() {

            var gridColor = "gray";

            var w = window.innerWidth - 2;
            var h = window.innerHeight - 2;
            var wh = Math.min(w, h) * 0.8;
            var third = wh / 3;
            var sixth = third / 2;

            var canvas = this.refs.canvas;

            if (!canvas) return;

            canvas.width = wh;
            canvas.height = wh;

            var ctx = this.refs.canvas.getContext('2d');
            ctx.translate(0.5, 0.5); // so lines look better

            // draw grid
            ctx.beginPath();
            ctx.lineWidth = 1; //. still too wide, as is 0.1
            ctx.moveTo(0, third);ctx.lineTo(wh, third);
            ctx.moveTo(0, third + third);ctx.lineTo(wh, third + third);
            ctx.moveTo(third, 0);ctx.lineTo(third, wh);
            ctx.moveTo(third + third, 0);ctx.lineTo(third + third, wh);
            ctx.strokeStyle = gridColor;
            ctx.stroke();

            // get letter positions
            var x = [];
            var y = [];
            var yoffset = sixth / 8;
            x[0] = sixth;
            y[0] = sixth + yoffset;
            x[1] = third + sixth;
            y[1] = third + sixth + yoffset;
            x[2] = third + third + sixth;
            y[2] = third + third + sixth + yoffset;

            var fontSize = third;
            ctx.font = fontSize + "px serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            // draw board state
            var board = this.props.board;
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    var piece = board[i][j];
                    if (piece !== 0) {
                        var letter = piece == _tic2.default.X ? 'X' : piece == _tic2.default.O ? 'O' : '-';
                        ctx.fillText(letter, x[j], y[i]);
                    }
                }
            }
        }
    }, {
        key: 'render',
        value: function render() {
            this.updateCanvas();
            return _react2.default.createElement('canvas', { id: 'canvas', ref: 'canvas', width: '100%', height: '100%' });
        }
    }]);

    return Board;
}(_react2.default.Component);
});

;require.register("initialize.js", function(exports, require, module) {
'use strict';

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _App = require('components/App');

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', function () {
  _reactDom2.default.render(_react2.default.createElement(_App2.default, null), document.querySelector('#app'));
});
});

require.alias("react/react.js", "react");
require.alias("react-modal/lib/index.js", "react-modal");
require.alias("process/browser.js", "process");
require.alias("base64-js/lib/b64.js", "base64-js");require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map