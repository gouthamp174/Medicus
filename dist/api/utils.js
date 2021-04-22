"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.speedLimiter = exports.limiter = void 0;

require("express");

require("axios");

var _expressRateLimit = _interopRequireDefault(require("express-rate-limit"));

var _expressSlowDown = _interopRequireDefault(require("express-slow-down"));

// Use axios to make http requests
// Limits allowed calls for x amount of ms
// Slows each following request if spammed
var limiter = (0, _expressRateLimit["default"])({
  windowMs: 30 * 1000,
  max: 10
});
exports.limiter = limiter;
var speedLimiter = (0, _expressSlowDown["default"])({
  windowMs: 30 * 1000,
  delayAfter: 1,
  delayMs: 500
});
exports.speedLimiter = speedLimiter;