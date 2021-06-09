"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createChatSchema;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function createChatSchema(_x) {
  return _createChatSchema.apply(this, arguments);
}

function _createChatSchema() {
  _createChatSchema = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(conn) {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return conn.db("medicus").createCollection("chats", {
              validator: {
                $jsonSchema: {
                  bsonType: "object",
                  title: "chats",
                  additionalProperties: false,
                  properties: {
                    _id: {
                      bsonType: "objectId"
                    },
                    title: {
                      bsonType: ["string"],
                      minLength: 1,
                      description: "Title of chat."
                    },
                    host: {
                      bsonType: ["string"],
                      minLength: 1,
                      description: "Username of host of chat."
                    },
                    startTime: {
                      bsonType: ["date"],
                      description: "Start time of chat."
                    },
                    members: {
                      bsonType: ["array"],
                      minLength: 1,
                      description: "List of usernames of members within chat."
                    },
                    activeMembers: {
                      bsonType: ["array"],
                      minLength: 1,
                      description: "List of usernames of members active within chat."
                    },
                    appointmentId: {
                      bsonType: ["objectId", null],
                      description: "Associated appointment Id for chat."
                    }
                  },
                  required: ["title", "members", "host", "startTime"]
                }
              },
              validationLevel: "strict",
              validationAction: "error"
            });

          case 2:
            console.log("Chats collection using schema was created.");

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _createChatSchema.apply(this, arguments);
}