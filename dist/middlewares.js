"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notFound = notFound;
exports.errorHandler = errorHandler;

function notFound(req, res, next) {
  if (process.env.REACT_APP) next(); // In order to show custom error 404 page
  else {
      res.status(404);
      var error = new Error("\uD83D\uDD0D - Not Found - ".concat(req.originalUrl));
      next(error);
    }
}

function errorHandler(err, req, res, next) {
  var statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
}