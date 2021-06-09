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

var _chatDAO = _interopRequireDefault(require("./chatDAO"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var AppointmentDAO = /*#__PURE__*/function () {
  function AppointmentDAO() {
    (0, _classCallCheck2.default)(this, AppointmentDAO);
  }

  (0, _createClass2.default)(AppointmentDAO, null, [{
    key: "injectDB",
    value: function () {
      var _injectDB = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(conn) {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(this.users && this.appointments && this.chats)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                _context.prev = 2;
                _context.next = 5;
                return conn.db(process.env.DB_NS).collection("users", {
                  writeConcern: {
                    w: "majority"
                  }
                });

              case 5:
                this.users = _context.sent;
                _context.next = 8;
                return conn.db(process.env.DB_NS).collection("appointments", {
                  writeConcern: {
                    w: "majority"
                  }
                });

              case 8:
                this.appointments = _context.sent;
                _context.next = 11;
                return conn.db(process.env.DB_NS).collection("chats", {
                  writeConcern: {
                    w: "majority"
                  }
                });

              case 11:
                this.chats = _context.sent;
                _context.next = 17;
                break;

              case 14:
                _context.prev = 14;
                _context.t0 = _context["catch"](2);
                console.error("Failed to connect to DB in AppointmentDAO: ".concat(_context.t0));

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 14]]);
      }));

      function injectDB(_x) {
        return _injectDB.apply(this, arguments);
      }

      return injectDB;
    }()
  }, {
    key: "getAppointments",
    value: function () {
      var _getAppointments = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
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
                _ref = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {}, _ref$filter = _ref.filter, filter = _ref$filter === void 0 ? null : _ref$filter, _ref$page = _ref.page, page = _ref$page === void 0 ? 0 : _ref$page, _ref$limit = _ref.limit, limit = _ref$limit === void 0 ? 10 : _ref$limit;
                _context2.prev = 1;
                _context2.next = 4;
                return this.appointments.find(filter).sort({
                  "_id": -1
                }).skip(page * limit).limit(limit);

              case 4:
                cursor = _context2.sent;
                _context2.next = 7;
                return cursor.toArray();

              case 7:
                return _context2.abrupt("return", _context2.sent);

              case 10:
                _context2.prev = 10;
                _context2.t0 = _context2["catch"](1);
                console.error("Failed to retrieve appointments from DB. ".concat(_context2.t0));
                return _context2.abrupt("return", []);

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[1, 10]]);
      }));

      function getAppointments() {
        return _getAppointments.apply(this, arguments);
      }

      return getAppointments;
    }()
  }, {
    key: "searchAppointments",
    value: function () {
      var _searchAppointments = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var _ref2,
            _ref2$filter,
            filter,
            _ref2$searchQuery,
            searchQuery,
            _ref2$page,
            page,
            _ref2$limit,
            limit,
            cursor,
            _args3 = arguments;

        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _ref2 = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {}, _ref2$filter = _ref2.filter, filter = _ref2$filter === void 0 ? null : _ref2$filter, _ref2$searchQuery = _ref2.searchQuery, searchQuery = _ref2$searchQuery === void 0 ? null : _ref2$searchQuery, _ref2$page = _ref2.page, page = _ref2$page === void 0 ? 0 : _ref2$page, _ref2$limit = _ref2.limit, limit = _ref2$limit === void 0 ? 10 : _ref2$limit;
                _context3.prev = 1;
                _context3.next = 4;
                return this.appointments.aggregate([{
                  $match: filter
                }, {
                  $addFields: {
                    patientFullName: {
                      $concat: ["$patient.firstName", " ", "$patient.lastName"]
                    },
                    physicianFullName: {
                      $concat: ["$physician.firstName", " ", "$physician.lastName"]
                    }
                  }
                }]).match(searchQuery).project({
                  patientFullName: 0,
                  physicianFullName: 0
                }).sort({
                  "startTime": -1
                }).skip(page * limit).limit(limit);

              case 4:
                cursor = _context3.sent;
                _context3.next = 7;
                return cursor.toArray();

              case 7:
                return _context3.abrupt("return", _context3.sent);

              case 10:
                _context3.prev = 10;
                _context3.t0 = _context3["catch"](1);
                console.error("Failed to search and retrieve appointments from DB. ".concat(_context3.t0));
                return _context3.abrupt("return", []);

              case 14:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[1, 10]]);
      }));

      function searchAppointments() {
        return _searchAppointments.apply(this, arguments);
      }

      return searchAppointments;
    }()
  }, {
    key: "getAppointment",
    value: function () {
      var _getAppointment = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(id) {
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return this.appointments.findOne({
                  _id: (0, _mongodb.ObjectId)(id)
                });

              case 3:
                return _context4.abrupt("return", _context4.sent);

              case 6:
                _context4.prev = 6;
                _context4.t0 = _context4["catch"](0);
                console.error("Failed to retrieve appointment in DB: ".concat(_context4.t0));
                return _context4.abrupt("return", {});

              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 6]]);
      }));

      function getAppointment(_x2) {
        return _getAppointment.apply(this, arguments);
      }

      return getAppointment;
    }()
  }, {
    key: "addAppointment",
    value: function () {
      var _addAppointment = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5(_ref3) {
        var title, patient, physician, status, startTime, endTime, description, serviceName, serviceCharge, paymentBalance, response;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                title = _ref3.title, patient = _ref3.patient, physician = _ref3.physician, status = _ref3.status, startTime = _ref3.startTime, endTime = _ref3.endTime, description = _ref3.description, serviceName = _ref3.serviceName, serviceCharge = _ref3.serviceCharge, paymentBalance = _ref3.paymentBalance;
                _context5.prev = 1;
                _context5.next = 4;
                return this.appointments.insertOne({
                  title: title,
                  patient: patient,
                  physician: physician,
                  status: status,
                  startTime: new Date(startTime),
                  endTime: new Date(endTime),
                  description: description,
                  serviceName: serviceName,
                  serviceCharge: serviceCharge,
                  paymentBalance: paymentBalance
                }, {
                  writeConcern: {
                    w: "majority"
                  }
                });

              case 4:
                response = _context5.sent;
                return _context5.abrupt("return", {
                  success: true,
                  id: response.insertedId
                });

              case 8:
                _context5.prev = 8;
                _context5.t0 = _context5["catch"](1);
                console.error("Failed to add a new appointment to DB. ".concat(_context5.t0));
                return _context5.abrupt("return", {
                  error: _context5.t0
                });

              case 12:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[1, 8]]);
      }));

      function addAppointment(_x3) {
        return _addAppointment.apply(this, arguments);
      }

      return addAppointment;
    }()
  }, {
    key: "deleteAppointment",
    value: function () {
      var _deleteAppointment = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6(id) {
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                _context6.next = 3;
                return this.appointments.deleteOne({
                  _id: (0, _mongodb.ObjectId)(id)
                });

              case 3:
                return _context6.abrupt("return", {
                  success: true
                });

              case 6:
                _context6.prev = 6;
                _context6.t0 = _context6["catch"](0);
                console.error("Failed to delete appointment from DB. ".concat(_context6.t0));
                return _context6.abrupt("return", {
                  error: _context6.t0
                });

              case 10:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 6]]);
      }));

      function deleteAppointment(_x4) {
        return _deleteAppointment.apply(this, arguments);
      }

      return deleteAppointment;
    }()
  }, {
    key: "updateAppointment",
    value: function () {
      var _updateAppointment = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7(id, updateQuery) {
        var response;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                _context7.next = 3;
                return this.appointments.updateOne({
                  _id: (0, _mongodb.ObjectId)(id)
                }, {
                  $set: _objectSpread({}, updateQuery)
                });

              case 3:
                response = _context7.sent;

                if (!(response.matchedCount === 0)) {
                  _context7.next = 6;
                  break;
                }

                throw new Error("No appointment found with that ID.");

              case 6:
                return _context7.abrupt("return", {
                  success: true
                });

              case 9:
                _context7.prev = 9;
                _context7.t0 = _context7["catch"](0);
                console.error("Failed to update appointment in DB. ".concat(_context7.t0));
                return _context7.abrupt("return", {
                  error: _context7.t0
                });

              case 13:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this, [[0, 9]]);
      }));

      function updateAppointment(_x5, _x6) {
        return _updateAppointment.apply(this, arguments);
      }

      return updateAppointment;
    }()
  }]);
  return AppointmentDAO;
}();

exports.default = AppointmentDAO;
(0, _defineProperty2.default)(AppointmentDAO, "users", void 0);
(0, _defineProperty2.default)(AppointmentDAO, "appointments", void 0);
(0, _defineProperty2.default)(AppointmentDAO, "chats", void 0);