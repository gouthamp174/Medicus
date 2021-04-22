"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = createAppointmentSchema;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function createAppointmentSchema(_x) {
  return _createAppointmentSchema.apply(this, arguments);
}

function _createAppointmentSchema() {
  _createAppointmentSchema = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(conn) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return conn.db("medicus").createCollection("appointments", {
              validator: {
                $jsonSchema: {
                  bsonType: "object",
                  title: "appointments",
                  additionalProperties: false,
                  properties: {
                    _id: {
                      bsonType: "objectId"
                    },
                    title: {
                      bsonType: ["string"],
                      minLength: 1,
                      description: "Title of appointment."
                    },
                    patient: {
                      bsonType: ["object"],
                      description: "Username of patient."
                    },
                    physician: {
                      bsonType: ["object"],
                      minLength: 1,
                      description: "Username of physician."
                    },
                    status: {
                      "enum": ["Pending", "Accepted", "Rejected", "Completed"],
                      description: "Status of appointment."
                    },
                    startTime: {
                      bsonType: ["date"],
                      description: "Start time of appointment."
                    },
                    endTime: {
                      bsonType: ["date"],
                      description: "End Time of appointment."
                    },
                    description: {
                      bsonType: ["string"],
                      description: "Description of appointment."
                    },
                    chatId: {
                      bsonType: ["objectId", null],
                      description: "Associated Chat Id for the appointment."
                    }
                  },
                  required: ["title", "patient", "physician", "status", "startTime", "endTime", "description"]
                }
              },
              validationLevel: "strict",
              validationAction: "error"
            });

          case 2:
            console.log("Appointments collection using schema was created.");

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _createAppointmentSchema.apply(this, arguments);
}