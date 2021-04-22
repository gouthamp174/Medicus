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

var LabReportDAO = /*#__PURE__*/function () {
  function LabReportDAO() {
    (0, _classCallCheck2["default"])(this, LabReportDAO);
  }

  (0, _createClass2["default"])(LabReportDAO, null, [{
    key: "injectDB",
    value: function () {
      var _injectDB = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(conn) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.labReports) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                _context.prev = 2;
                _context.next = 5;
                return conn.db(process.env.DB_NS).collection("lab_reports", {
                  writeConcern: {
                    w: "majority"
                  }
                });

              case 5:
                this.labReports = _context.sent;
                _context.next = 11;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](2);
                console.error("Failed to connect to DB in LabReportDAO: ".concat(_context.t0));

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
    key: "getLabReports",
    value: function () {
      var _getLabReports = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref) {
        var _ref$filter, filter, _ref$page, page, _ref$limit, limit, cursor;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _ref$filter = _ref.filter, filter = _ref$filter === void 0 ? {} : _ref$filter, _ref$page = _ref.page, page = _ref$page === void 0 ? 0 : _ref$page, _ref$limit = _ref.limit, limit = _ref$limit === void 0 ? 10 : _ref$limit;
                _context2.prev = 1;
                _context2.next = 4;
                return this.labReports.find(filter).skip(page * limit).limit(limit);

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

      function getLabReports(_x2) {
        return _getLabReports.apply(this, arguments);
      }

      return getLabReports;
    }()
  }, {
    key: "getLabReport",
    value: function () {
      var _getLabReport = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(id) {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.labReports.findOne({
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

      function getLabReport(_x3) {
        return _getLabReport.apply(this, arguments);
      }

      return getLabReport;
    }()
  }, {
    key: "addLabReport",
    value: function () {
      var _addLabReport = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_ref2) {
        var username, name, date, appointmentId, response;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                username = _ref2.username, name = _ref2.name, date = _ref2.date, appointmentId = _ref2.appointmentId;
                _context4.prev = 1;
                _context4.next = 4;
                return this.labReports.insertOne({
                  username: username,
                  name: name,
                  date: new Date(date),
                  appointmentId: (0, _mongodb.ObjectId)(appointmentId)
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
                console.error("Failed to add a new lab report to DB. ".concat(_context4.t0));
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

      function addLabReport(_x4) {
        return _addLabReport.apply(this, arguments);
      }

      return addLabReport;
    }()
  }, {
    key: "deleteLabReports",
    value: function () {
      var _deleteLabReports = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(filter) {
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
                return this.labReports.deleteMany(filter, {
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
                console.error("Failed to delete lab reports from DB. ".concat(_context5.t0));
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

      function deleteLabReports(_x5) {
        return _deleteLabReports.apply(this, arguments);
      }

      return deleteLabReports;
    }()
  }, {
    key: "deleteLabReport",
    value: function () {
      var _deleteLabReport = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(id) {
        var response;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                _context6.next = 3;
                return this.labReports.deleteOne({
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
                console.error("Failed to delete lab report from DB. ".concat(_context6.t0));
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

      function deleteLabReport(_x6) {
        return _deleteLabReport.apply(this, arguments);
      }

      return deleteLabReport;
    }()
  }]);
  return LabReportDAO;
}();

exports["default"] = LabReportDAO;
(0, _defineProperty2["default"])(LabReportDAO, "labReports", void 0);