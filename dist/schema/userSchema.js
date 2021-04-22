"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = createUserSchema;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function createUserSchema(_x) {
  return _createUserSchema.apply(this, arguments);
}

function _createUserSchema() {
  _createUserSchema = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(conn) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return conn.db("medicus").createCollection("users", {
              validator: {
                $jsonSchema: {
                  bsonType: "object",
                  title: "users",
                  additionalProperties: false,
                  properties: {
                    _id: {
                      bsonType: "objectId"
                    },
                    username: {
                      bsonType: ["string"],
                      minLength: 1,
                      description: "username of user for sign in. must be unique"
                    },
                    password: {
                      bsonType: ["string"],
                      minLength: 1,
                      description: "password of user for sign in."
                    },
                    firstName: {
                      bsonType: ["string"],
                      minLength: 1,
                      description: "First name of the user."
                    },
                    lastName: {
                      bsonType: ["string"],
                      minLength: 1,
                      description: "Last name of the user."
                    },
                    dob: {
                      bsonType: ["date"],
                      description: "Date of Birth."
                    },
                    gender: {
                      "enum": ["Male", "Female", "Other"],
                      description: "Gender of user."
                    },
                    emailId: {
                      bsonType: ["string"],
                      description: "Email ID of user."
                    },
                    phoneNumber: {
                      bsonType: ["string"],
                      description: "Phone Number of user."
                    },
                    isPhysician: {
                      bsonType: ["boolean"],
                      description: "Is user a physician?"
                    },
                    qualification: {
                      bsonType: ["string"],
                      description: "Qualification if user is a physician."
                    },
                    specialization: {
                      bsonType: ["string"],
                      description: "Specialization if user is a physician."
                    }
                  },
                  required: ["username", "password", "firstName", "isPhysician"],
                  dependencies: {
                    qualification: ["isPhysician"],
                    specialization: ["isPhysician"]
                  }
                }
              },
              validationLevel: "strict",
              validationAction: "error"
            });

          case 2:
            console.log("Users collection using schema was created.");
            _context.next = 5;
            return conn.db(process.env.DB_URI).collection("users").createIndex({
              username: 1
            }, {
              unique: true
            });

          case 5:
            console.log("Added username Index to Users collection.");

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _createUserSchema.apply(this, arguments);
}