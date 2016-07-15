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

Cell.prototype.updateTempColors = function () {
  this.tempR += this.tempRVel;
  this.tempG += this.tempGVel;
  this.tempB += this.tempBVel;
};

Cell.prototype.bounceOffSmooth = function () {
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

Cell.prototype.bounceOffRipple = function () {
  if (this.tempR < 0) {
    this.tempR = -this.tempR;
    this.tempRVel += 255;
  } else if (this.tempR > 255) {
    this.tempR = 511 - this.tempR;
    this.tempRVel -= 255;
  }
  if (this.tempG < 0) {
    this.tempG = -this.tempG;
    this.tempGVel += 255;
  } else if (this.tempG > 255) {
    this.tempG = 511 - this.tempG;
    this.tempGVel -= 255;
  }
  if (this.tempB < 0) {
    this.tempB = -this.tempB;
    this.tempBVel += 255;
  } else if (this.tempB > 255) {
    this.tempB = 511 - this.tempB;
    this.tempBVel -= 255;
  }
};


module.exports = Cell;
