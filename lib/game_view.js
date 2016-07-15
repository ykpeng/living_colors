const Game = require('./game');
const GameView = function (game, ctx) {
  this.ctx = ctx;
  this.game = game;
  this.interval = null;
};

GameView.prototype.start = function(rate, rain) {
  if (this.interval) {
    clearInterval(this.interval);
  }
  timeStep = 1000/rate;
  this.interval = setInterval(this.step.bind(this, rain), timeStep);

  this.clearInstructions();
  this.renderStats(rain, rate);
  this.renderRainButton(rain);
  this.renderSpeedButtons(rate);
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

      this.ctx.fillStyle = `rgb(${Math.floor(cell.r)}, ${Math.floor(cell.g)}, ${Math.floor(cell.b)})`;
      this.ctx.fillRect(cell.x, cell.y, Game.cellWidth, Game.cellHeight);
    }
  }
};

GameView.prototype.clearInstructions = function () {
  const nodes = document.getElementsByClassName("instructions");
  const $instructions = $(nodes[0]);
  $instructions.empty();
};

GameView.prototype.renderRainButton = function(rain){
  const nodes = document.getElementsByClassName("instructions");
  const $instructions = $(nodes[0]);

  $button = $("<div>").addClass("instruction");
  $key = $("<span>").addClass("key");
  if (rain) {
    $key.text("s");
    $button.append($key);
    $button.append("stop ripples");
  } else {
    $key.text("w");
    $button.append($key);
    $button.append("add ripples");
  }
  $instructions.append($button);
};

GameView.prototype.renderSpeedButtons = function (rate) {
  const nodes = document.getElementsByClassName("instructions");
  const $instructions = $(nodes[0]);

  $increase = $("<div>").addClass("instruction");
  $decrease = $("<div>").addClass("instruction");
  $incKey = $("<span>").addClass("key");
  $decKey = $("<span>").addClass("key");
  if (rate > 10) {
    $decKey.text("a");
    $decrease.append($decKey);
    $decrease.append("decrease speed");
    $instructions.append($decrease);
  }
  if (rate <= 90) {
    $incKey.text("d");
    $increase.append($incKey);
    $increase.append("increase speed");
    $instructions.append($increase);
    $instructions.append($increase);
  }

};

GameView.prototype.renderStats = function (rain, rate) {
  const nodes = document.getElementsByClassName("instructions");
  const $instructions = $(nodes[0]);
  $rain = $("<div>").addClass("instruction");
  $rain.append("Rippling effect: ");
  if (rain) {
    $rain.append("ON");
  } else {
    $rain.append("OFF");
  }
  $instructions.append($rain);

  $speed = $("<div>").addClass("instruction");
  $speed.text("Current speed: " + rate + " FPS");
  $instructions.append($speed);
};

module.exports = GameView;
