/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const GameView = __webpack_require__(3);
	
	document.addEventListener("DOMContentLoaded", function(){
	  const canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	  const ctx = canvasEl.getContext("2d");
	  const game = new Game();
	  const gameView = new GameView(game, ctx)
	  gameView.start();
	  canvasEl.addEventListener("click", gameView.restart.bind(gameView), false);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Cell = __webpack_require__(2);
	
	const Game = function() {
	  this.grid = [];
	};
	
	Game.DIM_X = 900;
	Game.DIM_Y = 540;
	Game.NumColumns = 60;
	Game.NumRows = 36;
	Game.cellWidth = Game.DIM_X / Game.NumColumns;
	Game.cellHeight = Game.DIM_Y / Game.NumRows;
	Game.minDist = 8;
	Game.minDistSquare = Game.minDist * Game.minDist;
	Game.sepNorm = 4;
	
	Game.DIRS = [[-1, -1],
	             [ 0, -1],
	             [ 1, -1],
	             [-1,  0],
	             [ 1,  0],
	             [-1,  1],
	             [ 0,  1],
	             [ 1,  1]];
	
	// Game.DIRS = [[ 0, -1],
	//              [-1,  0],
	//              [ 1,  0],
	//              [ 0,  1]];
	
	Game.prototype.inBounds = function (i, j) {
	  return this.grid[i] && this.grid[i][j];
	};
	
	Game.prototype.setup = function () {
	  for (let i = 0; i < Game.NumRows; i++) {
	    this.grid.push([]);
	    for (let j = 0; j < Game.NumColumns; j++) {
	      let r = Math.random() * 255;
	      let g = Math.random() * 255;
	      let b = Math.random() * 255;
	      let options = { x: j * Game.DIM_X /    Game.NumColumns,
	                      y: i * Game.DIM_Y / Game.NumRows,
	                      r: r,
	                      g: g,
	                      b: b,
	                      tempR: r,
	                      tempG: g,
	                      tempB: b,
	                      rVel: 0,
	                      gVel: 0,
	                      bVel: 0,
	                      tempRVel: 0,
	                      tempGVel: 0,
	                      tempBVel: 0,
	                      neighbors: []
	                    }
	      let cell = new Cell(options);
	      this.grid[i].push(cell);
	    }
	  }
	
	  for (let i = 0; i < Game.NumRows; i++) {
	    for (let j = 0; j < Game.NumColumns; j++) {
	      let cell = this.grid[i][j]
	      Game.DIRS.forEach((dir) => {
	        let newI = i + dir[0];
	        let newJ = j + dir[1];
	        if (this.inBounds(newI, newJ)) {
	          cell.neighbors.push(this.grid[newI][newJ])
	        }
	      })
	    }
	  }
	};
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports) {

	// const Game = require('./game');
	
	const Cell = function(options) {
	  this.x = options.x;
	  this.y = options.y;
	  this.r = options.r;
	  this.g = options.g;
	  this.b = options.b;
	  this.tempR = options.tempR;
	  this.tempG = options.tempG;
	  this.tempB = options.tempB;
	  this.rVel = options.rVel;
	  this.gVel = options.gVel;
	  this.bVel = options.bVel;
	  this.tempRVel = options.tempRVel;
	  this.tempGVel = options.tempGVel;
	  this.tempBVel = options.tempBVel;
	  this.neighbors = options.neighbors;
	};
	
	Cell.ease = 0.67;
	
	Cell.prototype.updateTempRVel = function (rAve, rVelAve, rSep) {
	  this.tempRVel += Cell.ease * (rAve + rVelAve + rSep - this.r - this.tempRVel);
	};
	
	Cell.prototype.updateTempGVel = function (gAve, gVelAve, gSep) {
	  this.tempGVel += Cell.ease * (gAve + gVelAve + gSep - this.g - this.tempGVel);
	};
	
	Cell.prototype.updateTempBVel = function (bAve, bVelAve, bSep) {
	  this.tempBVel += Cell.ease * (bAve + bVelAve + bSep - this.b - this.tempBVel);
	};
	//
	// Cell.prototype.clamp = function () {
	//   if ((mag = Math.sqrt(this.rVel*this.rVel + this.gVel*this.gVel + this.bVel*this.bVel))> 255) {
	//       this.rVel *= (f = 255/mag);
	//       this.gVel *= f;
	//       this.bVel *= f;
	//     }
	// };
	
	Cell.prototype.updateTempColors = function () {
	  this.tempR += this.tempRVel;
	  this.tempG += this.tempGVel;
	  this.tempB += this.tempBVel;
	};
	
	Cell.prototype.bounceOff = function () {
	  if (this.tempR < 0) {
	    this.tempR = 0;
	    this.tempRVel *= -1;
	  } else if (this.tempR > 255) {
	    this.tempR = 255;
	    this.tempRVel *= -1;
	  }
	  if (this.tempG < 0) {
	    this.tempG = 0;
	    this.tempGVel *= -1;
	  } else if (this.tempG > 255) {
	    this.tempG = 255;
	    this.tempGVel *= -1;
	  }
	  if (this.tempB < 0) {
	    this.tempB = 0;
	    this.tempBVel *= -1;
	  } else if (this.tempB > 255) {
	    this.tempB = 255;
	    this.tempBVel *= -1;
	  }
	};
	
	
	module.exports = Cell;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const GameView = function (game, ctx) {
	  this.ctx = ctx;
	  this.game = game;
	};
	
	GameView.prototype.start = function () {
	  //start the animation
	  this.game.setup();
	  setInterval(this.step.bind(this), 1000/30);
	};
	
	GameView.prototype.restart = function (e) {
	  for (let i = 0; i < Game.NumRows; i++) {
	    for (let j = 0; j < Game.NumColumns; j++) {
	      let cell = this.game.grid[i][j];
	      cell.r = cell.tempR = Math.random() * 255;
	      cell.g = cell.tempG = Math.random() * 255;
	      cell.b = cell.tempG = Math.random() * 255;
	      cell.rVel = this.tempRVel = 0;
	      cell.gVel = this.tempGVel = 0;
	      cell.bVel = this.tempBVel = 0;
	    }
	  }
	};
	
	GameView.prototype.setTempValues = function () {
	  for (let i = 0; i < Game.NumRows; i++) {
	    for (let j = 0; j < Game.NumColumns; j++) {
	      let cell = this.game.grid[i][j];
	      let rAve = 0;
	      let gAve = 0;
	      let bAve = 0;
	      let rVelAve = 0;
	      let gVelAve = 0;
	      let bVelAve = 0;
	      let rSep = 0;
	      let gSep = 0;
	      let bSep = 0;
	      let numNeighbors = cell.neighbors.length;
	      for (let k = 0; k < numNeighbors; k++) {
	        let neighbor = cell.neighbors[k];
	        rAve += neighbor.r;
	        gAve += neighbor.g;
	        bAve += neighbor.b;
	        rVelAve += neighbor.rVel;
	        gVelAve += neighbor.gVel;
	        bVelAve += neighbor.bVel;
	        let dr = cell.r - neighbor.r;
	        let dg = cell.g - neighbor.g;
	        let db = cell.b - neighbor.b;
	        if ((dr*dr + dg*dg + db*db) < Game.minDistSquare) {
	          rSep += dr;
	          gSep += dg;
	          bSep += db;
	        }
	      }
	
	      rAve *= 1/numNeighbors;
	      gAve *= 1/numNeighbors;
	      bAve *= 1/numNeighbors;
	      rVelAve *= 1/numNeighbors;
	      gVelAve *= 1/numNeighbors;
	      bVelAve *= 1/numNeighbors;
	
	      if (rSep !== 0 || gSep !== 0 || bSep !== 0) {
	        rSep *= Game.sepNorm / Math.sqrt(rSep*rSep + gSep*gSep + bSep*bSep);
	        gSep *= Game.sepNorm / Math.sqrt(rSep*rSep + gSep*gSep + bSep*bSep);
	        bSep *= Game.sepNorm / Math.sqrt(rSep*rSep + gSep*gSep + bSep*bSep);
	      }
	
	      cell.updateTempRVel(rAve, rVelAve, rSep);
	      cell.updateTempGVel(gAve, gVelAve, gSep);
	      cell.updateTempBVel(bAve, bVelAve, bSep);
	      // cell.clamp();
	      cell.updateTempColors();
	      cell.bounceOff();
	    }
	  }
	};
	
	GameView.prototype.step = function () {
	  this.setTempValues();
	
	  for (let i = 0; i < Game.NumRows; i++) {
	    for (let j = 0; j < Game.NumColumns; j++) {
	      let cell = this.game.grid[i][j];
	      cell.rVel = cell.tempRVel;
	      cell.gVel = cell.tempGVel;
	      cell.bVel = cell.tempBVel;
	
	      cell.r = cell.tempR;
	      cell.g = cell.tempG;
	      cell.b = cell.tempB;
	
	      // this.ctx.fillStyle = `rgb(${Math.floor(cell.r)}, ${Math.floor(cell.g)}, ${Math.floor(cell.b)})`;
	      this.ctx.fillStyle = `rgb(${~~cell.r}, ${~~cell.g}, ${~~cell.b})`;
	      this.ctx.fillRect(cell.x, cell.y, Game.cellWidth, Game.cellHeight);
	    }
	  }
	};
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map