const Game = require('./game');
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
      cell.r = Math.random() * 255;
      cell.g = Math.random() * 255;
      cell.b = Math.random() * 255;
      cell.rVel = 0;
      cell.gVel = 0;
      cell.bVel = 0;
    }
  }
};

GameView.prototype.step = function () {
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
      debugger
      if (rSep !== 0 || gSep !== 0 || bSep !== 0) {
        rSep *= Game.sepNorm / Math.sqrt(rSep*rSep + gSep*gSep + bSep*bSep);
        gSep *= Game.sepNorm / Math.sqrt(rSep*rSep + gSep*gSep + bSep*bSep);
        bSep *= Game.sepNorm / Math.sqrt(rSep*rSep + gSep*gSep + bSep*bSep);
      }

      cell.updateRVel(rAve, rVelAve, rSep);
      cell.updateGVel(gAve, gVelAve, gSep);
      cell.updateBVel(bAve, bVelAve, bSep);
      // cell.clamp();
      cell.updateColors();
      cell.bounceOff();

      // this.ctx.fillStyle = `rgb(${Math.floor(cell.r)}, ${Math.floor(cell.g)}, ${Math.floor(cell.b)})`;
      this.ctx.fillStyle = `rgb(${~~cell.r}, ${~~cell.g}, ${~~cell.b})`;
      this.ctx.fillRect(cell.x, cell.y, Game.cellWidth, Game.cellHeight);
    }
  }
};

module.exports = GameView;
