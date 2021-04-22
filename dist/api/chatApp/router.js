"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _chatController = _interopRequireDefault(require("./chatController"));

var _messageController = _interopRequireDefault(require("./messageController"));

var router = new _express.Router();
router.route('/').get(_chatController["default"].getChats).post(_chatController["default"].addChat);
router.route('/:id').get(_chatController["default"].getChat)["delete"](_chatController["default"].deleteChat);
router.route('/:chatId/activeMembers').post(_chatController["default"].addActiveMember);
router.route('/:chatId/activeMembers/:username')["delete"](_chatController["default"].deleteActiveMember);
router.route('/:chatId/messages').get(_messageController["default"].getMessages).post(_messageController["default"].addMessage);
router.route('/:chatId/messages/:id').get(_messageController["default"].getMessage)["delete"](_messageController["default"].deleteMessage);
var _default = router;
exports["default"] = _default;