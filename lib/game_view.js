const Game = require('./game');
const GameView = function (game, ctx) {
  this.ctx = ctx;
  this.game = game;
  this.interval = null;
};

GameView.prototype.start = function(rate, rain) {
  //start the animation
  console.log(rate);
  if (this.interval) {
    clearInterval(this.interval);
  }
  this.interval = setInterval(this.step.bind(this, rain), rate);
  // requestAnimationFrame(this.step.bind(this));
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

GameView.prototype.setTempValues = function(rain) {
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
      if (rain) {
        cell.bounceOffRipple();
      } else {
        cell.bounceOffSmooth();
      }
    }
  }
};

GameView.prototype.step = function(rain) {
  this.setTempValues(rain);

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
