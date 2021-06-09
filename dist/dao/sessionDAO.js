"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _mongodb = require("mongodb");

var SessionDAO = /*#__PURE__*/function () {
  function SessionDAO() {
    (0, _classCallCheck2.default)(this, SessionDAO);
  }

  (0, _createClass2.default)(SessionDAO, null, [{
    key: "injectDB",
    value: function () {
      var _injectDB = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(conn) {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.sessions) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                _context.prev = 2;
                _context.next = 5;
                return conn.db(process.env.DB_NS).collection("sessions", {
                  writeConcern: {
                    w: "majority"
                  }
                });

              case 5:
                this.sessions = _context.sent;
                _context.next = 11;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](2);
                console.error("Failed to connect to DB in SessionDAO: ".concat(_context.t0));

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 8]]);
      }));

      function injectDB(_x) {
        return _injectDB.apply(this, arguments);
      }

      return injectDB;
    }()
  }, {
    key: "getSession",
    value: function () {
      var _getSession = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(id) {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return this.sessions.findOne({
                  _id: (0, _mongodb.ObjectId)(id)
                });

              case 3:
                return _context2.abrupt("return", _context2.sent);

              case 6:
                _context2.prev = 6;
                _context2.t0 = _context2["catch"](0);
                console.error("Failed to retrieve session from DB. ".concat(_context2.t0));
                return _context2.abrupt("return", {});

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 6]]);
      }));

      function getSession(_x2) {
        return _getSession.apply(this, arguments);
      }

      return getSession;
    }()
  }, {
    key: "addSession",
    value: function () {
      var _addSession = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(username, startTime) {
        var response;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return this.sessions.insertOne({
                  username: username,
                  startTime: new Date(startTime)
                }, {
                  writeConcern: {
                    w: "majority"
                  }
                });

              case 3:
                response = _context3.sent;
                return _context3.abrupt("return", {
                  success: true,
                  id: response.insertedId
                });

              case 7:
                _context3.prev = 7;
                _context3.t0 = _context3["catch"](0);
                console.error("Failed to add a new session to DB. ".concat(_context3.t0));
                return _context3.abrupt("return", {
                  error: _context3.t0
                });

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 7]]);
      }));

      function addSession(_x3, _x4) {
        return _addSession.apply(this, arguments);
      }

      return addSession;
    }()
  }, {
    key: "deleteSession",
    value: function () {
      var _deleteSession = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(id) {
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return this.sessions.deleteOne({
                  _id: (0, _mongodb.ObjectId)(id)
                });

              case 3:
                return _context4.abrupt("return", {
                  success: true
                });

              case 6:
                _context4.prev = 6;
                _context4.t0 = _context4["catch"](0);
                console.error("Failed to delete session from DB. ".concat(_context4.t0));
                return _context4.abrupt("return", {
                  error: _context4.t0
                });

              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 6]]);
      }));

      function deleteSession(_x5) {
        return _deleteSession.apply(this, arguments);
      }

      return deleteSession;
    }()
  }]);
  return SessionDAO;
}();

exports.default = SessionDAO;
(0, _defineProperty2.default)(SessionDAO, "sessions", void 0);