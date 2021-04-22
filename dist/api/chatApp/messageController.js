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

var _mongodb = require("mongodb");

var _errors = require("../errors");

var _userDAO = _interopRequireDefault(require("../../dao/userDAO"));

var _messageDAO = _interopRequireDefault(require("../../dao/messageDAO"));

var _models = require("../models");

var MessageController = /*#__PURE__*/function () {
  function MessageController() {
    (0, _classCallCheck2["default"])(this, MessageController);
  }

  (0, _createClass2["default"])(MessageController, null, [{
    key: "getMessages",
    value: function () {
      var _getMessages = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
        var chatId, page, limit, filter, result;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                chatId = req.params.chatId;
                page = req.query.page ? parseInt(req.query.page, 10) : 0;
                limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
                filter = {
                  chatId: (0, _mongodb.ObjectId)(chatId)
                };
                _context.next = 7;
                return _messageDAO["default"].getMessages({
                  filter: filter,
                  page: page,
                  limit: limit
                });

              case 7:
                result = _context.sent;
                res.json(result.map(function (item) {
                  var message = new _models.Message(item);
                  return message.toJson();
                }));
                _context.next = 15;
                break;

              case 11:
                _context.prev = 11;
                _context.t0 = _context["catch"](0);
                console.error("Failed to get messages: ".concat(_context.t0));
                res.status(500).json({
                  message: _context.t0.message
                });

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 11]]);
      }));

      function getMessages(_x, _x2, _x3) {
        return _getMessages.apply(this, arguments);
      }

      return getMessages;
    }()
  }, {
    key: "getMessage",
    value: function () {
      var _getMessage = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
        var id, response;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                id = req.params.id;
                _context2.next = 4;
                return _messageDAO["default"].getMessage(id);

              case 4:
                response = _context2.sent;

                if (response && Object.keys(response).length === 0) {
                  res.json({});
                }

                res.json(new _models.Message(response).toJson());
                _context2.next = 13;
                break;

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2["catch"](0);
                console.error("Failed to get message: ".concat(_context2.t0));
                res.status(500).json({
                  message: _context2.t0.message
                });

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 9]]);
      }));

      function getMessage(_x4, _x5, _x6) {
        return _getMessage.apply(this, arguments);
      }

      return getMessage;
    }()
  }, {
    key: "addMessage",
    value: function () {
      var _addMessage = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
        var messageInfo, chatId, response;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                messageInfo = req.body;

                if (!(!messageInfo || messageInfo && !Object.keys(messageInfo).length)) {
                  _context3.next = 4;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 4:
                chatId = req.params.chatId;

                if (chatId) {
                  _context3.next = 7;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 7:
                _context3.next = 9;
                return _messageDAO["default"].addMessage({
                  chatId: (0, _mongodb.ObjectId)(chatId),
                  type: "user",
                  sender: messageInfo.sender,
                  timestamp: messageInfo.timestamp,
                  content: messageInfo.content
                });

              case 9:
                response = _context3.sent;

                if (response.success) {
                  _context3.next = 12;
                  break;
                }

                throw new _errors.HttpInternalServerError(response.error);

              case 12:
                res.json({
                  success: true,
                  id: response.id
                });
                _context3.next = 19;
                break;

              case 15:
                _context3.prev = 15;
                _context3.t0 = _context3["catch"](0);
                console.error("Failed to add a new message. ".concat(_context3.t0));
                res.status(_context3.t0.statusCode).json({
                  message: _context3.t0.message
                });

              case 19:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 15]]);
      }));

      function addMessage(_x7, _x8, _x9) {
        return _addMessage.apply(this, arguments);
      }

      return addMessage;
    }()
  }, {
    key: "deleteMessages",
    value: function () {
      var _deleteMessages = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
        var chatId, response;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                chatId = req.params.chatId;

                if (chatId) {
                  _context4.next = 4;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 4:
                _context4.next = 6;
                return _messageDAO["default"].deleteMessages(chatId);

              case 6:
                response = _context4.sent;

                if (response.success) {
                  _context4.next = 9;
                  break;
                }

                throw new _errors.HttpInternalServerError(response.error);

              case 9:
                res.json({
                  success: true
                });
                _context4.next = 16;
                break;

              case 12:
                _context4.prev = 12;
                _context4.t0 = _context4["catch"](0);
                console.error("Failed to delete all messages in chat. ".concat(_context4.t0));
                res.status(_context4.t0.statusCode).json({
                  message: _context4.t0.message
                });

              case 16:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 12]]);
      }));

      function deleteMessages(_x10, _x11, _x12) {
        return _deleteMessages.apply(this, arguments);
      }

      return deleteMessages;
    }()
  }, {
    key: "deleteMessage",
    value: function () {
      var _deleteMessage = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
        var id, response;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                id = req.params.id;

                if (id) {
                  _context5.next = 4;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 4:
                _context5.next = 6;
                return _messageDAO["default"].deleteMessage(id);

              case 6:
                response = _context5.sent;

                if (response.success) {
                  _context5.next = 9;
                  break;
                }

                throw new _errors.HttpInternalServerError(response.error);

              case 9:
                res.json({
                  success: true
                });
                _context5.next = 16;
                break;

              case 12:
                _context5.prev = 12;
                _context5.t0 = _context5["catch"](0);
                console.error("Failed to delete message. ".concat(_context5.t0));
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

      function deleteMessage(_x13, _x14, _x15) {
        return _deleteMessage.apply(this, arguments);
      }

      return deleteMessage;
    }()
  }]);
  return MessageController;
}();

exports["default"] = MessageController;