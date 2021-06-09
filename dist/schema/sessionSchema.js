"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createSessionSchema;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function createSessionSchema(_x) {
  return _createSessionSchema.apply(this, arguments);
}

function _createSessionSchema() {
  _createSessionSchema = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(conn) {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return conn.db("medicus").createCollection("sessions", {
              validator: {
                $jsonSchema: {
                  bsonType: "object",
                  title: "sessions",
                  additionalProperties: false,
                  properties: {
                    _id: {
                      bsonType: "objectId"
                    },
                    username: {
                      bsonType: "string",
                      description: "Username of current user."
                    },
                    authToken: {
                      bsonType: "string",
                      description: "Authentication token for current user."
                    }
                  },
                  required: ["username", "authToken"]
                }
              },
              validationLevel: "strict",
              validationAction: "error"
            });

          case 2:
            console.log("Sessions collection using schema was created.");

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _createSessionSchema.apply(this, arguments);
}