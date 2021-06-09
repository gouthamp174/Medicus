"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createMessageSchema;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function createMessageSchema(_x) {
  return _createMessageSchema.apply(this, arguments);
}

function _createMessageSchema() {
  _createMessageSchema = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(conn) {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return conn.db("medicus").createCollection("messages", {
              validator: {
                $jsonSchema: {
                  bsonType: "object",
                  title: "messages",
                  additionalProperties: false,
                  properties: {
                    _id: {
                      bsonType: "objectId"
                    },
                    chatId: {
                      bsonType: "objectId",
                      description: "Associated Chat Id of message."
                    },
                    type: {
                      enum: ["user", "system", "info"],
                      description: "Type of message."
                    },
                    sender: {
                      bsonType: ["string"],
                      minLength: 1,
                      description: "Username of sender of message."
                    },
                    timestamp: {
                      bsonType: ["date"],
                      description: "Sent time of message."
                    },
                    content: {
                      bsonType: ["string"],
                      minLength: 1,
                      description: "Content of message."
                    }
                  }
                }
              },
              validationLevel: "strict",
              validationAction: "error"
            });

          case 2:
            console.log("Messages collection using schema was created.");

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _createMessageSchema.apply(this, arguments);
}