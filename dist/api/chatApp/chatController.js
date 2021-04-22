"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ChatApi = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _mongodb = require("mongodb");

var _errors = require("../errors");

var _userDAO = _interopRequireDefault(require("../../dao/userDAO"));

var _chatDAO = _interopRequireDefault(require("../../dao/chatDAO"));

var _messageDAO = _interopRequireDefault(require("../../dao/messageDAO"));

var _models = require("../models");

// This class defines all APIs that are not directly called by Chat router.
// It is done to factor out shared code that can be called by multiple router APIs.
var ChatApi = /*#__PURE__*/function () {
  function ChatApi() {
    (0, _classCallCheck2["default"])(this, ChatApi);
  }

  (0, _createClass2["default"])(ChatApi, null, [{
    key: "deleteChat",
    value: function () {
      var _deleteChat = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(chatId) {
        var messageResponse, chatResponse;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _messageDAO["default"].deleteMessages({
                  chatId: chatId
                });

              case 3:
                messageResponse = _context.sent;

                if (messageResponse.success) {
                  _context.next = 6;
                  break;
                }

                throw new _errors.HttpInternalServerError(messageResponse.error);

              case 6:
                _context.next = 8;
                return _chatDAO["default"].deleteChat(chatId);

              case 8:
                chatResponse = _context.sent;

                if (chatResponse.success) {
                  _context.next = 11;
                  break;
                }

                throw new _errors.HttpInternalServerError(chatResponse.error);

              case 11:
                _context.next = 16;
                break;

              case 13:
                _context.prev = 13;
                _context.t0 = _context["catch"](0);
                throw _context.t0;

              case 16:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 13]]);
      }));

      function deleteChat(_x) {
        return _deleteChat.apply(this, arguments);
      }

      return deleteChat;
    }()
  }]);
  return ChatApi;
}(); // This class defines all middleware APIs that are directly called by Chat router.


exports.ChatApi = ChatApi;

var ChatController = /*#__PURE__*/function () {
  function ChatController() {
    (0, _classCallCheck2["default"])(this, ChatController);
  }

  (0, _createClass2["default"])(ChatController, null, [{
    key: "getChats",
    value: function () {
      var _getChats = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
        var view, page, limit, result;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                view = req.query.view ? req.query.view : "";
                page = req.query.page ? parseInt(req.query.page, 10) : 0;
                limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
                _context2.next = 6;
                return _chatDAO["default"].getChats({
                  filter: {},
                  page: page,
                  limit: limit
                });

              case 6:
                result = _context2.sent;
                res.json(result.map(function (item) {
                  var chat = new _models.Chat(item);
                  return chat.toJson();
                }));
                _context2.next = 14;
                break;

              case 10:
                _context2.prev = 10;
                _context2.t0 = _context2["catch"](0);
                console.error("Failed to get chats: ".concat(_context2.t0));
                res.status(500).json({
                  message: _context2.t0.message
                });

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 10]]);
      }));

      function getChats(_x2, _x3, _x4) {
        return _getChats.apply(this, arguments);
      }

      return getChats;
    }()
  }, {
    key: "getChat",
    value: function () {
      var _getChat = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
        var chatId, result;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                chatId = req.params.id;
                _context3.next = 4;
                return _chatDAO["default"].getChat(chatId);

              case 4:
                result = _context3.sent;

                if (result && Object.keys(result).length === 0) {
                  res.json({});
                }

                res.json(new _models.Chat(result).toJson());
                _context3.next = 13;
                break;

              case 9:
                _context3.prev = 9;
                _context3.t0 = _context3["catch"](0);
                console.error("Failed to get chat: ".concat(_context3.t0));
                res.status(500).json({
                  message: _context3.t0.message
                });

              case 13:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 9]]);
      }));

      function getChat(_x5, _x6, _x7) {
        return _getChat.apply(this, arguments);
      }

      return getChat;
    }()
  }, {
    key: "addChat",
    value: function () {
      var _addChat = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
        var chatInfo, hostUsername, user, response;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                chatInfo = req.body;

                if (!(!chatInfo || chatInfo && !Object.keys(chatInfo).length)) {
                  _context4.next = 4;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 4:
                hostUsername = chatInfo.host;
                _context4.next = 7;
                return _userDAO["default"].getUser(hostUsername);

              case 7:
                user = _context4.sent;

                if (!(!user || user && !Object.keys(user).length)) {
                  _context4.next = 10;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 10:
                _context4.next = 12;
                return _chatDAO["default"].addChat({
                  title: chatInfo.title,
                  host: new _models.User(user).toShortJson(),
                  members: chatInfo.members,
                  activeMembers: [],
                  startTime: new Date(),
                  appointmentId: null
                });

              case 12:
                response = _context4.sent;

                if (response.success) {
                  _context4.next = 15;
                  break;
                }

                throw new _errors.HttpInternalServerError(response.error);

              case 15:
                res.json({
                  success: true,
                  id: response.id
                });
                _context4.next = 22;
                break;

              case 18:
                _context4.prev = 18;
                _context4.t0 = _context4["catch"](0);
                console.error("Failed to add a new chat. ".concat(_context4.t0));
                res.status(_context4.t0.statusCode).json({
                  message: _context4.t0.message
                });

              case 22:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 18]]);
      }));

      function addChat(_x8, _x9, _x10) {
        return _addChat.apply(this, arguments);
      }

      return addChat;
    }()
  }, {
    key: "deleteChat",
    value: function () {
      var _deleteChat2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
        var chatId, chat;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                chatId = req.params.id;
                _context5.next = 4;
                return _chatDAO["default"].getChat(chatId);

              case 4:
                chat = _context5.sent;

                if (!(!chat || chat && !Object.keys(chat).length)) {
                  _context5.next = 7;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 7:
                _context5.next = 9;
                return ChatApi.deleteChat(chatId);

              case 9:
                res.json({
                  success: true
                });
                _context5.next = 16;
                break;

              case 12:
                _context5.prev = 12;
                _context5.t0 = _context5["catch"](0);
                console.error("Failed to delete chat. ".concat(_context5.t0));
                res.status(_context5.t0.statusCode).json({
                  message: _context5.t0.message
                });

              case 16:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[0, 12]]);
      }));

      function deleteChat(_x11, _x12, _x13) {
        return _deleteChat2.apply(this, arguments);
      }

      return deleteChat;
    }()
  }, {
    key: "addActiveMember",
    value: function () {
      var _addActiveMember = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
        var addInfo, chatId, chat, response;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                addInfo = req.body;

                if (!(!addInfo || addInfo && !Object.keys(addInfo).length)) {
                  _context6.next = 4;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 4:
                chatId = req.params.chatId;
                _context6.next = 7;
                return _chatDAO["default"].getChat(chatId);

              case 7:
                chat = _context6.sent;

                if (!(!chat || chat && !Object.keys(chat).length)) {
                  _context6.next = 10;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 10:
                if (chat.members.includes(addInfo.username)) {
                  _context6.next = 12;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 12:
                _context6.next = 14;
                return _chatDAO["default"].addActiveMember({
                  chatId: chatId,
                  username: addInfo.username
                });

              case 14:
                response = _context6.sent;

                if (response.success) {
                  _context6.next = 17;
                  break;
                }

                throw new _errors.HttpInternalServerError(response.error);

              case 17:
                res.json({
                  success: true
                });
                _context6.next = 24;
                break;

              case 20:
                _context6.prev = 20;
                _context6.t0 = _context6["catch"](0);
                console.error("Failed to add a new active member. ".concat(_context6.t0));
                res.status(_context6.t0.statusCode).json({
                  message: _context6.t0.message
                });

              case 24:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[0, 20]]);
      }));

      function addActiveMember(_x14, _x15, _x16) {
        return _addActiveMember.apply(this, arguments);
      }

      return addActiveMember;
    }()
  }, {
    key: "deleteActiveMember",
    value: function () {
      var _deleteActiveMember = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
        var chatId, username, chat, response;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                chatId = req.params.chatId;
                username = req.params.username;
                _context7.next = 5;
                return _chatDAO["default"].getChat(chatId);

              case 5:
                chat = _context7.sent;

                if (!(!chat || chat && !Object.keys(chat).length)) {
                  _context7.next = 8;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 8:
                if (chat.members.includes(username)) {
                  _context7.next = 10;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 10:
                _context7.next = 12;
                return _chatDAO["default"].deleteActiveMember({
                  chatId: chatId,
                  username: username
                });

              case 12:
                response = _context7.sent;

                if (response.success) {
                  _context7.next = 15;
                  break;
                }

                throw new _errors.HttpInternalServerError(response.error);

              case 15:
                res.json({
                  success: true
                });
                _context7.next = 22;
                break;

              case 18:
                _context7.prev = 18;
                _context7.t0 = _context7["catch"](0);
                console.error("Failed to delete active member. ".concat(_context7.t0));
                res.status(_context7.t0.statusCode).json({
                  message: _context7.t0.message
                });

              case 22:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[0, 18]]);
      }));

      function deleteActiveMember(_x17, _x18, _x19) {
        return _deleteActiveMember.apply(this, arguments);
      }

      return deleteActiveMember;
    }()
  }]);
  return ChatController;
}();

exports["default"] = ChatController;