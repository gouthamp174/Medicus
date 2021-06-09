"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _mongodb = require("mongodb");

var _errors = require("../errors");

var _userDAO = _interopRequireDefault(require("../../dao/userDAO"));

var _sessionDAO = _interopRequireDefault(require("../../dao/sessionDAO"));

var _models = require("../models");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// Hash algorithm for user passwords.
var hashPassword = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(password) {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _bcryptjs.default.hash(password, 10);

          case 2:
            return _context.abrupt("return", _context.sent);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function hashPassword(_x) {
    return _ref.apply(this, arguments);
  };
}();

var AuthController = /*#__PURE__*/function () {
  function AuthController() {
    (0, _classCallCheck2.default)(this, AuthController);
  }

  (0, _createClass2.default)(AuthController, null, [{
    key: "register",
    value: function () {
      var _register = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(req, res, next) {
        var userInfo, user, addUserResponse, sessionStartTime, addSessionResponse, session, sessionObj, authToken, userObj;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                userInfo = req.body;

                if (!(!userInfo || userInfo && !Object.keys(userInfo).length)) {
                  _context2.next = 4;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 4:
                _context2.next = 6;
                return _userDAO.default.getUser(userInfo.username);

              case 6:
                user = _context2.sent;

                if (!(user && Object.keys(user).length)) {
                  _context2.next = 9;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. User already exists.");

              case 9:
                if (!userInfo.password) {
                  _context2.next = 13;
                  break;
                }

                _context2.next = 12;
                return hashPassword(userInfo.password);

              case 12:
                userInfo.password = _context2.sent;

              case 13:
                _context2.next = 15;
                return _userDAO.default.addUser({
                  username: userInfo.username,
                  password: userInfo.password,
                  firstName: userInfo.firstName,
                  lastName: userInfo.lastName,
                  isPhysician: userInfo.isPhysician,
                  profilePhotoId: null,
                  dob: new Date(userInfo.dob),
                  gender: userInfo.gender,
                  qualification: userInfo.qualification,
                  specialization: userInfo.specialization
                });

              case 15:
                addUserResponse = _context2.sent;

                if (addUserResponse.success) {
                  _context2.next = 18;
                  break;
                }

                throw new _errors.HttpInternalServerError(addUserResponse.error);

              case 18:
                sessionStartTime = new Date();
                _context2.next = 21;
                return _sessionDAO.default.addSession(userInfo.username, sessionStartTime);

              case 21:
                addSessionResponse = _context2.sent;

                if (addSessionResponse.success) {
                  _context2.next = 24;
                  break;
                }

                throw new _errors.HttpInternalServerError(addSessionResponse.error);

              case 24:
                _context2.next = 26;
                return _sessionDAO.default.getSession(addSessionResponse.id);

              case 26:
                session = _context2.sent;
                sessionObj = new _models.Session(session);
                _context2.next = 30;
                return sessionObj.encoded();

              case 30:
                authToken = _context2.sent;
                userObj = new _models.User(userInfo);
                res.json(_objectSpread({
                  authToken: authToken
                }, userObj.toShortJson()));
                _context2.next = 40;
                break;

              case 35:
                _context2.prev = 35;
                _context2.t0 = _context2["catch"](0);
                res.status(400).json({
                  error: _context2.t0
                });
                console.error("Failed to register user: ".concat(_context2.t0));
                return _context2.abrupt("return");

              case 40:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 35]]);
      }));

      function register(_x2, _x3, _x4) {
        return _register.apply(this, arguments);
      }

      return register;
    }()
  }, {
    key: "signIn",
    value: function () {
      var _signIn = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(req, res, next) {
        var userInfo, user, userObj, passwordMatched, sessionStartTime, addSessionResponse, session, sessionObj, authToken;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                userInfo = req.body;

                if (userInfo) {
                  _context3.next = 4;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid username/password credentials.");

              case 4:
                _context3.next = 6;
                return _userDAO.default.getUser(userInfo.username);

              case 6:
                user = _context3.sent;

                if (!(!user || user && !Object.keys(user).length)) {
                  _context3.next = 9;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid username/password credentials.");

              case 9:
                userObj = new _models.User(user);
                _context3.next = 12;
                return userObj.comparePassword(userInfo.password);

              case 12:
                passwordMatched = _context3.sent;

                if (passwordMatched) {
                  _context3.next = 15;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid username/password credentials.");

              case 15:
                sessionStartTime = new Date();
                _context3.next = 18;
                return _sessionDAO.default.addSession(userInfo.username, sessionStartTime);

              case 18:
                addSessionResponse = _context3.sent;

                if (addSessionResponse.success) {
                  _context3.next = 21;
                  break;
                }

                throw new _errors.HttpInternalServerError(addSessionResponse.error);

              case 21:
                _context3.next = 23;
                return _sessionDAO.default.getSession(addSessionResponse.id);

              case 23:
                session = _context3.sent;
                sessionObj = new _models.Session(session);
                _context3.next = 27;
                return sessionObj.encoded();

              case 27:
                authToken = _context3.sent;
                res.json(_objectSpread({
                  authToken: authToken
                }, userObj.toShortJson()));
                _context3.next = 35;
                break;

              case 31:
                _context3.prev = 31;
                _context3.t0 = _context3["catch"](0);
                console.error("Failed to sign-in user. ".concat(_context3.t0));
                res.status(_context3.t0.statusCode).json({
                  message: _context3.t0.message
                });

              case 35:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 31]]);
      }));

      function signIn(_x5, _x6, _x7) {
        return _signIn.apply(this, arguments);
      }

      return signIn;
    }()
  }, {
    key: "signOut",
    value: function () {
      var _signOut = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(req, res, next) {
        var sessionInfo, response;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                sessionInfo = req.session;
                _context4.next = 4;
                return _sessionDAO.default.deleteSession(sessionInfo.id);

              case 4:
                response = _context4.sent;

                if (response.success) {
                  _context4.next = 7;
                  break;
                }

                throw new _errors.HttpInternalServerError(response.error);

              case 7:
                res.json({
                  success: true
                });
                _context4.next = 14;
                break;

              case 10:
                _context4.prev = 10;
                _context4.t0 = _context4["catch"](0);
                console.error("Failed to sign-out user. ".concat(_context4.t0));
                res.status(_context4.t0.statusCode).json({
                  message: _context4.t0.message
                });

              case 14:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 10]]);
      }));

      function signOut(_x8, _x9, _x10) {
        return _signOut.apply(this, arguments);
      }

      return signOut;
    }()
  }, {
    key: "updatePassword",
    value: function () {
      var _updatePassword = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5(req, res, next) {
        var updateInfo, newPasswordLength, user, userObj, passwordMatched, newPasswordHash, updateResponse;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                // Validate req body.
                updateInfo = req.body;

                if (!(!updateInfo || updateInfo && !Object.keys(updateInfo).length)) {
                  _context5.next = 4;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 4:
                if (!(!updateInfo.currentPassword || !updateInfo.newPassword)) {
                  _context5.next = 6;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 6:
                // Validate if newPassword is within password range limits.
                newPasswordLength = updateInfo.newPassword.length;

                if (!(newPasswordLength < 8 || newPasswordLength > 20)) {
                  _context5.next = 9;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 9:
                _context5.next = 11;
                return _userDAO.default.getUser(req.session.username);

              case 11:
                user = _context5.sent;
                userObj = new _models.User(user); // Verify currentPassword matches user's current password.

                _context5.next = 15;
                return userObj.comparePassword(updateInfo.currentPassword);

              case 15:
                passwordMatched = _context5.sent;

                if (passwordMatched) {
                  _context5.next = 18;
                  break;
                }

                throw new _errors.HttpBadRequestError("Current password does not match.");

              case 18:
                _context5.next = 20;
                return hashPassword(updateInfo.newPassword);

              case 20:
                newPasswordHash = _context5.sent;
                _context5.next = 23;
                return _userDAO.default.updateUser(user.username, {
                  password: newPasswordHash
                });

              case 23:
                updateResponse = _context5.sent;

                if (updateResponse.success) {
                  _context5.next = 26;
                  break;
                }

                throw new _errors.HttpInternalServerError(updateResponse.error);

              case 26:
                res.json({
                  success: true
                });
                _context5.next = 33;
                break;

              case 29:
                _context5.prev = 29;
                _context5.t0 = _context5["catch"](0);
                console.error("Failed to update user password. ".concat(_context5.t0));
                res.status(_context5.t0.statusCode).json({
                  message: _context5.t0.message
                });

              case 33:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[0, 29]]);
      }));

      function updatePassword(_x11, _x12, _x13) {
        return _updatePassword.apply(this, arguments);
      }

      return updatePassword;
    }()
  }, {
    key: "authorizeSession",
    value: function () {
      var _authorizeSession = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6(req, res, next) {
        var sessionJwt, decodedSession, session;
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!(!req.path.startsWith("/auth/register") && !req.path.startsWith("/auth/signin"))) {
                  _context6.next = 19;
                  break;
                }

                _context6.prev = 1;
                sessionJwt = req.get("Authorization").slice("Bearer ".length);
                _context6.next = 5;
                return _models.Session.decoded(sessionJwt);

              case 5:
                decodedSession = _context6.sent;
                _context6.next = 8;
                return _sessionDAO.default.getSession(decodedSession.id);

              case 8:
                session = _context6.sent;

                if (!(!session || session && !Object.keys(session).length)) {
                  _context6.next = 11;
                  break;
                }

                throw new _errors.HttpUnauthorizedError("No existing session was found.");

              case 11:
                req.session = decodedSession;
                _context6.next = 19;
                break;

              case 14:
                _context6.prev = 14;
                _context6.t0 = _context6["catch"](1);
                console.error("Failed to authorize user session. ".concat(_context6.t0));
                res.status(_context6.t0.statusCode).json({
                  message: "Failed to authorize user session."
                });
                next(_context6.t0);

              case 19:
                next();

              case 20:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[1, 14]]);
      }));

      function authorizeSession(_x14, _x15, _x16) {
        return _authorizeSession.apply(this, arguments);
      }

      return authorizeSession;
    }()
  }]);
  return AuthController;
}();

exports.default = AuthController;