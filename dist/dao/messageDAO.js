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

var MessageDAO = /*#__PURE__*/function () {
  function MessageDAO() {
    (0, _classCallCheck2.default)(this, MessageDAO);
  }

  (0, _createClass2.default)(MessageDAO, null, [{
    key: "injectDB",
    value: function () {
      var _injectDB = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(conn) {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(this.chats && this.messages)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                _context.prev = 2;
                _context.next = 5;
                return conn.db(process.env.DB_NS).collection("chats", {
                  writeConcern: {
                    w: "majority"
                  }
                });

              case 5:
                this.chats = _context.sent;
                _context.next = 8;
                return conn.db(process.env.DB_NS).collection("messages", {
                  writeConcern: {
                    w: "majority"
                  }
                });

              case 8:
                this.messages = _context.sent;
                _context.next = 14;
                break;

              case 11:
                _context.prev = 11;
                _context.t0 = _context["catch"](2);
                console.error("Failed to connect to DB in MessageDAO: ".concat(_context.t0));

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 11]]);
      }));

      function injectDB(_x) {
        return _injectDB.apply(this, arguments);
      }

      return injectDB;
    }()
  }, {
    key: "getMessages",
    value: function () {
      var _getMessages = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var _ref,
            _ref$filter,
            filter,
            _ref$page,
            page,
            _ref$limit,
            limit,
            cursor,
            _args2 = arguments;

        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _ref = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {}, _ref$filter = _ref.filter, filter = _ref$filter === void 0 ? {} : _ref$filter, _ref$page = _ref.page, page = _ref$page === void 0 ? 0 : _ref$page, _ref$limit = _ref.limit, limit = _ref$limit === void 0 ? 10 : _ref$limit;
                _context2.prev = 1;
                _context2.next = 4;
                return this.messages.find(filter).sort({
                  "timestamp": -1
                }).skip(page * limit).limit(limit);

              case 4:
                cursor = _context2.sent;
                return _context2.abrupt("return", cursor.toArray());

              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2["catch"](1);
                console.error("Failed to retrieve chat messages from DB. ".concat(_context2.t0));
                return _context2.abrupt("return", []);

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[1, 8]]);
      }));

      function getMessages() {
        return _getMessages.apply(this, arguments);
      }

      return getMessages;
    }()
  }, {
    key: "getMessage",
    value: function () {
      var _getMessage = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(id) {
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return this.messages.findOne({
                  _id: (0, _mongodb.ObjectId)(id)
                });

              case 3:
                return _context3.abrupt("return", _context3.sent);

              case 6:
                _context3.prev = 6;
                _context3.t0 = _context3["catch"](0);
                console.error("Failed to retrieve chat message from DB: ".concat(_context3.t0));
                return _context3.abrupt("return", {});

              case 10:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 6]]);
      }));

      function getMessage(_x2) {
        return _getMessage.apply(this, arguments);
      }

      return getMessage;
    }()
  }, {
    key: "addMessage",
    value: function () {
      var _addMessage = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(_ref2) {
        var chatId, type, sender, timestamp, content, result;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                chatId = _ref2.chatId, type = _ref2.type, sender = _ref2.sender, timestamp = _ref2.timestamp, content = _ref2.content;
                _context4.prev = 1;
                _context4.next = 4;
                return this.messages.insertOne({
                  chatId: (0, _mongodb.ObjectId)(chatId),
                  type: type,
                  sender: sender,
                  timestamp: new Date(timestamp),
                  content: content
                }, {
                  writeConcern: {
                    w: "majority"
                  }
                });

              case 4:
                result = _context4.sent;
                return _context4.abrupt("return", {
                  success: true,
                  id: result.insertedId
                });

              case 8:
                _context4.prev = 8;
                _context4.t0 = _context4["catch"](1);
                console.error("Failed to add chat message to DB: ".concat(chatId, ". ").concat(_context4.t0));
                return _context4.abrupt("return", {
                  error: _context4.t0
                });

              case 12:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[1, 8]]);
      }));

      function addMessage(_x3) {
        return _addMessage.apply(this, arguments);
      }

      return addMessage;
    }()
  }, {
    key: "deleteMessages",
    value: function () {
      var _deleteMessages = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5(filter) {
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;

                if (!(!filter || filter && !Object.keys(filter).length)) {
                  _context5.next = 3;
                  break;
                }

                throw Error("No filter provided. Cannot delete all documents.");

              case 3:
                _context5.next = 5;
                return this.messages.deleteMany(filter, {
                  writeConcern: {
                    w: "majority"
                  }
                });

              case 5:
                return _context5.abrupt("return", {
                  success: true
                });

              case 8:
                _context5.prev = 8;
                _context5.t0 = _context5["catch"](0);
                console.error("Failed to delete chat messages from DB. ".concat(_context5.t0));
                return _context5.abrupt("return", {
                  error: _context5.t0
                });

              case 12:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[0, 8]]);
      }));

      function deleteMessages(_x4) {
        return _deleteMessages.apply(this, arguments);
      }

      return deleteMessages;
    }()
  }, {
    key: "deleteMessage",
    value: function () {
      var _deleteMessage = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6(id) {
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                _context6.next = 3;
                return this.messages.deleteOne({
                  _id: (0, _mongodb.ObjectId)(id)
                });

              case 3:
                return _context6.abrupt("return", {
                  success: true
                });

              case 6:
                _context6.prev = 6;
                _context6.t0 = _context6["catch"](0);
                console.error("Failed to delete chat message from DB. ".concat(_context6.t0));
                return _context6.abrupt("return", {
                  error: _context6.t0
                });

              case 10:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 6]]);
      }));

      function deleteMessage(_x5) {
        return _deleteMessage.apply(this, arguments);
      }

      return deleteMessage;
    }()
  }]);
  return MessageDAO;
}();

exports.default = MessageDAO;
(0, _defineProperty2.default)(MessageDAO, "chats", void 0);
(0, _defineProperty2.default)(MessageDAO, "messages", void 0);