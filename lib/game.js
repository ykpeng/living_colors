const Cell = require('./cell');

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
      let options = { x: j * Game.DIM_X / Game.NumColumns,
                      y: i * Game.DIM_Y / Game.NumRows,
                      r: Math.random() * 255,
                      g: Math.random() * 255,
                      b: Math.random() * 255,
                      rVel: 0,
                      gVel: 0,
                      bVel: 0,
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
