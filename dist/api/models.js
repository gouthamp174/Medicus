"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Message = exports.Chat = exports.LabReport = exports.Medication = exports.Note = exports.Appointment = exports.Payment = exports.Insurance = exports.Service = exports.Job = exports.Degree = exports.Session = exports.User = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _errors = require("./errors");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var User = /*#__PURE__*/function () {
  function User() {
    var userInfo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, User);
    this.info = userInfo;
  }

  (0, _createClass2.default)(User, [{
    key: "toShortJson",
    value: function toShortJson() {
      if (!this.info || this.info && !Object.keys(this.info).length) {
        return {};
      }

      var _this$info = this.info,
          username = _this$info.username,
          firstName = _this$info.firstName,
          lastName = _this$info.lastName,
          isPhysician = _this$info.isPhysician,
          profilePhotoId = _this$info.profilePhotoId;
      return {
        username: username,
        firstName: firstName,
        lastName: lastName,
        isPhysician: isPhysician,
        profilePhotoId: profilePhotoId
      };
    }
  }, {
    key: "toJson",
    value: function toJson() {
      if (!this.info || this.info && !Object.keys(this.info).length) {
        return {};
      }

      var _this$info2 = this.info,
          _id = _this$info2._id,
          password = _this$info2.password,
          detailsId = _this$info2.detailsId,
          otherInfo = (0, _objectWithoutProperties2.default)(_this$info2, ["_id", "password", "detailsId"]);
      return _objectSpread({}, otherInfo);
    }
  }, {
    key: "comparePassword",
    value: function () {
      var _comparePassword = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(plainText) {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _bcryptjs.default.compare(plainText, this.info.password);

              case 2:
                return _context.abrupt("return", _context.sent);

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function comparePassword(_x) {
        return _comparePassword.apply(this, arguments);
      }

      return comparePassword;
    }()
  }]);
  return User;
}();

exports.User = User;

var Session = /*#__PURE__*/function () {
  function Session() {
    var sessionInfo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, Session);
    this.info = sessionInfo;
  }

  (0, _createClass2.default)(Session, [{
    key: "toJson",
    value: function toJson() {
      try {
        if (!this.info || this.info && !Object.keys(this.info).length) {
          return {};
        }

        var _this$info3 = this.info,
            _id = _this$info3._id,
            otherInfo = (0, _objectWithoutProperties2.default)(_this$info3, ["_id"]);
        return _objectSpread({
          id: this.id
        }, otherInfo);
      } catch (err) {
        return {};
      }
    }
  }, {
    key: "encoded",
    value: function () {
      var _encoded = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var _this$info4, _id, username, startTime;

        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;

                if (!(!this.info || this.info && !Object.keys(this.info).length)) {
                  _context2.next = 3;
                  break;
                }

                throw Error();

              case 3:
                _this$info4 = this.info, _id = _this$info4._id, username = _this$info4.username, startTime = _this$info4.startTime;
                return _context2.abrupt("return", _jsonwebtoken.default.sign({
                  exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
                  id: _id,
                  username: username,
                  startTime: startTime.toISOString()
                }, process.env.DB_SECRET_KEY));

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2["catch"](0);
                throw Error("Failed to encode. Invalid session. ".concat(_context2.t0));

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 7]]);
      }));

      function encoded() {
        return _encoded.apply(this, arguments);
      }

      return encoded;
    }()
  }], [{
    key: "decoded",
    value: function () {
      var _decoded = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(encodedInfo) {
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                return _context3.abrupt("return", _jsonwebtoken.default.verify(encodedInfo, process.env.DB_SECRET_KEY));

              case 4:
                _context3.prev = 4;
                _context3.t0 = _context3["catch"](0);
                throw new _errors.UnauthorizedError("Failed to decode. ".concat(_context3.t0));

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 4]]);
      }));

      function decoded(_x2) {
        return _decoded.apply(this, arguments);
      }

      return decoded;
    }()
  }]);
  return Session;
}();

exports.Session = Session;

var Degree = /*#__PURE__*/function () {
  function Degree() {
    var degreeInfo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, Degree);
    this.info = degreeInfo;
  }

  (0, _createClass2.default)(Degree, [{
    key: "toJson",
    value: function toJson() {
      if (!this.info || this.info && !Object.keys(this.info).length) {
        return {};
      }

      var _this$info5 = this.info,
          _id = _this$info5._id,
          otherInfo = (0, _objectWithoutProperties2.default)(_this$info5, ["_id"]);
      return _objectSpread({
        id: _id
      }, otherInfo);
    }
  }]);
  return Degree;
}();

exports.Degree = Degree;

var Job = /*#__PURE__*/function () {
  function Job() {
    var jobInfo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, Job);
    this.info = jobInfo;
  }

  (0, _createClass2.default)(Job, [{
    key: "toJson",
    value: function toJson() {
      if (!this.info || this.info && !Object.keys(this.info).length) {
        return {};
      }

      var _this$info6 = this.info,
          _id = _this$info6._id,
          otherInfo = (0, _objectWithoutProperties2.default)(_this$info6, ["_id"]);
      return _objectSpread({
        id: _id
      }, otherInfo);
    }
  }]);
  return Job;
}();

exports.Job = Job;

var Service = /*#__PURE__*/function () {
  function Service() {
    var serviceInfo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, Service);
    this.info = serviceInfo;
  }

  (0, _createClass2.default)(Service, [{
    key: "toJson",
    value: function toJson() {
      if (!this.info || this.info && !Object.keys(this.info).length) {
        return {};
      }

      var _this$info7 = this.info,
          _id = _this$info7._id,
          otherInfo = (0, _objectWithoutProperties2.default)(_this$info7, ["_id"]);
      return _objectSpread({
        id: _id
      }, otherInfo);
    }
  }]);
  return Service;
}();

exports.Service = Service;

var Insurance = /*#__PURE__*/function () {
  function Insurance() {
    var insuranceInfo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, Insurance);
    this.info = insuranceInfo;
  }

  (0, _createClass2.default)(Insurance, [{
    key: "toJson",
    value: function toJson() {
      if (!this.info || this.info && !Object.keys(this.info).length) {
        return {};
      }

      var _this$info8 = this.info,
          _id = _this$info8._id,
          otherInfo = (0, _objectWithoutProperties2.default)(_this$info8, ["_id"]);
      return _objectSpread({
        id: _id
      }, otherInfo);
    }
  }]);
  return Insurance;
}();

exports.Insurance = Insurance;

var Payment = /*#__PURE__*/function () {
  function Payment() {
    var paymentInfo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, Payment);
    this.info = paymentInfo;
  }

  (0, _createClass2.default)(Payment, [{
    key: "toJson",
    value: function toJson() {
      if (!this.info || this.info && !Object.keys(this.info).length) {
        return {};
      }

      var _this$info9 = this.info,
          _id = _this$info9._id,
          otherInfo = (0, _objectWithoutProperties2.default)(_this$info9, ["_id"]);
      return _objectSpread({
        id: _id
      }, otherInfo);
    }
  }]);
  return Payment;
}(); // Models for appointmentApp


exports.Payment = Payment;

var Appointment = /*#__PURE__*/function () {
  function Appointment() {
    var appointmentInfo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, Appointment);
    this.info = appointmentInfo;
  }

  (0, _createClass2.default)(Appointment, [{
    key: "toShortJson",
    value: function toShortJson() {
      if (!this.info || this.info && !Object.keys(this.info).length) {
        return {};
      }

      var _this$info10 = this.info,
          _id = _this$info10._id,
          title = _this$info10.title,
          startTime = _this$info10.startTime,
          endTime = _this$info10.endTime;
      return {
        id: _id,
        title: title,
        startTime: startTime,
        endTime: endTime
      };
    }
  }, {
    key: "toJson",
    value: function toJson() {
      if (!this.info || this.info && !Object.keys(this.info).length) {
        return {};
      }

      var _this$info11 = this.info,
          _id = _this$info11._id,
          otherInfo = (0, _objectWithoutProperties2.default)(_this$info11, ["_id"]);
      return _objectSpread({
        id: _id
      }, otherInfo);
    }
  }]);
  return Appointment;
}();

exports.Appointment = Appointment;

var Note = /*#__PURE__*/function () {
  function Note() {
    var noteInfo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, Note);
    this.info = noteInfo;
  }

  (0, _createClass2.default)(Note, [{
    key: "toJson",
    value: function toJson() {
      if (!this.info || this.info && !Object.keys(this.info).length) {
        return {};
      }

      var _this$info12 = this.info,
          _id = _this$info12._id,
          otherInfo = (0, _objectWithoutProperties2.default)(_this$info12, ["_id"]);
      return _objectSpread({
        id: _id
      }, otherInfo);
    }
  }]);
  return Note;
}();

exports.Note = Note;

var Medication = /*#__PURE__*/function () {
  function Medication() {
    var medicationInfo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, Medication);
    this.info = medicationInfo;
  }

  (0, _createClass2.default)(Medication, [{
    key: "toJson",
    value: function toJson() {
      if (!this.info || this.info && !Object.keys(this.info).length) {
        return {};
      }

      var _this$info13 = this.info,
          _id = _this$info13._id,
          otherInfo = (0, _objectWithoutProperties2.default)(_this$info13, ["_id"]);
      return _objectSpread({
        id: _id
      }, otherInfo);
    }
  }]);
  return Medication;
}();

exports.Medication = Medication;

var LabReport = /*#__PURE__*/function () {
  function LabReport() {
    var labReportInfo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, LabReport);
    this.info = labReportInfo;
  }

  (0, _createClass2.default)(LabReport, [{
    key: "toJson",
    value: function toJson() {
      if (!this.info || this.info && !Object.keys(this.info).length) {
        return {};
      }

      var _this$info14 = this.info,
          _id = _this$info14._id,
          otherInfo = (0, _objectWithoutProperties2.default)(_this$info14, ["_id"]);
      return _objectSpread({
        id: _id
      }, otherInfo);
    }
  }]);
  return LabReport;
}(); // Models for chatApp


exports.LabReport = LabReport;

var Chat = /*#__PURE__*/function () {
  function Chat() {
    var chatInfo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, Chat);
    this.info = chatInfo;
  }

  (0, _createClass2.default)(Chat, [{
    key: "toJson",
    value: function toJson() {
      if (!this.info || this.info && !Object.keys(this.info).length) {
        return {};
      }

      var _this$info15 = this.info,
          _id = _this$info15._id,
          otherInfo = (0, _objectWithoutProperties2.default)(_this$info15, ["_id"]);
      return _objectSpread({
        id: _id
      }, otherInfo);
    }
  }]);
  return Chat;
}();

exports.Chat = Chat;

var Message = /*#__PURE__*/function () {
  function Message() {
    var messageInfo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck2.default)(this, Message);
    this.info = messageInfo;
  }

  (0, _createClass2.default)(Message, [{
    key: "toJson",
    value: function toJson() {
      if (!this.info || this.info && !Object.keys(this.info).length) {
        return {};
      }

      var _this$info16 = this.info,
          _id = _this$info16._id,
          otherInfo = (0, _objectWithoutProperties2.default)(_this$info16, ["_id"]);
      return _objectSpread({
        id: _id
      }, otherInfo);
    }
  }]);
  return Message;
}();

exports.Message = Message;