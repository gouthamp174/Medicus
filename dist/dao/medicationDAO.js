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

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _mongodb = require("mongodb");

var MedicationDAO = /*#__PURE__*/function () {
  function MedicationDAO() {
    (0, _classCallCheck2["default"])(this, MedicationDAO);
  }

  (0, _createClass2["default"])(MedicationDAO, null, [{
    key: "injectDB",
    value: function () {
      var _injectDB = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(conn) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.medications) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                _context.prev = 2;
                _context.next = 5;
                return conn.db(process.env.DB_NS).collection("medications", {
                  writeConcern: {
                    w: "majority"
                  }
                });

              case 5:
                this.medications = _context.sent;
                _context.next = 11;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](2);
                console.error("Failed to connect to DB in MedicationDAO: ".concat(_context.t0));

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 8]]);
      }));

      function injectDB(_x) {
        return _injectDB.apply(this, arguments);
      }

      return injectDB;
    }()
  }, {
    key: "getMedications",
    value: function () {
      var _getMedications = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref) {
        var _ref$filter, filter, _ref$page, page, _ref$limit, limit, cursor;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _ref$filter = _ref.filter, filter = _ref$filter === void 0 ? {} : _ref$filter, _ref$page = _ref.page, page = _ref$page === void 0 ? 0 : _ref$page, _ref$limit = _ref.limit, limit = _ref$limit === void 0 ? 10 : _ref$limit;
                _context2.prev = 1;
                _context2.next = 4;
                return this.medications.find(filter).skip(page * limit).limit(limit);

              case 4:
                cursor = _context2.sent;
                _context2.next = 7;
                return cursor.toArray();

              case 7:
                return _context2.abrupt("return", _context2.sent);

              case 10:
                _context2.prev = 10;
                _context2.t0 = _context2["catch"](1);
                return _context2.abrupt("return", []);

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[1, 10]]);
      }));

      function getMedications(_x2) {
        return _getMedications.apply(this, arguments);
      }

      return getMedications;
    }()
  }, {
    key: "getMedication",
    value: function () {
      var _getMedication = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(id) {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.medications.findOne({
                  _id: (0, _mongodb.ObjectId)(id)
                });

              case 2:
                return _context3.abrupt("return", _context3.sent);

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getMedication(_x3) {
        return _getMedication.apply(this, arguments);
      }

      return getMedication;
    }()
  }, {
    key: "addMedication",
    value: function () {
      var _addMedication = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_ref2) {
        var username, name, dosage, appointmentId, response;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                username = _ref2.username, name = _ref2.name, dosage = _ref2.dosage, appointmentId = _ref2.appointmentId;
                _context4.prev = 1;
                _context4.next = 4;
                return this.medications.insertOne({
                  username: username,
                  name: name,
                  dosage: dosage,
                  appointmentId: appointmentId
                }, {
                  writeConcern: {
                    w: "majority"
                  }
                });

              case 4:
                response = _context4.sent;
                return _context4.abrupt("return", {
                  success: true,
                  id: response.insertedId
                });

              case 8:
                _context4.prev = 8;
                _context4.t0 = _context4["catch"](1);
                console.error("Failed to add a new medication to DB. ".concat(_context4.t0));
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

      function addMedication(_x4) {
        return _addMedication.apply(this, arguments);
      }

      return addMedication;
    }()
  }, {
    key: "deleteMedications",
    value: function () {
      var _deleteMedications = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(filter) {
        return _regenerator["default"].wrap(function _callee5$(_context5) {
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
                return this.medications.deleteMany(filter, {
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
                console.error("Failed to delete medications from DB. ".concat(_context5.t0));
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

      function deleteMedications(_x5) {
        return _deleteMedications.apply(this, arguments);
      }

      return deleteMedications;
    }()
  }, {
    key: "deleteMedication",
    value: function () {
      var _deleteMedication = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(id) {
        var response;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                _context6.next = 3;
                return this.medications.deleteOne({
                  _id: (0, _mongodb.ObjectId)(id)
                });

              case 3:
                response = _context6.sent;
                return _context6.abrupt("return", {
                  success: true
                });

              case 7:
                _context6.prev = 7;
                _context6.t0 = _context6["catch"](0);
                console.error("Failed to delete medication from DB. ".concat(_context6.t0));
                return _context6.abrupt("return", {
                  error: _context6.t0
                });

              case 11:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 7]]);
      }));

      function deleteMedication(_x6) {
        return _deleteMedication.apply(this, arguments);
      }

      return deleteMedication;
    }()
  }]);
  return MedicationDAO;
}();

exports["default"] = MedicationDAO;
(0, _defineProperty2["default"])(MedicationDAO, "medications", void 0);