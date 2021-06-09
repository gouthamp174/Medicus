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

var ChatDAO = /*#__PURE__*/function () {
  function ChatDAO() {
    (0, _classCallCheck2.default)(this, ChatDAO);
  }

  (0, _createClass2.default)(ChatDAO, null, [{
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
                console.error("Failed to connect to DB in ChatDAO: ".concat(_context.t0));

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
    key: "getChats",
    value: function () {
      var _getChats = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
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
                return this.chats.find(filter).sort({
                  "startTime": -1
                }).skip(page * limit).limit(limit);

              case 4:
                cursor = _context2.sent;
                return _context2.abrupt("return", cursor.toArray());

              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2["catch"](1);
                console.error("Failed to retrieve chats from DB. ".concat(_context2.t0));
                return _context2.abrupt("return", []);

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[1, 8]]);
      }));

      function getChats() {
        return _getChats.apply(this, arguments);
      }

      return getChats;
    }()
  }, {
    key: "getChat",
    value: function () {
      var _getChat = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(id) {
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return this.chats.findOne({
                  _id: (0, _mongodb.ObjectId)(id)
                });

              case 3:
                return _context3.abrupt("return", _context3.sent);

              case 6:
                _context3.prev = 6;
                _context3.t0 = _context3["catch"](0);
                console.error("Failed to retrieve chat from DB: ".concat(_context3.t0));
                return _context3.abrupt("return", {});

              case 10:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 6]]);
      }));

      function getChat(_x2) {
        return _getChat.apply(this, arguments);
      }

      return getChat;
    }()
  }, {
    key: "addChat",
    value: function () {
      var _addChat = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(_ref2) {
        var title, host, members, activeMembers, startTime, _ref2$appointmentId, appointmentId, result;

        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                title = _ref2.title, host = _ref2.host, members = _ref2.members, activeMembers = _ref2.activeMembers, startTime = _ref2.startTime, _ref2$appointmentId = _ref2.appointmentId, appointmentId = _ref2$appointmentId === void 0 ? null : _ref2$appointmentId;
                _context4.prev = 1;

                if (host.username) {
                  members.push(host.username);
                }

                _context4.next = 5;
                return this.chats.insertOne({
                  title: title,
                  host: host,
                  members: members,
                  activeMembers: activeMembers ? activeMembers : [],
                  startTime: new Date(startTime),
                  appointmentId: appointmentId ? (0, _mongodb.ObjectId)(appointmentId) : null
                }, {
                  writeConcern: {
                    w: "majority"
                  }
                });

              case 5:
                result = _context4.sent;
                return _context4.abrupt("return", {
                  success: true,
                  id: result.insertedId
                });

              case 9:
                _context4.prev = 9;
                _context4.t0 = _context4["catch"](1);
                console.error("Failed to add new chat to DB. ".concat(_context4.t0));
                return _context4.abrupt("return", {
                  error: _context4.t0
                });

              case 13:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[1, 9]]);
      }));

      function addChat(_x3) {
        return _addChat.apply(this, arguments);
      }

      return addChat;
    }()
  }, {
    key: "deleteChat",
    value: function () {
      var _deleteChat = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5(id) {
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _context5.next = 3;
                return this.chats.deleteOne({
                  _id: (0, _mongodb.ObjectId)(id)
                });

              case 3:
                return _context5.abrupt("return", {
                  success: true
                });

              case 6:
                _context5.prev = 6;
                _context5.t0 = _context5["catch"](0);
                console.error("Failed to delete chat from DB. ".concat(_context5.t0));
                return _context5.abrupt("return", {
                  error: _context5.t0
                });

              case 10:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[0, 6]]);
      }));

      function deleteChat(_x4) {
        return _deleteChat.apply(this, arguments);
      }

      return deleteChat;
    }()
  }, {
    key: "addActiveMember",
    value: function () {
      var _addActiveMember = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6(_ref3) {
        var chatId, username, result;
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                chatId = _ref3.chatId, username = _ref3.username;
                _context6.prev = 1;
                _context6.next = 4;
                return this.chats.updateOne({
                  _id: (0, _mongodb.ObjectId)(chatId)
                }, {
                  $push: {
                    activeMembers: username
                  }
                });

              case 4:
                result = _context6.sent;
                return _context6.abrupt("return", {
                  success: true
                });

              case 8:
                _context6.prev = 8;
                _context6.t0 = _context6["catch"](1);
                console.error("Failed to add a new active member to DB. ".concat(_context6.t0));
                return _context6.abrupt("return", {
                  error: _context6.t0
                });

              case 12:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[1, 8]]);
      }));

      function addActiveMember(_x5) {
        return _addActiveMember.apply(this, arguments);
      }

      return addActiveMember;
    }()
  }, {
    key: "deleteActiveMember",
    value: function () {
      var _deleteActiveMember = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7(_ref4) {
        var chatId, username, result;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                chatId = _ref4.chatId, username = _ref4.username;
                _context7.prev = 1;
                _context7.next = 4;
                return this.chats.updateOne({
                  _id: (0, _mongodb.ObjectId)(chatId)
                }, {
                  $pull: {
                    activeMembers: username
                  }
                });

              case 4:
                result = _context7.sent;
                return _context7.abrupt("return", {
                  success: true
                });

              case 8:
                _context7.prev = 8;
                _context7.t0 = _context7["catch"](1);
                console.error("Failed to delete active member from DB. ".concat(_context7.t0));
                return _context7.abrupt("return", {
                  error: _context7.t0
                });

              case 12:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this, [[1, 8]]);
      }));

      function deleteActiveMember(_x6) {
        return _deleteActiveMember.apply(this, arguments);
      }

      return deleteActiveMember;
    }()
  }]);
  return ChatDAO;
}();

exports.default = ChatDAO;
(0, _defineProperty2.default)(ChatDAO, "chats", void 0);
(0, _defineProperty2.default)(ChatDAO, "messages", void 0);