"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _socket = _interopRequireDefault(require("socket.io"));

var _messageDAO = _interopRequireDefault(require("../../dao/messageDAO"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var ChatInterface = /*#__PURE__*/function () {
  function ChatInterface() {
    (0, _classCallCheck2["default"])(this, ChatInterface);
  }

  (0, _createClass2["default"])(ChatInterface, null, [{
    key: "register",
    value: function () {
      var _register = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(io, socket) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                try {
                  this.io = io;
                  socket.on('disconnect', ChatInterface.disconnect);
                  socket.on('disconnecting', ChatInterface.disconnecting);
                  socket.on('join', ChatInterface.join);
                  socket.on('leave', ChatInterface.leave);
                  socket.on('chat', ChatInterface.receive);
                } catch (err) {
                  console.log("Failed to register chat interface callbacks. ".concat(err));
                }

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function register(_x, _x2) {
        return _register.apply(this, arguments);
      }

      return register;
    }()
  }, {
    key: "join",
    value: function () {
      var _join = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(data, callback) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                try {
                  this.join(data.chatId);
                  this.chatId = data.chatId;
                  callback({
                    status: "ok"
                  });
                } catch (err) {
                  console.error("Failed to join chat. ".concat(err));
                }

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function join(_x3, _x4) {
        return _join.apply(this, arguments);
      }

      return join;
    }()
  }, {
    key: "leave",
    value: function () {
      var _leave = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(data, callback) {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                try {
                  this.leave(data.chatId);
                  this.chatId = null;
                  callback({
                    status: "ok"
                  });
                } catch (err) {
                  console.error("Failed to leave chat. ".concat(err));
                }

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function leave(_x5, _x6) {
        return _leave.apply(this, arguments);
      }

      return leave;
    }()
  }, {
    key: "disconnect",
    value: function () {
      var _disconnect = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(reason) {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                console.log("Client is diconnecting. ".concat(reason));

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function disconnect(_x7) {
        return _disconnect.apply(this, arguments);
      }

      return disconnect;
    }()
  }, {
    key: "disconnecting",
    value: function () {
      var _disconnecting = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(reason) {
        var _iterator, _step, room;

        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                try {
                  console.log("Disconnecting from rooms. ".concat(reason));
                  _iterator = _createForOfIteratorHelper(this.rooms);

                  try {
                    for (_iterator.s(); !(_step = _iterator.n()).done;) {
                      room = _step.value;

                      if (room === this.chatId) {
                        //socket.to(room).emit("user has left", socket.id);
                        this.leave(this.chatId);
                      }
                    }
                  } catch (err) {
                    _iterator.e(err);
                  } finally {
                    _iterator.f();
                  }
                } catch (err) {
                  console.error("Failed to leave room while disconnecting.");
                }

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function disconnecting(_x8) {
        return _disconnecting.apply(this, arguments);
      }

      return disconnecting;
    }()
  }, {
    key: "receive",
    value: function () {
      var _receive = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(data) {
        var addResponse, message;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                _context6.next = 3;
                return _messageDAO["default"].addMessage({
                  chatId: data.chatId,
                  type: "user",
                  sender: data.sender,
                  timestamp: data.timestamp,
                  content: data.content
                });

              case 3:
                addResponse = _context6.sent;

                if (addResponse.success) {
                  _context6.next = 6;
                  break;
                }

                throw new Error("Failed to add message to DB. ".concat(addResponse.error));

              case 6:
                _context6.next = 8;
                return _messageDAO["default"].getMessage(addResponse.id);

              case 8:
                message = _context6.sent;
                ChatInterface.io["in"](this.chatId).emit("chat", message);
                _context6.next = 15;
                break;

              case 12:
                _context6.prev = 12;
                _context6.t0 = _context6["catch"](0);
                console.error("Failed to store message and resend it back to chat room.");

              case 15:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 12]]);
      }));

      function receive(_x9) {
        return _receive.apply(this, arguments);
      }

      return receive;
    }()
  }]);
  return ChatInterface;
}();

exports["default"] = ChatInterface;
(0, _defineProperty2["default"])(ChatInterface, "io", void 0);