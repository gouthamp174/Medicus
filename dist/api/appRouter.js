"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _utils = require("./utils");

var _router = require("./userApp/router");

var _authController = _interopRequireDefault(require("./userApp/authController"));

var _router2 = _interopRequireDefault(require("./appointmentApp/router"));

var _router3 = _interopRequireDefault(require("./chatApp/router"));

var router = new _express.Router();
router.get('/', _utils.limiter, _utils.speedLimiter, function (req, res) {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
}); // Authorize user for all requests except for paths starting with '/auth'.

router.use('/', _authController.default.authorizeSession);
router.use('/auth', _router.authRouter);
router.use('/users', _router.userRouter);
router.use('/appointments', _router2.default);
router.use('/chats', _router3.default);
var _default = router;
exports.default = _default;