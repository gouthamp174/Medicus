"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HttpInternalServerError = exports.HttpNotFoundError = exports.HttpForbiddenError = exports.HttpUnauthorizedError = exports.HttpBadRequestError = exports.UnauthorizedError = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

// User errors
var UnauthorizedError = /*#__PURE__*/function (_Error) {
  (0, _inherits2.default)(UnauthorizedError, _Error);

  var _super = _createSuper(UnauthorizedError);

  function UnauthorizedError(message) {
    var _this;

    (0, _classCallCheck2.default)(this, UnauthorizedError);
    _this = _super.call(this, message);
    _this.name = 'UnauthorizedError';
    return _this;
  }

  return UnauthorizedError;
}( /*#__PURE__*/(0, _wrapNativeSuper2.default)(Error)); // Custom HTTP Errors
// 400 series Error Codes


exports.UnauthorizedError = UnauthorizedError;

var HttpBadRequestError = /*#__PURE__*/function (_Error2) {
  (0, _inherits2.default)(HttpBadRequestError, _Error2);

  var _super2 = _createSuper(HttpBadRequestError);

  function HttpBadRequestError(message) {
    var _this2;

    (0, _classCallCheck2.default)(this, HttpBadRequestError);
    _this2 = _super2.call(this, message);
    _this2.name = 'HttpBadRequestError';
    _this2.statusCode = 400;
    return _this2;
  }

  return HttpBadRequestError;
}( /*#__PURE__*/(0, _wrapNativeSuper2.default)(Error));

exports.HttpBadRequestError = HttpBadRequestError;

var HttpUnauthorizedError = /*#__PURE__*/function (_Error3) {
  (0, _inherits2.default)(HttpUnauthorizedError, _Error3);

  var _super3 = _createSuper(HttpUnauthorizedError);

  function HttpUnauthorizedError(message) {
    var _this3;

    (0, _classCallCheck2.default)(this, HttpUnauthorizedError);
    _this3 = _super3.call(this, message);
    _this3.name = 'HttpUnauthorizedError';
    _this3.statusCode = 401;
    return _this3;
  }

  return HttpUnauthorizedError;
}( /*#__PURE__*/(0, _wrapNativeSuper2.default)(Error));

exports.HttpUnauthorizedError = HttpUnauthorizedError;

var HttpForbiddenError = /*#__PURE__*/function (_Error4) {
  (0, _inherits2.default)(HttpForbiddenError, _Error4);

  var _super4 = _createSuper(HttpForbiddenError);

  function HttpForbiddenError(message) {
    var _this4;

    (0, _classCallCheck2.default)(this, HttpForbiddenError);
    _this4 = _super4.call(this, message);
    _this4.name = 'HttpForbiddenError';
    _this4.statusCode = 403;
    return _this4;
  }

  return HttpForbiddenError;
}( /*#__PURE__*/(0, _wrapNativeSuper2.default)(Error));

exports.HttpForbiddenError = HttpForbiddenError;

var HttpNotFoundError = /*#__PURE__*/function (_Error5) {
  (0, _inherits2.default)(HttpNotFoundError, _Error5);

  var _super5 = _createSuper(HttpNotFoundError);

  function HttpNotFoundError(message) {
    var _this5;

    (0, _classCallCheck2.default)(this, HttpNotFoundError);
    _this5 = _super5.call(this, message);
    _this5.name = 'HttpNotFoundError';
    _this5.statusCode = 404;
    return _this5;
  }

  return HttpNotFoundError;
}( /*#__PURE__*/(0, _wrapNativeSuper2.default)(Error)); // 500 series Error Codes


exports.HttpNotFoundError = HttpNotFoundError;

var HttpInternalServerError = /*#__PURE__*/function (_Error6) {
  (0, _inherits2.default)(HttpInternalServerError, _Error6);

  var _super6 = _createSuper(HttpInternalServerError);

  function HttpInternalServerError(message) {
    var _this6;

    (0, _classCallCheck2.default)(this, HttpInternalServerError);
    _this6 = _super6.call(this, message);
    _this6.name = 'HttpInternalServerError';
    _this6.statusCode = 500;
    return _this6;
  }

  return HttpInternalServerError;
}( /*#__PURE__*/(0, _wrapNativeSuper2.default)(Error));

exports.HttpInternalServerError = HttpInternalServerError;