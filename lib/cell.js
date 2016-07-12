// const Game = require('./game');

const Cell = function(options) {
  this.x = options.x;
  this.y = options.y;
  this.r = options.r;
  this.g = options.g;
  this.b = options.b;
  this.rVel = options.rVel;
  this.gVel = options.gVel;
  this.bVel = options.bVel;
  this.neighbors = options.neighbors;
};

Cell.ease = 0.67;

Cell.prototype.updateRVel = function (rAve, rVelAve, rSep) {
  this.rVel += Cell.ease * (rAve + rVelAve + rSep - this.r - this.rVel);
};

Cell.prototype.updateGVel = function (gAve, gVelAve, gSep) {
  this.gVel += Cell.ease * (gAve + gVelAve + gSep - this.g - this.gVel);
};

Cell.prototype.updateBVel = function (bAve, bVelAve, bSep) {
  this.bVel += Cell.ease * (bAve + bVelAve + bSep - this.b - this.bVel);
};

Cell.prototype.clamp = function () {
  if ((mag = Math.sqrt(this.rVel*this.rVel + this.gVel*this.gVel + this.bVel*this.bVel))> 255) {
      this.rVel *= (f = 255/mag);
      this.gVel *= f;
      this.bVel *= f;
      console.log("clamped");
    }
};

Cell.prototype.updateColors = function () {
  this.r += this.rVel;
  this.g += this.gVel;
  this.b += this.bVel;
};

Cell.prototype.bounceOff = function () {
  if (this.r < 0) {
    this.r = 0;
    this.rVel *= -1;
  } else if (this.r > 255) {
    this.r = 255;
    this.rVel *= -1;
  }
  if (this.g < 0) {
    this.g = 0;
    this.gVel *= -1;
  } else if (this.g > 255) {
    this.g = 255;
    this.gVel *= -1;
  }
  if (this.b < 0) {
    this.b = 0;
    this.bVel *= -1;
  } else if (this.b > 255) {
    this.b = 255;
    this.bVel *= -1;
  }
};


module.exports = Cell;
