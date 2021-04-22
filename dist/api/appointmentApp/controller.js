"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.AppointmentApi = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _mongodb = require("mongodb");

var _errors = require("../errors");

var _models = require("../models");

var _userDAO = _interopRequireDefault(require("../../dao/userDAO"));

var _appointmentDAO = _interopRequireDefault(require("../../dao/appointmentDAO"));

var _serviceDAO = _interopRequireDefault(require("../../dao/serviceDAO"));

var _chatDAO = _interopRequireDefault(require("../../dao/chatDAO"));

var _noteDAO = _interopRequireDefault(require("../../dao/noteDAO"));

var _paymentDAO = _interopRequireDefault(require("../../dao/paymentDAO"));

var _medicationDAO = _interopRequireDefault(require("../../dao/medicationDAO"));

var _labReportDAO = _interopRequireDefault(require("../../dao/labReportDAO"));

var _chatController = require("../chatApp/chatController");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// This class defines all APIs that are not directly called by Appointment router.
// It is done to factor out shared code that can be called by multiple router APIs.
var AppointmentApi = /*#__PURE__*/function () {
  function AppointmentApi() {
    (0, _classCallCheck2["default"])(this, AppointmentApi);
  }

  (0, _createClass2["default"])(AppointmentApi, null, [{
    key: "deleteAppointments",
    value: function () {
      var _deleteAppointments = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(filter) {
        var appointments, _iterator, _step, appointment;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _appointmentDAO["default"].getAppointments({
                  filter: filter,
                  page: 0,
                  limit: 0
                });

              case 3:
                appointments = _context.sent;
                _iterator = _createForOfIteratorHelper(appointments);
                _context.prev = 5;

                _iterator.s();

              case 7:
                if ((_step = _iterator.n()).done) {
                  _context.next = 13;
                  break;
                }

                appointment = _step.value;
                _context.next = 11;
                return AppointmentApi.deleteAppointment(appointment._id, appointment.chatId);

              case 11:
                _context.next = 7;
                break;

              case 13:
                _context.next = 18;
                break;

              case 15:
                _context.prev = 15;
                _context.t0 = _context["catch"](5);

                _iterator.e(_context.t0);

              case 18:
                _context.prev = 18;

                _iterator.f();

                return _context.finish(18);

              case 21:
                _context.next = 26;
                break;

              case 23:
                _context.prev = 23;
                _context.t1 = _context["catch"](0);
                throw _context.t1;

              case 26:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 23], [5, 15, 18, 21]]);
      }));

      function deleteAppointments(_x) {
        return _deleteAppointments.apply(this, arguments);
      }

      return deleteAppointments;
    }()
  }, {
    key: "deleteAppointment",
    value: function () {
      var _deleteAppointment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(appointmentId, chatId) {
        var chatResponse, noteResponse, medicationResponse, labReportResponse, appointmentResponse;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return _chatController.ChatApi.deleteChat(chatId);

              case 3:
                chatResponse = _context2.sent;
                _context2.next = 6;
                return _noteDAO["default"].deleteNotes({
                  appointmentId: (0, _mongodb.ObjectId)(appointmentId)
                });

              case 6:
                noteResponse = _context2.sent;

                if (noteResponse.success) {
                  _context2.next = 9;
                  break;
                }

                throw new _errors.HttpInternalServerError(noteResponse.error);

              case 9:
                _context2.next = 11;
                return _medicationDAO["default"].deleteMedications({
                  appointmentId: (0, _mongodb.ObjectId)(appointmentId)
                });

              case 11:
                medicationResponse = _context2.sent;

                if (medicationResponse.success) {
                  _context2.next = 14;
                  break;
                }

                throw new _errors.HttpInternalServerError(medicationResponse.error);

              case 14:
                _context2.next = 16;
                return _labReportDAO["default"].deleteLabReports({
                  appointmentId: (0, _mongodb.ObjectId)(appointmentId)
                });

              case 16:
                labReportResponse = _context2.sent;

                if (labReportResponse.success) {
                  _context2.next = 19;
                  break;
                }

                throw new _errors.HttpInternalServerError(labReportResponse.error);

              case 19:
                _context2.next = 21;
                return _appointmentDAO["default"].deleteAppointment(appointmentId);

              case 21:
                appointmentResponse = _context2.sent;

                if (appointmentResponse.success) {
                  _context2.next = 24;
                  break;
                }

                throw new _errors.HttpInternalServerError(appointmentResponse.error);

              case 24:
                _context2.next = 29;
                break;

              case 26:
                _context2.prev = 26;
                _context2.t0 = _context2["catch"](0);
                throw _context2.t0;

              case 29:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 26]]);
      }));

      function deleteAppointment(_x2, _x3) {
        return _deleteAppointment.apply(this, arguments);
      }

      return deleteAppointment;
    }()
  }]);
  return AppointmentApi;
}(); // This class defines all middleware APIs that are directly called by Appointment router.


exports.AppointmentApi = AppointmentApi;

var AppointmentController = /*#__PURE__*/function () {
  function AppointmentController() {
    (0, _classCallCheck2["default"])(this, AppointmentController);
  }

  (0, _createClass2["default"])(AppointmentController, null, [{
    key: "getAppointments",
    value: function () {
      var _getAppointments = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
        var session, search, view, page, limit, filter, currentTime, result, queryRegex, searchQuery;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                session = req.session;
                search = req.query.search ? req.query.search : "";
                view = req.query.view ? req.query.view : "";
                page = req.query.page ? parseInt(req.query.page, 10) : 0;
                limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;

                if (view === "waiting") {
                  currentTime = new Date();
                  filter = {
                    $and: [{
                      $or: [{
                        "patient.username": session.username
                      }, {
                        "physician.username": session.username
                      }]
                    }, {
                      startTime: {
                        $lte: currentTime
                      }
                    }, {
                      endTime: {
                        $gt: currentTime
                      }
                    }, {
                      status: {
                        $ne: "Completed"
                      }
                    }]
                  };
                } else if (view === "payments") {
                  filter = {
                    $and: [{
                      $or: [{
                        "patient.username": session.username
                      }, {
                        "physician.username": session.username
                      }]
                    }, {
                      status: "Completed"
                    }]
                  };
                } else {
                  filter = {
                    $or: [{
                      "patient.username": session.username
                    }, {
                      "physician.username": session.username
                    }]
                  };
                }

                if (!(search !== "")) {
                  _context3.next = 15;
                  break;
                }

                // If request has search query, search filtered appointments based on query.
                queryRegex = new RegExp(search, 'i');
                searchQuery = {
                  $or: [{
                    title: queryRegex
                  }, {
                    description: queryRegex
                  }, {
                    patientFullName: queryRegex
                  }, {
                    physicianFullName: queryRegex
                  }]
                };
                _context3.next = 12;
                return _appointmentDAO["default"].searchAppointments({
                  filter: filter,
                  searchQuery: searchQuery,
                  page: page,
                  limit: limit
                });

              case 12:
                result = _context3.sent;
                _context3.next = 18;
                break;

              case 15:
                _context3.next = 17;
                return _appointmentDAO["default"].getAppointments({
                  filter: filter,
                  page: page,
                  limit: limit
                });

              case 17:
                result = _context3.sent;

              case 18:
                res.json(result.map(function (item) {
                  var appointment = new _models.Appointment(item);
                  return appointment.toShortJson();
                }));
                _context3.next = 25;
                break;

              case 21:
                _context3.prev = 21;
                _context3.t0 = _context3["catch"](0);
                console.error("Failed to get appointments. ".concat(_context3.t0));
                res.status(500).json({
                  message: _context3.t0.message
                });

              case 25:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 21]]);
      }));

      function getAppointments(_x4, _x5, _x6) {
        return _getAppointments.apply(this, arguments);
      }

      return getAppointments;
    }()
  }, {
    key: "getAppointment",
    value: function () {
      var _getAppointment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
        var session, appointmentId, result;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                session = req.session;
                appointmentId = req.params.id;
                _context4.next = 5;
                return _appointmentDAO["default"].getAppointment(appointmentId);

              case 5:
                result = _context4.sent;

                if (result && Object.keys(result).length === 0) {
                  res.json({});
                }

                if (result.patient.username !== session.username && result.physician.username !== session.username) {
                  res.json({});
                }

                res.json(new _models.Appointment(result).toJson());
                _context4.next = 15;
                break;

              case 11:
                _context4.prev = 11;
                _context4.t0 = _context4["catch"](0);
                console.error("Failed to get appointment. ".concat(_context4.t0));
                res.status(500).json({
                  message: _context4.t0.message
                });

              case 15:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 11]]);
      }));

      function getAppointment(_x7, _x8, _x9) {
        return _getAppointment.apply(this, arguments);
      }

      return getAppointment;
    }()
  }, {
    key: "addAppointment",
    value: function () {
      var _addAppointment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
        var appointmentInfo, patientUser, physicianUser, service, appointmentResponse, chatResponse;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                appointmentInfo = req.body;

                if (appointmentInfo) {
                  _context5.next = 4;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 4:
                _context5.next = 6;
                return _userDAO["default"].getUser(appointmentInfo.patient);

              case 6:
                patientUser = _context5.sent;

                if (!(!patientUser || patientUser && !Object.keys(patientUser).length)) {
                  _context5.next = 9;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 9:
                _context5.next = 11;
                return _userDAO["default"].getUser(appointmentInfo.physician);

              case 11:
                physicianUser = _context5.sent;

                if (!(!physicianUser || physicianUser && !Object.keys(physicianUser).length)) {
                  _context5.next = 14;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 14:
                _context5.next = 16;
                return _serviceDAO["default"].getService(appointmentInfo.serviceId);

              case 16:
                service = _context5.sent;

                if (!(!service || service && !Object.keys(service).length)) {
                  _context5.next = 19;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 19:
                _context5.prev = 19;
                _context5.next = 22;
                return _appointmentDAO["default"].addAppointment({
                  title: appointmentInfo.title,
                  patient: new _models.User(patientUser).toShortJson(),
                  physician: new _models.User(physicianUser).toShortJson(),
                  status: "Pending",
                  startTime: appointmentInfo.startTime,
                  endTime: appointmentInfo.endTime,
                  description: appointmentInfo.description,
                  serviceName: service.name,
                  serviceCharge: service.rate,
                  paymentBalance: service.rate
                });

              case 22:
                appointmentResponse = _context5.sent;

                if (appointmentResponse.success) {
                  _context5.next = 25;
                  break;
                }

                throw appointmentResponse.error;

              case 25:
                _context5.next = 27;
                return _chatDAO["default"].addChat({
                  title: appointmentInfo.title,
                  host: new _models.User(patientUser).toShortJson(),
                  members: [appointmentInfo.physician],
                  activeMembers: [],
                  startTime: appointmentInfo.startTime,
                  appointmentId: appointmentResponse.id
                });

              case 27:
                chatResponse = _context5.sent;

                if (chatResponse.success) {
                  _context5.next = 30;
                  break;
                }

                throw chatResponse.error;

              case 30:
                _context5.next = 32;
                return _appointmentDAO["default"].updateAppointment(appointmentResponse.id, {
                  chatId: (0, _mongodb.ObjectId)(chatResponse.id)
                });

              case 32:
                res.status(201).json({
                  success: true,
                  id: appointmentResponse.id
                });
                _context5.next = 44;
                break;

              case 35:
                _context5.prev = 35;
                _context5.t0 = _context5["catch"](19);

                if (!appointmentResponse) {
                  _context5.next = 40;
                  break;
                }

                _context5.next = 40;
                return _appointmentDAO["default"].deleteAppointment(appointmentResponse.id);

              case 40:
                if (!(chatResponse && chatResponse.success)) {
                  _context5.next = 43;
                  break;
                }

                _context5.next = 43;
                return _chatDAO["default"].deleteChat(chatResponse.id);

              case 43:
                throw new _errors.HttpInternalServerError(_context5.t0);

              case 44:
                _context5.next = 50;
                break;

              case 46:
                _context5.prev = 46;
                _context5.t1 = _context5["catch"](0);
                console.error("Failed to add a new appointment. ".concat(_context5.t1));
                res.status(_context5.t1.statusCode).json({
                  message: _context5.t1.message
                });

              case 50:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[0, 46], [19, 35]]);
      }));

      function addAppointment(_x10, _x11, _x12) {
        return _addAppointment.apply(this, arguments);
      }

      return addAppointment;
    }()
  }, {
    key: "deleteAppointment",
    value: function () {
      var _deleteAppointment2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
        var appointmentId, appointment;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                appointmentId = req.params.id;
                _context6.next = 4;
                return _appointmentDAO["default"].getAppointment(appointmentId);

              case 4:
                appointment = _context6.sent;

                if (!(!appointment || appointment && !Object.keys(appointment).length)) {
                  _context6.next = 7;
                  break;
                }

                throw new _errors.HttpInternalServerError("Invalid request. Bad input parameters.");

              case 7:
                _context6.next = 9;
                return AppointmentApi.deleteAppointment(appointment._id, appointment.chatId);

              case 9:
                res.json({
                  success: true
                });
                _context6.next = 16;
                break;

              case 12:
                _context6.prev = 12;
                _context6.t0 = _context6["catch"](0);
                console.error("Failed to delete appointment. ".concat(_context6.t0));
                res.status(_context6.t0.statusCode).json({
                  message: _context6.t0.message
                });

              case 16:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[0, 12]]);
      }));

      function deleteAppointment(_x13, _x14, _x15) {
        return _deleteAppointment2.apply(this, arguments);
      }

      return deleteAppointment;
    }()
  }, {
    key: "updateAppointment",
    value: function () {
      var _updateAppointment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
        var appointmentId, updateInfo, notUpdatableFields, _i, _notUpdatableFields, field, result;

        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                appointmentId = req.params.id;
                updateInfo = req.body;

                if (!(!updateInfo || updateInfo && !Object.keys(updateInfo).length || (0, _typeof2["default"])(updateInfo) !== "object")) {
                  _context7.next = 5;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 5:
                notUpdatableFields = ["_id", "id", "title", "patient", "physician", "chatId"];
                _i = 0, _notUpdatableFields = notUpdatableFields;

              case 7:
                if (!(_i < _notUpdatableFields.length)) {
                  _context7.next = 14;
                  break;
                }

                field = _notUpdatableFields[_i];

                if (!updateInfo.hasOwnProperty(field)) {
                  _context7.next = 11;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Cannot update field: '".concat(field, "'."));

              case 11:
                _i++;
                _context7.next = 7;
                break;

              case 14:
                _context7.next = 16;
                return _appointmentDAO["default"].updateAppointment(appointmentId, updateInfo);

              case 16:
                result = _context7.sent;

                if (result.success) {
                  _context7.next = 19;
                  break;
                }

                throw new _errors.HttpInternalServerError(result.error);

              case 19:
                res.json({
                  success: true
                });
                _context7.next = 26;
                break;

              case 22:
                _context7.prev = 22;
                _context7.t0 = _context7["catch"](0);
                console.error("Failed to update appointment. ".concat(_context7.t0));
                res.status(_context7.t0.statusCode).json({
                  message: _context7.t0.message
                });

              case 26:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[0, 22]]);
      }));

      function updateAppointment(_x16, _x17, _x18) {
        return _updateAppointment.apply(this, arguments);
      }

      return updateAppointment;
    }()
  }, {
    key: "getNotes",
    value: function () {
      var _getNotes = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
        var appointmentId, page, limit, appointment, filter, notes;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.prev = 0;
                appointmentId = req.params.appointmentId;
                page = req.query.page ? parseInt(req.query.page, 10) : 0;
                limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
                _context8.next = 6;
                return _appointmentDAO["default"].getAppointment(appointmentId);

              case 6:
                appointment = _context8.sent;

                if (!(!appointment || appointment && !Object.keys(appointment).length)) {
                  _context8.next = 9;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 9:
                filter = {
                  appointmentId: (0, _mongodb.ObjectId)(appointment._id)
                };
                _context8.next = 12;
                return _noteDAO["default"].getNotes({
                  filter: filter,
                  page: page,
                  limit: limit
                });

              case 12:
                notes = _context8.sent;
                res.json(notes.map(function (item) {
                  var note = new _models.Note(item);
                  return note.toJson();
                }));
                _context8.next = 20;
                break;

              case 16:
                _context8.prev = 16;
                _context8.t0 = _context8["catch"](0);
                console.error("Failed to get notes. ".concat(_context8.t0));
                res.status(_context8.t0.statusCode).json({
                  message: _context8.t0.message
                });

              case 20:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, null, [[0, 16]]);
      }));

      function getNotes(_x19, _x20, _x21) {
        return _getNotes.apply(this, arguments);
      }

      return getNotes;
    }()
  }, {
    key: "addNote",
    value: function () {
      var _addNote = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
        var noteInfo, appointmentId, appointment, response;
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.prev = 0;
                noteInfo = req.body;
                appointmentId = req.params.appointmentId;
                _context9.next = 5;
                return _appointmentDAO["default"].getAppointment(appointmentId);

              case 5:
                appointment = _context9.sent;

                if (!(!appointment || appointment && !Object.keys(appointment).length)) {
                  _context9.next = 8;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 8:
                _context9.next = 10;
                return _noteDAO["default"].addNote({
                  appointmentId: (0, _mongodb.ObjectId)(appointment._id),
                  title: noteInfo.title,
                  content: noteInfo.content,
                  date: new Date(noteInfo.date)
                });

              case 10:
                response = _context9.sent;

                if (response.success) {
                  _context9.next = 13;
                  break;
                }

                throw new Error(response.error);

              case 13:
                res.status(201).json({
                  success: true,
                  id: response.id
                });
                _context9.next = 20;
                break;

              case 16:
                _context9.prev = 16;
                _context9.t0 = _context9["catch"](0);
                console.error("Failed to add a new note. ".concat(_context9.t0));
                res.status(_context9.t0.statusCode).json({
                  message: _context9.t0.message
                });

              case 20:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, null, [[0, 16]]);
      }));

      function addNote(_x22, _x23, _x24) {
        return _addNote.apply(this, arguments);
      }

      return addNote;
    }()
  }, {
    key: "deleteNote",
    value: function () {
      var _deleteNote = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
        var appointmentId, appointment, noteId, note, response;
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.prev = 0;
                appointmentId = req.params.appointmentId;
                _context10.next = 4;
                return _appointmentDAO["default"].getAppointment(appointmentId);

              case 4:
                appointment = _context10.sent;

                if (!(!appointment || appointment && !Object.keys(appointment).length)) {
                  _context10.next = 7;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 7:
                noteId = req.params.id;
                _context10.next = 10;
                return _noteDAO["default"].getNote(noteId);

              case 10:
                note = _context10.sent;

                if (!(!note || note && !Object.keys(note).length)) {
                  _context10.next = 13;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 13:
                _context10.next = 15;
                return _noteDAO["default"].deleteNote(noteId);

              case 15:
                response = _context10.sent;

                if (response.success) {
                  _context10.next = 18;
                  break;
                }

                throw new Error(response.error);

              case 18:
                res.json({
                  success: true
                });
                _context10.next = 25;
                break;

              case 21:
                _context10.prev = 21;
                _context10.t0 = _context10["catch"](0);
                console.error("Failed to delete note. ".concat(_context10.t0));
                res.status(_context10.t0.statusCode).json({
                  message: _context10.t0.message
                });

              case 25:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, null, [[0, 21]]);
      }));

      function deleteNote(_x25, _x26, _x27) {
        return _deleteNote.apply(this, arguments);
      }

      return deleteNote;
    }()
  }, {
    key: "getPayments",
    value: function () {
      var _getPayments = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
        var appointmentId, page, limit, appointment, filter, payments;
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.prev = 0;
                appointmentId = req.params.appointmentId;
                page = req.query.page ? parseInt(req.query.page, 10) : 0;
                limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
                _context11.next = 6;
                return _appointmentDAO["default"].getAppointment(appointmentId);

              case 6:
                appointment = _context11.sent;

                if (!(!appointment || appointment && !Object.keys(appointment).length)) {
                  _context11.next = 9;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 9:
                filter = {
                  appointmentId: (0, _mongodb.ObjectId)(appointment._id)
                };
                _context11.next = 12;
                return _paymentDAO["default"].getPayments({
                  filter: filter,
                  page: page,
                  limit: limit
                });

              case 12:
                payments = _context11.sent;
                res.json(payments.map(function (item) {
                  var payment = new _models.Payment(item);
                  return payment.toJson();
                }));
                _context11.next = 20;
                break;

              case 16:
                _context11.prev = 16;
                _context11.t0 = _context11["catch"](0);
                console.error("Failed to get payments. ".concat(_context11.t0));
                res.status(_context11.t0.statusCode).json({
                  message: _context11.t0.message
                });

              case 20:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, null, [[0, 16]]);
      }));

      function getPayments(_x28, _x29, _x30) {
        return _getPayments.apply(this, arguments);
      }

      return getPayments;
    }()
  }, {
    key: "addPayment",
    value: function () {
      var _addPayment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res, next) {
        var paymentInfo, appointmentId, appointment, amountAsNumber, addResponse, updateResponse;
        return _regenerator["default"].wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.prev = 0;
                paymentInfo = req.body;

                if (!(!paymentInfo || paymentInfo && !Object.keys(paymentInfo).length)) {
                  _context12.next = 4;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 4:
                appointmentId = req.params.appointmentId;
                _context12.next = 7;
                return _appointmentDAO["default"].getAppointment(appointmentId);

              case 7:
                appointment = _context12.sent;

                if (!(!appointment || appointment && !Object.keys(appointment).length)) {
                  _context12.next = 10;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 10:
                amountAsNumber = Number(paymentInfo.amount);

                if (!(amountAsNumber === NaN || amountAsNumber < 0)) {
                  _context12.next = 13;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 13:
                if (!(amountAsNumber > appointment.paymentBalance)) {
                  _context12.next = 15;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Payment amount cannot be greater than balance.");

              case 15:
                _context12.next = 17;
                return _paymentDAO["default"].addPayment({
                  username: paymentInfo.username,
                  amount: amountAsNumber,
                  date: new Date(paymentInfo.date),
                  appointmentId: (0, _mongodb.ObjectId)(appointment._id)
                });

              case 17:
                addResponse = _context12.sent;

                if (addResponse.success) {
                  _context12.next = 20;
                  break;
                }

                throw new Error(addResponse.error);

              case 20:
                _context12.next = 22;
                return _appointmentDAO["default"].updateAppointment(appointmentId, {
                  paymentBalance: appointment.paymentBalance - amountAsNumber
                });

              case 22:
                updateResponse = _context12.sent;

                if (updateResponse.success) {
                  _context12.next = 25;
                  break;
                }

                throw new Error(updateResponse.error);

              case 25:
                res.status(201).json({
                  success: true,
                  id: addResponse.id
                });
                _context12.next = 32;
                break;

              case 28:
                _context12.prev = 28;
                _context12.t0 = _context12["catch"](0);
                console.error("Failed to add a new payment. ".concat(_context12.t0));
                res.status(_context12.t0.statusCode).json({
                  message: _context12.t0.message
                });

              case 32:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, null, [[0, 28]]);
      }));

      function addPayment(_x31, _x32, _x33) {
        return _addPayment.apply(this, arguments);
      }

      return addPayment;
    }()
  }, {
    key: "deletePayment",
    value: function () {
      var _deletePayment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res, next) {
        var appointmentId, appointment, paymentId, payment, deleteResponse, updateResponse;
        return _regenerator["default"].wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.prev = 0;
                appointmentId = req.params.appointmentId;
                _context13.next = 4;
                return _appointmentDAO["default"].getAppointment(appointmentId);

              case 4:
                appointment = _context13.sent;

                if (!(!appointment || appointment && !Object.keys(appointment).length)) {
                  _context13.next = 7;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 7:
                paymentId = req.params.id;
                _context13.next = 10;
                return _paymentDAO["default"].getPayment(paymentId);

              case 10:
                payment = _context13.sent;

                if (!(!payment || payment && !Object.keys(payment).length)) {
                  _context13.next = 13;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 13:
                _context13.next = 15;
                return _paymentDAO["default"].deletePayment(paymentId);

              case 15:
                deleteResponse = _context13.sent;

                if (deleteResponse.success) {
                  _context13.next = 18;
                  break;
                }

                throw new Error(deleteResponse.error);

              case 18:
                if (!(deleteResponse.deletedCount > 0)) {
                  _context13.next = 24;
                  break;
                }

                _context13.next = 21;
                return _appointmentDAO["default"].updateAppointment(appointmentId, {
                  paymentBalance: appointment.paymentBalance + payment.amount
                });

              case 21:
                updateResponse = _context13.sent;

                if (updateResponse.success) {
                  _context13.next = 24;
                  break;
                }

                throw new Error(updateResponse.error);

              case 24:
                res.json({
                  success: true
                });
                _context13.next = 31;
                break;

              case 27:
                _context13.prev = 27;
                _context13.t0 = _context13["catch"](0);
                console.error("Failed to delete payment. ".concat(_context13.t0));
                res.status(_context13.t0.statusCode).json({
                  message: _context13.t0.message
                });

              case 31:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, null, [[0, 27]]);
      }));

      function deletePayment(_x34, _x35, _x36) {
        return _deletePayment.apply(this, arguments);
      }

      return deletePayment;
    }()
  }, {
    key: "getMedications",
    value: function () {
      var _getMedications = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(req, res, next) {
        var appointmentId, page, limit, appointment, filter, medications;
        return _regenerator["default"].wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.prev = 0;
                appointmentId = req.params.appointmentId;
                page = req.query.page ? parseInt(req.query.page, 10) : 0;
                limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
                _context14.next = 6;
                return _appointmentDAO["default"].getAppointment(appointmentId);

              case 6:
                appointment = _context14.sent;

                if (!(!appointment || appointment && !Object.keys(appointment).length)) {
                  _context14.next = 9;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 9:
                filter = {
                  appointmentId: (0, _mongodb.ObjectId)(appointment._id)
                };
                _context14.next = 12;
                return _medicationDAO["default"].getMedications({
                  filter: filter,
                  page: page,
                  limit: limit
                });

              case 12:
                medications = _context14.sent;
                res.json(medications.map(function (item) {
                  var medication = new _models.Medication(item);
                  return medication.toJson();
                }));
                _context14.next = 20;
                break;

              case 16:
                _context14.prev = 16;
                _context14.t0 = _context14["catch"](0);
                console.error("Failed to get medications. ".concat(_context14.t0));
                res.status(_context14.t0.statusCode).json({
                  message: _context14.t0.message
                });

              case 20:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, null, [[0, 16]]);
      }));

      function getMedications(_x37, _x38, _x39) {
        return _getMedications.apply(this, arguments);
      }

      return getMedications;
    }()
  }, {
    key: "addMedication",
    value: function () {
      var _addMedication = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(req, res, next) {
        var medicationInfo, appointmentId, appointment, response;
        return _regenerator["default"].wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.prev = 0;
                medicationInfo = req.body;

                if (!(!medicationInfo || medicationInfo && !Object.keys(medicationInfo).length)) {
                  _context15.next = 4;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 4:
                appointmentId = req.params.appointmentId;
                _context15.next = 7;
                return _appointmentDAO["default"].getAppointment(appointmentId);

              case 7:
                appointment = _context15.sent;

                if (!(!appointment || appointment && !Object.keys(appointment).length)) {
                  _context15.next = 10;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 10:
                _context15.next = 12;
                return _medicationDAO["default"].addMedication({
                  username: medicationInfo.username,
                  name: medicationInfo.name,
                  dosage: medicationInfo.dosage,
                  appointmentId: (0, _mongodb.ObjectId)(appointment._id)
                });

              case 12:
                response = _context15.sent;

                if (response.success) {
                  _context15.next = 15;
                  break;
                }

                throw new Error(response.error);

              case 15:
                res.status(201).json({
                  success: true,
                  id: response.id
                });
                _context15.next = 22;
                break;

              case 18:
                _context15.prev = 18;
                _context15.t0 = _context15["catch"](0);
                console.error("Failed to add a new medication. ".concat(_context15.t0));
                res.status(_context15.t0.statusCode).json({
                  message: _context15.t0.message
                });

              case 22:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, null, [[0, 18]]);
      }));

      function addMedication(_x40, _x41, _x42) {
        return _addMedication.apply(this, arguments);
      }

      return addMedication;
    }()
  }, {
    key: "deleteMedication",
    value: function () {
      var _deleteMedication = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(req, res, next) {
        var appointmentId, appointment, medicationId, medication, response;
        return _regenerator["default"].wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                _context16.prev = 0;
                appointmentId = req.params.appointmentId;
                _context16.next = 4;
                return _appointmentDAO["default"].getAppointment(appointmentId);

              case 4:
                appointment = _context16.sent;

                if (!(!appointment || appointment && !Object.keys(appointment).length)) {
                  _context16.next = 7;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 7:
                medicationId = req.params.id;
                _context16.next = 10;
                return _medicationDAO["default"].getMedication(medicationId);

              case 10:
                medication = _context16.sent;

                if (!(!medication || medication && !Object.keys(medication).length)) {
                  _context16.next = 13;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 13:
                _context16.next = 15;
                return _medicationDAO["default"].deleteMedication(medicationId);

              case 15:
                response = _context16.sent;

                if (response.success) {
                  _context16.next = 18;
                  break;
                }

                throw new Error(response.error);

              case 18:
                res.json({
                  success: true
                });
                _context16.next = 25;
                break;

              case 21:
                _context16.prev = 21;
                _context16.t0 = _context16["catch"](0);
                console.error("Failed to delete medication. ".concat(_context16.t0));
                res.status(_context16.t0.statusCode).json({
                  message: _context16.t0.message
                });

              case 25:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, null, [[0, 21]]);
      }));

      function deleteMedication(_x43, _x44, _x45) {
        return _deleteMedication.apply(this, arguments);
      }

      return deleteMedication;
    }()
  }, {
    key: "getReports",
    value: function () {
      var _getReports = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17(req, res, next) {
        var appointmentId, page, limit, appointment, filter, labReports;
        return _regenerator["default"].wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                _context17.prev = 0;
                appointmentId = req.params.appointmentId;
                page = req.query.page ? parseInt(req.query.page, 10) : 0;
                limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
                _context17.next = 6;
                return _appointmentDAO["default"].getAppointment(appointmentId);

              case 6:
                appointment = _context17.sent;

                if (!(!appointment || appointment && !Object.keys(appointment).length)) {
                  _context17.next = 9;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 9:
                filter = {
                  appointmentId: (0, _mongodb.ObjectId)(appointment._id)
                };
                _context17.next = 12;
                return _labReportDAO["default"].getLabReports({
                  filter: filter,
                  page: page,
                  limit: limit
                });

              case 12:
                labReports = _context17.sent;
                res.json(labReports.map(function (item) {
                  var labReport = new _models.LabReport(item);
                  return labReport.toJson();
                }));
                _context17.next = 20;
                break;

              case 16:
                _context17.prev = 16;
                _context17.t0 = _context17["catch"](0);
                console.error("Failed to get reports. ".concat(_context17.t0));
                res.status(_context17.t0.statusCode).json({
                  message: _context17.t0.message
                });

              case 20:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, null, [[0, 16]]);
      }));

      function getReports(_x46, _x47, _x48) {
        return _getReports.apply(this, arguments);
      }

      return getReports;
    }()
  }, {
    key: "addReport",
    value: function () {
      var _addReport = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18(req, res, next) {
        var labReportInfo, appointmentId, appointment, response;
        return _regenerator["default"].wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                _context18.prev = 0;
                labReportInfo = req.body;

                if (!(!labReportInfo || labReportInfo && !Object.keys(labReportInfo).length)) {
                  _context18.next = 4;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 4:
                appointmentId = req.params.appointmentId;
                _context18.next = 7;
                return _appointmentDAO["default"].getAppointment(appointmentId);

              case 7:
                appointment = _context18.sent;

                if (!(!appointment || appointment && !Object.keys(appointment).length)) {
                  _context18.next = 10;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 10:
                _context18.next = 12;
                return _labReportDAO["default"].addLabReport({
                  username: labReportInfo.username,
                  name: labReportInfo.name,
                  date: labReportInfo.date,
                  appointmentId: (0, _mongodb.ObjectId)(appointment._id)
                });

              case 12:
                response = _context18.sent;

                if (response.success) {
                  _context18.next = 15;
                  break;
                }

                throw new Error(response.error);

              case 15:
                res.status(201).json({
                  success: true,
                  id: response.id
                });
                _context18.next = 22;
                break;

              case 18:
                _context18.prev = 18;
                _context18.t0 = _context18["catch"](0);
                console.error("Failed to add a new lab report. ".concat(_context18.t0));
                res.status(_context18.t0.statusCode).json({
                  message: _context18.t0.message
                });

              case 22:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, null, [[0, 18]]);
      }));

      function addReport(_x49, _x50, _x51) {
        return _addReport.apply(this, arguments);
      }

      return addReport;
    }()
  }, {
    key: "deleteReport",
    value: function () {
      var _deleteReport = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19(req, res, next) {
        var appointmentId, appointment, labReportId, labReport, response;
        return _regenerator["default"].wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                _context19.prev = 0;
                appointmentId = req.params.appointmentId;
                _context19.next = 4;
                return _appointmentDAO["default"].getAppointment(appointmentId);

              case 4:
                appointment = _context19.sent;

                if (!(!appointment || appointment && !Object.keys(appointment).length)) {
                  _context19.next = 7;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 7:
                labReportId = req.params.id;
                _context19.next = 10;
                return _labReportDAO["default"].getLabReport(labReportId);

              case 10:
                labReport = _context19.sent;

                if (!(!labReport || labReport && !Object.keys(labReport).length)) {
                  _context19.next = 13;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 13:
                _context19.next = 15;
                return _labReportDAO["default"].deleteLabReport(labReportId);

              case 15:
                response = _context19.sent;

                if (response.success) {
                  _context19.next = 18;
                  break;
                }

                throw new Error(response.error);

              case 18:
                res.json({
                  success: true
                });
                _context19.next = 25;
                break;

              case 21:
                _context19.prev = 21;
                _context19.t0 = _context19["catch"](0);
                console.error("Failed to delete lab report. ".concat(_context19.t0));
                res.status(_context19.t0.statusCode).json({
                  message: _context19.t0.message
                });

              case 25:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, null, [[0, 21]]);
      }));

      function deleteReport(_x52, _x53, _x54) {
        return _deleteReport.apply(this, arguments);
      }

      return deleteReport;
    }()
  }]);
  return AppointmentController;
}();

exports["default"] = AppointmentController;