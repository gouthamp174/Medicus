"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.UserApi = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _promises = require("fs/promises");

var _mongodb = require("mongodb");

var _errors = require("../errors");

var _models = require("../models");

var _userDAO = _interopRequireDefault(require("../../dao/userDAO"));

var _degreeDAO = _interopRequireDefault(require("../../dao/degreeDAO"));

var _jobDAO = _interopRequireDefault(require("../../dao/jobDAO"));

var _serviceDAO = _interopRequireDefault(require("../../dao/serviceDAO"));

var _insuranceDAO = _interopRequireDefault(require("../../dao/insuranceDAO"));

var _paymentDAO = _interopRequireDefault(require("../../dao/paymentDAO"));

var _labReportDAO = _interopRequireDefault(require("../../dao/labReportDAO"));

var _medicationDAO = _interopRequireDefault(require("../../dao/medicationDAO"));

var _controller = require("../appointmentApp/controller");

// This class defines all APIs that are not directly called by User router.
// It is done to factor out shared code that can be called by multiple router APIs.
var UserApi = /*#__PURE__*/function () {
  function UserApi() {
    (0, _classCallCheck2["default"])(this, UserApi);
  }

  (0, _createClass2["default"])(UserApi, null, [{
    key: "deleteUser",
    value: function () {
      var _deleteUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(username, profilePhotoId) {
        var appointmentResponse, insuranceResponse, serviceResponse, paymentResponse, jobResponse, degreeResponse, photoResponse, userResponse;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _controller.AppointmentApi.deleteAppointments({
                  "patient.username": username
                });

              case 3:
                appointmentResponse = _context.sent;
                _context.next = 6;
                return _insuranceDAO["default"].deleteInsurances({
                  username: username
                });

              case 6:
                insuranceResponse = _context.sent;

                if (insuranceResponse.success) {
                  _context.next = 9;
                  break;
                }

                throw new _errors.HttpInternalServerError(insuranceResponse.error);

              case 9:
                _context.next = 11;
                return _serviceDAO["default"].deleteServices({
                  username: username
                });

              case 11:
                serviceResponse = _context.sent;

                if (serviceResponse.success) {
                  _context.next = 14;
                  break;
                }

                throw new _errors.HttpInternalServerError(serviceResponse.error);

              case 14:
                _context.next = 16;
                return _paymentDAO["default"].deletePayments({
                  username: username
                });

              case 16:
                paymentResponse = _context.sent;

                if (paymentResponse.success) {
                  _context.next = 19;
                  break;
                }

                throw new _errors.HttpInternalServerError(paymentResponse.error);

              case 19:
                _context.next = 21;
                return _jobDAO["default"].deleteJobs({
                  username: username
                });

              case 21:
                jobResponse = _context.sent;

                if (jobResponse.success) {
                  _context.next = 24;
                  break;
                }

                throw new _errors.HttpInternalServerError(jobResponse.error);

              case 24:
                _context.next = 26;
                return _degreeDAO["default"].deleteDegrees({
                  username: username
                });

              case 26:
                degreeResponse = _context.sent;

                if (degreeResponse.success) {
                  _context.next = 29;
                  break;
                }

                throw new _errors.HttpInternalServerError(degreeResponse.error);

              case 29:
                _context.next = 31;
                return _userDAO["default"].deletePhoto(profilePhotoId);

              case 31:
                photoResponse = _context.sent;

                if (photoResponse.success) {
                  _context.next = 34;
                  break;
                }

                throw new _errors.HttpInternalServerError(photoResponse.error);

              case 34:
                _context.next = 36;
                return _userDAO["default"].deleteUser(username);

              case 36:
                userResponse = _context.sent;

                if (userResponse.success) {
                  _context.next = 39;
                  break;
                }

                throw new _errors.HttpInternalServerError(userResponse.error);

              case 39:
                _context.next = 44;
                break;

              case 41:
                _context.prev = 41;
                _context.t0 = _context["catch"](0);
                throw _context.t0;

              case 44:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 41]]);
      }));

      function deleteUser(_x, _x2) {
        return _deleteUser.apply(this, arguments);
      }

      return deleteUser;
    }()
  }]);
  return UserApi;
}(); // This class defines all middleware APIs that are directly called by User router.


exports.UserApi = UserApi;

var UserController = /*#__PURE__*/function () {
  function UserController() {
    (0, _classCallCheck2["default"])(this, UserController);
  }

  (0, _createClass2["default"])(UserController, null, [{
    key: "getUsers",
    value: function () {
      var _getUsers = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
        var view, search, page, limit, filter, result, queryRegex, searchQuery;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                view = req.query.view ? req.query.view : "";
                search = req.query.search !== undefined ? req.query.search : null;
                page = req.query.page ? parseInt(req.query.page, 10) : 0;
                limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;

                if (view === "patient") {
                  filter = {
                    isPhysician: false
                  };
                } else {
                  filter = {
                    isPhysician: true
                  };
                }

                if (!(search !== null)) {
                  _context2.next = 18;
                  break;
                }

                if (!(search === "")) {
                  _context2.next = 11;
                  break;
                }

                result = [];
                _context2.next = 16;
                break;

              case 11:
                queryRegex = new RegExp(search, 'i');
                searchQuery = {
                  $or: [{
                    username: queryRegex
                  }, {
                    fullName: queryRegex
                  }, {
                    specialization: queryRegex
                  }]
                };
                _context2.next = 15;
                return _userDAO["default"].searchUsers({
                  filter: filter,
                  searchQuery: searchQuery,
                  page: page,
                  limit: limit
                });

              case 15:
                result = _context2.sent;

              case 16:
                _context2.next = 21;
                break;

              case 18:
                _context2.next = 20;
                return _userDAO["default"].getUsers({
                  filter: filter,
                  page: page,
                  limit: limit
                });

              case 20:
                result = _context2.sent;

              case 21:
                res.json(result.map(function (item) {
                  var user = new _models.User(item);
                  return user.toShortJson();
                }));
                _context2.next = 28;
                break;

              case 24:
                _context2.prev = 24;
                _context2.t0 = _context2["catch"](0);
                console.error("Failed to get users. ".concat(_context2.t0));
                res.status(_context2.t0.statusCode).json({
                  message: _context2.t0.message
                });

              case 28:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 24]]);
      }));

      function getUsers(_x3, _x4, _x5) {
        return _getUsers.apply(this, arguments);
      }

      return getUsers;
    }()
  }, {
    key: "getUser",
    value: function () {
      var _getUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
        var username, result;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                username = req.params.username;
                _context3.next = 4;
                return _userDAO["default"].getUser(username);

              case 4:
                result = _context3.sent;
                res.json(new _models.User(result).toJson());
                _context3.next = 12;
                break;

              case 8:
                _context3.prev = 8;
                _context3.t0 = _context3["catch"](0);
                console.error("Failed to get user: ".concat(_context3.t0));
                res.status(500).json({
                  message: _context3.t0.message
                });

              case 12:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 8]]);
      }));

      function getUser(_x6, _x7, _x8) {
        return _getUser.apply(this, arguments);
      }

      return getUser;
    }()
  }, {
    key: "updateUser",
    value: function () {
      var _updateUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
        var username, updateInfo, notUpdatableFields, _i, _notUpdatableFields, field, updateResponse;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                username = req.params.username;
                updateInfo = req.body;

                if (!(!updateInfo || updateInfo && !Object.keys(updateInfo).length)) {
                  _context4.next = 5;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 5:
                notUpdatableFields = ["_id", "id", "username", "password", "isPhysician"];
                _i = 0, _notUpdatableFields = notUpdatableFields;

              case 7:
                if (!(_i < _notUpdatableFields.length)) {
                  _context4.next = 14;
                  break;
                }

                field = _notUpdatableFields[_i];

                if (!updateInfo.hasOwnProperty(field)) {
                  _context4.next = 11;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Cannot update field: '".concat(field, "'."));

              case 11:
                _i++;
                _context4.next = 7;
                break;

              case 14:
                if (updateInfo.dob) {
                  updateInfo.dob = new Date(updateInfo.dob);
                }

                _context4.next = 17;
                return _userDAO["default"].updateUser(username, updateInfo);

              case 17:
                updateResponse = _context4.sent;

                if (updateResponse.success) {
                  _context4.next = 20;
                  break;
                }

                throw new _errors.HttpInternalServerError(updateResponse.error);

              case 20:
                res.json({
                  success: true
                });
                _context4.next = 27;
                break;

              case 23:
                _context4.prev = 23;
                _context4.t0 = _context4["catch"](0);
                console.error("Failed to update user. ".concat(_context4.t0));
                res.status(_context4.t0.statusCode).json({
                  message: _context4.t0.message
                });

              case 27:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 23]]);
      }));

      function updateUser(_x9, _x10, _x11) {
        return _updateUser.apply(this, arguments);
      }

      return updateUser;
    }()
  }, {
    key: "deleteUser",
    value: function () {
      var _deleteUser2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
        var username, session, user;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                username = req.params.username;
                session = req.session;

                if (!(session.username !== username)) {
                  _context5.next = 5;
                  break;
                }

                throw new HttpUnauthorizedError("Invalid request. Cannot delete another user account.");

              case 5:
                _context5.next = 7;
                return _userDAO["default"].getUser(username);

              case 7:
                user = _context5.sent;

                if (!(!user || user && !Object.keys(user).length)) {
                  _context5.next = 10;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 10:
                _context5.next = 12;
                return UserApi.deleteUser(user.username, user.profilePhoto);

              case 12:
                res.json({
                  success: true
                });
                _context5.next = 19;
                break;

              case 15:
                _context5.prev = 15;
                _context5.t0 = _context5["catch"](0);
                console.error("Failed to delete user. ".concat(_context5.t0));
                res.status(_context5.t0.statusCode).json({
                  message: _context5.t0.message
                });

              case 19:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[0, 15]]);
      }));

      function deleteUser(_x12, _x13, _x14) {
        return _deleteUser2.apply(this, arguments);
      }

      return deleteUser;
    }()
  }, {
    key: "getPhoto",
    value: function () {
      var _getPhoto = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
        var username, user, photoId, photoStream;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                username = req.params.username;
                _context6.next = 4;
                return _userDAO["default"].getUser(username);

              case 4:
                user = _context6.sent;

                if (!(!user || user && !Object.keys(user).length)) {
                  _context6.next = 7;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 7:
                photoId = req.params.id;
                _context6.next = 10;
                return _userDAO["default"].getPhoto(photoId);

              case 10:
                photoStream = _context6.sent;

                if (photoStream !== null) {
                  photoStream.pipe(res);
                } else {
                  res.redirect('/public/imgs/person.png');
                }

                _context6.next = 18;
                break;

              case 14:
                _context6.prev = 14;
                _context6.t0 = _context6["catch"](0);
                console.error("Failed to get user photo. ".concat(_context6.t0));
                res.status(_context6.t0.statusCode).json({
                  message: _context6.t0.message
                });

              case 18:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[0, 14]]);
      }));

      function getPhoto(_x15, _x16, _x17) {
        return _getPhoto.apply(this, arguments);
      }

      return getPhoto;
    }()
  }, {
    key: "addPhoto",
    value: function () {
      var _addPhoto = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
        var username, addInfo, user, isProfilePhoto, deleteResponse, response, _deleteResponse;

        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                username = req.params.username;
                addInfo = req.body;
                _context7.prev = 3;
                _context7.next = 6;
                return _userDAO["default"].getUser(username);

              case 6:
                user = _context7.sent;

                if (!(!user || user && !Object.keys(user).length)) {
                  _context7.next = 9;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 9:
                isProfilePhoto = addInfo.isProfilePhoto;

                if (!Boolean(isProfilePhoto)) {
                  _context7.next = 20;
                  break;
                }

                if (!user.profilePhotoId) {
                  _context7.next = 15;
                  break;
                }

                _context7.next = 14;
                return _userDAO["default"].deletePhoto(user.profilePhotoId);

              case 14:
                deleteResponse = _context7.sent;

              case 15:
                _context7.next = 17;
                return _userDAO["default"].updateUser(username, {
                  profilePhotoId: (0, _mongodb.ObjectId)(req.file.id)
                });

              case 17:
                response = _context7.sent;

                if (response.success) {
                  _context7.next = 20;
                  break;
                }

                throw new _errors.HttpInternalServerError(response.error);

              case 20:
                res.json({
                  success: true,
                  id: req.file.id
                });
                _context7.next = 31;
                break;

              case 23:
                _context7.prev = 23;
                _context7.t0 = _context7["catch"](3);
                _context7.next = 27;
                return _userDAO["default"].deletePhoto(req.file.id);

              case 27:
                _deleteResponse = _context7.sent;

                if (_deleteResponse.success) {
                  _context7.next = 30;
                  break;
                }

                throw new _errors.HttpInternalServerError(_deleteResponse.error);

              case 30:
                throw _context7.t0;

              case 31:
                _context7.next = 37;
                break;

              case 33:
                _context7.prev = 33;
                _context7.t1 = _context7["catch"](0);
                console.error("Failed to add user photo. ".concat(_context7.t1));
                res.status(500).json({
                  message: _context7.t1.message
                });

              case 37:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[0, 33], [3, 23]]);
      }));

      function addPhoto(_x18, _x19, _x20) {
        return _addPhoto.apply(this, arguments);
      }

      return addPhoto;
    }()
  }, {
    key: "deletePhoto",
    value: function () {
      var _deletePhoto = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
        var username, photoId, user, response;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.prev = 0;
                username = req.params.username;
                photoId = req.params.id;
                _context8.next = 5;
                return _userDAO["default"].getUser(username);

              case 5:
                user = _context8.sent;

                if (!(!user || user && !Object.keys(user).length)) {
                  _context8.next = 8;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 8:
                _context8.next = 10;
                return _userDAO["default"].deletePhoto(photoId);

              case 10:
                response = _context8.sent;

                if (response.success) {
                  _context8.next = 13;
                  break;
                }

                throw new _errors.HttpInternalServerError(response.error);

              case 13:
                res.json({
                  success: true
                });
                _context8.next = 20;
                break;

              case 16:
                _context8.prev = 16;
                _context8.t0 = _context8["catch"](0);
                console.error("Failed to delete user photo. ".concat(_context8.t0));
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

      function deletePhoto(_x21, _x22, _x23) {
        return _deletePhoto.apply(this, arguments);
      }

      return deletePhoto;
    }()
  }, {
    key: "getDegrees",
    value: function () {
      var _getDegrees = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res, next) {
        var username, page, limit, user, filter, degrees;
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.prev = 0;
                username = req.params.username;
                page = req.query.page ? parseInt(req.query.page, 10) : 0;
                limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
                _context9.next = 6;
                return _userDAO["default"].getUser(username);

              case 6:
                user = _context9.sent;

                if (!(!user || user && !Object.keys(user).length)) {
                  _context9.next = 9;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 9:
                filter = {
                  username: username
                };
                _context9.next = 12;
                return _degreeDAO["default"].getDegrees({
                  filter: filter,
                  page: page,
                  limit: limit
                });

              case 12:
                degrees = _context9.sent;
                res.json(degrees.map(function (item) {
                  var degree = new _models.Degree(item);
                  return degree.toJson();
                }));
                _context9.next = 20;
                break;

              case 16:
                _context9.prev = 16;
                _context9.t0 = _context9["catch"](0);
                console.error("Failed to get user degrees. ".concat(_context9.t0));
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

      function getDegrees(_x24, _x25, _x26) {
        return _getDegrees.apply(this, arguments);
      }

      return getDegrees;
    }()
  }, {
    key: "addDegree",
    value: function () {
      var _addDegree = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
        var degreeInfo, username, user, response;
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.prev = 0;
                degreeInfo = req.body;

                if (!(!degreeInfo || degreeInfo && !Object.keys(degreeInfo).length)) {
                  _context10.next = 4;
                  break;
                }

                throw new Error("Invalid request. Bad input parameters.");

              case 4:
                username = req.params.username;
                _context10.next = 7;
                return _userDAO["default"].getUser(username);

              case 7:
                user = _context10.sent;

                if (!(!user || user && !Object.keys(user).length)) {
                  _context10.next = 10;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 10:
                _context10.next = 12;
                return _degreeDAO["default"].addDegree({
                  username: username,
                  degree: degreeInfo.degree,
                  fromDate: new Date(degreeInfo.fromDate),
                  toDate: new Date(degreeInfo.toDate),
                  university: degreeInfo.university
                });

              case 12:
                response = _context10.sent;

                if (response.success) {
                  _context10.next = 15;
                  break;
                }

                throw new _errors.HttpInternalServerError(response.error);

              case 15:
                res.status(201).json({
                  success: true,
                  id: response.id
                });
                _context10.next = 22;
                break;

              case 18:
                _context10.prev = 18;
                _context10.t0 = _context10["catch"](0);
                console.error("Failed to add user degree. ".concat(_context10.t0));
                res.status(_context10.t0.statusCode).json({
                  message: _context10.t0.message
                });

              case 22:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, null, [[0, 18]]);
      }));

      function addDegree(_x27, _x28, _x29) {
        return _addDegree.apply(this, arguments);
      }

      return addDegree;
    }()
  }, {
    key: "deleteDegree",
    value: function () {
      var _deleteDegree = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
        var username, degreeId, response;
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.prev = 0;
                username = req.params.username;
                degreeId = req.params.id;
                _context11.next = 5;
                return _degreeDAO["default"].deleteDegree(degreeId);

              case 5:
                response = _context11.sent;

                if (response.success) {
                  _context11.next = 8;
                  break;
                }

                throw new _errors.HttpInternalServerError(response.error);

              case 8:
                res.json({
                  success: true
                });
                _context11.next = 15;
                break;

              case 11:
                _context11.prev = 11;
                _context11.t0 = _context11["catch"](0);
                console.error("Failed to delete user degree. ".concat(_context11.t0));
                res.status(_context11.t0.statusCode).json({
                  message: _context11.t0.message
                });

              case 15:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, null, [[0, 11]]);
      }));

      function deleteDegree(_x30, _x31, _x32) {
        return _deleteDegree.apply(this, arguments);
      }

      return deleteDegree;
    }()
  }, {
    key: "getJobs",
    value: function () {
      var _getJobs = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(req, res, next) {
        var username, page, limit, user, filter, jobs;
        return _regenerator["default"].wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.prev = 0;
                username = req.params.username;
                page = req.query.page ? parseInt(req.query.page, 10) : 0;
                limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
                _context12.next = 6;
                return _userDAO["default"].getUser(username);

              case 6:
                user = _context12.sent;

                if (!(!user || user && !Object.keys(user).length)) {
                  _context12.next = 9;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 9:
                filter = {
                  username: username
                };
                _context12.next = 12;
                return _jobDAO["default"].getJobs({
                  filter: filter,
                  page: page,
                  limit: limit
                });

              case 12:
                jobs = _context12.sent;
                res.json(jobs.map(function (item) {
                  var job = new _models.Job(item);
                  return job.toJson();
                }));
                _context12.next = 20;
                break;

              case 16:
                _context12.prev = 16;
                _context12.t0 = _context12["catch"](0);
                console.error("Failed to get user jobs. ".concat(_context12.t0));
                res.status(_context12.t0.statusCode).json({
                  message: _context12.t0.message
                });

              case 20:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, null, [[0, 16]]);
      }));

      function getJobs(_x33, _x34, _x35) {
        return _getJobs.apply(this, arguments);
      }

      return getJobs;
    }()
  }, {
    key: "addJob",
    value: function () {
      var _addJob = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(req, res, next) {
        var jobInfo, username, user, response;
        return _regenerator["default"].wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.prev = 0;
                jobInfo = req.body;

                if (!(!jobInfo || jobInfo && !Object.keys(jobInfo).length)) {
                  _context13.next = 4;
                  break;
                }

                throw new Error("Invalid request. Bad input parameters.");

              case 4:
                username = req.params.username;
                _context13.next = 7;
                return _userDAO["default"].getUser(username);

              case 7:
                user = _context13.sent;

                if (!(!user || user && !Object.keys(user).length)) {
                  _context13.next = 10;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 10:
                _context13.next = 12;
                return _jobDAO["default"].addJob({
                  username: username,
                  title: jobInfo.title,
                  fromDate: new Date(jobInfo.fromDate),
                  toDate: new Date(jobInfo.toDate),
                  company: jobInfo.company
                });

              case 12:
                response = _context13.sent;

                if (response.success) {
                  _context13.next = 15;
                  break;
                }

                throw new _errors.HttpInternalServerError(response.error);

              case 15:
                res.status(201).json({
                  success: true,
                  id: response.id
                });
                _context13.next = 22;
                break;

              case 18:
                _context13.prev = 18;
                _context13.t0 = _context13["catch"](0);
                console.error("Failed to add user job. ".concat(_context13.t0));
                res.status(_context13.t0.statusCode).json({
                  message: _context13.t0.message
                });

              case 22:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, null, [[0, 18]]);
      }));

      function addJob(_x36, _x37, _x38) {
        return _addJob.apply(this, arguments);
      }

      return addJob;
    }()
  }, {
    key: "deleteJob",
    value: function () {
      var _deleteJob = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(req, res, next) {
        var username, jobId, response;
        return _regenerator["default"].wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.prev = 0;
                username = req.params.username;
                jobId = req.params.id;
                _context14.next = 5;
                return _jobDAO["default"].deleteJob(jobId);

              case 5:
                response = _context14.sent;

                if (response.success) {
                  _context14.next = 8;
                  break;
                }

                throw new _errors.HttpInternalServerError(response.error);

              case 8:
                res.json({
                  success: true
                });
                _context14.next = 15;
                break;

              case 11:
                _context14.prev = 11;
                _context14.t0 = _context14["catch"](0);
                console.error("Failed to delete user job. ".concat(_context14.t0));
                res.status(_context14.t0.statusCode).json({
                  message: _context14.t0.message
                });

              case 15:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, null, [[0, 11]]);
      }));

      function deleteJob(_x39, _x40, _x41) {
        return _deleteJob.apply(this, arguments);
      }

      return deleteJob;
    }()
  }, {
    key: "getServices",
    value: function () {
      var _getServices = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(req, res, next) {
        var username, page, limit, user, filter, services;
        return _regenerator["default"].wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.prev = 0;
                username = req.params.username;
                page = req.query.page ? parseInt(req.query.page, 10) : 0;
                limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
                _context15.next = 6;
                return _userDAO["default"].getUser(username);

              case 6:
                user = _context15.sent;

                if (!(!user || user && !Object.keys(user).length)) {
                  _context15.next = 9;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 9:
                filter = {
                  username: username
                };
                _context15.next = 12;
                return _serviceDAO["default"].getServices({
                  filter: filter,
                  page: page,
                  limit: limit
                });

              case 12:
                services = _context15.sent;
                res.json(services.map(function (item) {
                  var service = new _models.Service(item);
                  return service.toJson();
                }));
                _context15.next = 20;
                break;

              case 16:
                _context15.prev = 16;
                _context15.t0 = _context15["catch"](0);
                console.error("Failed to get user services. ".concat(_context15.t0));
                res.status(_context15.t0.statusCode).json({
                  message: _context15.t0.message
                });

              case 20:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, null, [[0, 16]]);
      }));

      function getServices(_x42, _x43, _x44) {
        return _getServices.apply(this, arguments);
      }

      return getServices;
    }()
  }, {
    key: "addService",
    value: function () {
      var _addService = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(req, res, next) {
        var serviceInfo, username, user, rateAsNumber, response;
        return _regenerator["default"].wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                _context16.prev = 0;
                serviceInfo = req.body;

                if (!(!serviceInfo || serviceInfo && !Object.keys(serviceInfo).length)) {
                  _context16.next = 4;
                  break;
                }

                throw new Error("Invalid request. Bad input parameters.");

              case 4:
                username = req.params.username;
                _context16.next = 7;
                return _userDAO["default"].getUser(username);

              case 7:
                user = _context16.sent;

                if (!(!user || user && !Object.keys(user).length)) {
                  _context16.next = 10;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 10:
                rateAsNumber = Number(serviceInfo.rate);

                if (!(rateAsNumber === NaN || rateAsNumber < 0)) {
                  _context16.next = 13;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 13:
                _context16.next = 15;
                return _serviceDAO["default"].addService({
                  username: username,
                  name: serviceInfo.name,
                  rate: rateAsNumber
                });

              case 15:
                response = _context16.sent;

                if (response.success) {
                  _context16.next = 18;
                  break;
                }

                throw new _errors.HttpInternalServerError(response.error);

              case 18:
                res.status(201).json({
                  success: true,
                  id: response.id
                });
                _context16.next = 25;
                break;

              case 21:
                _context16.prev = 21;
                _context16.t0 = _context16["catch"](0);
                console.error("Failed to add user service. ".concat(_context16.t0));
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

      function addService(_x45, _x46, _x47) {
        return _addService.apply(this, arguments);
      }

      return addService;
    }()
  }, {
    key: "deleteService",
    value: function () {
      var _deleteService = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17(req, res, next) {
        var username, serviceId, response;
        return _regenerator["default"].wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                _context17.prev = 0;
                username = req.params.username;
                serviceId = req.params.id;
                _context17.next = 5;
                return _serviceDAO["default"].deleteService(serviceId);

              case 5:
                response = _context17.sent;

                if (response.success) {
                  _context17.next = 8;
                  break;
                }

                throw new _errors.HttpInternalServerError(response.error);

              case 8:
                res.json({
                  success: true
                });
                _context17.next = 15;
                break;

              case 11:
                _context17.prev = 11;
                _context17.t0 = _context17["catch"](0);
                console.error("Failed to delete user service. ".concat(_context17.t0));
                res.status(_context17.t0.statusCode).json({
                  message: _context17.t0.message
                });

              case 15:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, null, [[0, 11]]);
      }));

      function deleteService(_x48, _x49, _x50) {
        return _deleteService.apply(this, arguments);
      }

      return deleteService;
    }()
  }, {
    key: "getInsurances",
    value: function () {
      var _getInsurances = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18(req, res, next) {
        var username, page, limit, user, filter, insurances;
        return _regenerator["default"].wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                _context18.prev = 0;
                username = req.params.username;
                page = req.query.page ? parseInt(req.query.page, 10) : 0;
                limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
                _context18.next = 6;
                return _userDAO["default"].getUser(username);

              case 6:
                user = _context18.sent;

                if (!(!user || user && !Object.keys(user).length)) {
                  _context18.next = 9;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 9:
                filter = {
                  username: username
                };
                _context18.next = 12;
                return _insuranceDAO["default"].getInsurances({
                  filter: filter,
                  page: page,
                  limit: limit
                });

              case 12:
                insurances = _context18.sent;
                res.json(insurances.map(function (item) {
                  var insurance = new _models.Insurance(item);
                  return insurance.toJson();
                }));
                _context18.next = 20;
                break;

              case 16:
                _context18.prev = 16;
                _context18.t0 = _context18["catch"](0);
                console.error("Failed to get user insurances. ".concat(_context18.t0));
                res.status(_context18.t0.statusCode).json({
                  message: _context18.t0.message
                });

              case 20:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, null, [[0, 16]]);
      }));

      function getInsurances(_x51, _x52, _x53) {
        return _getInsurances.apply(this, arguments);
      }

      return getInsurances;
    }()
  }, {
    key: "addInsurance",
    value: function () {
      var _addInsurance = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19(req, res, next) {
        var insuranceInfo, username, user, response;
        return _regenerator["default"].wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                _context19.prev = 0;
                insuranceInfo = req.body;

                if (!(!insuranceInfo || insuranceInfo && !Object.keys(insuranceInfo).length)) {
                  _context19.next = 4;
                  break;
                }

                throw new Error("Invalid request. Bad input parameters.");

              case 4:
                username = req.params.username;
                _context19.next = 7;
                return _userDAO["default"].getUser(username);

              case 7:
                user = _context19.sent;

                if (!(!user || user && !Object.keys(user).length)) {
                  _context19.next = 10;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 10:
                _context19.next = 12;
                return _insuranceDAO["default"].addInsurance({
                  username: username,
                  insuranceId: insuranceInfo.insuranceId,
                  providerName: insuranceInfo.providerName,
                  expiryDate: new Date(insuranceInfo.expiryDate)
                });

              case 12:
                response = _context19.sent;

                if (response.success) {
                  _context19.next = 15;
                  break;
                }

                throw new _errors.HttpInternalServerError(response.error);

              case 15:
                res.status(201).json({
                  success: true,
                  id: response.id
                });
                _context19.next = 22;
                break;

              case 18:
                _context19.prev = 18;
                _context19.t0 = _context19["catch"](0);
                console.error("Failed to add user insurance. ".concat(_context19.t0));
                res.status(_context19.t0.statusCode).json({
                  message: _context19.t0.message
                });

              case 22:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, null, [[0, 18]]);
      }));

      function addInsurance(_x54, _x55, _x56) {
        return _addInsurance.apply(this, arguments);
      }

      return addInsurance;
    }()
  }, {
    key: "deleteInsurance",
    value: function () {
      var _deleteInsurance = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee20(req, res, next) {
        var username, insuranceId, response;
        return _regenerator["default"].wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                _context20.prev = 0;
                username = req.params.username;
                insuranceId = req.params.id;
                _context20.next = 5;
                return _insuranceDAO["default"].deleteInsurance(insuranceId);

              case 5:
                response = _context20.sent;

                if (response.success) {
                  _context20.next = 8;
                  break;
                }

                throw new _errors.HttpInternalServerError(response.error);

              case 8:
                res.json({
                  success: true
                });
                _context20.next = 15;
                break;

              case 11:
                _context20.prev = 11;
                _context20.t0 = _context20["catch"](0);
                console.error("Failed to delete user insurance. ".concat(_context20.t0));
                res.status(_context20.t0.statusCode).json({
                  message: _context20.t0.message
                });

              case 15:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20, null, [[0, 11]]);
      }));

      function deleteInsurance(_x57, _x58, _x59) {
        return _deleteInsurance.apply(this, arguments);
      }

      return deleteInsurance;
    }()
  }, {
    key: "getPayments",
    value: function () {
      var _getPayments = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee21(req, res, next) {
        var username, page, limit, user, filter, payments;
        return _regenerator["default"].wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                _context21.prev = 0;
                username = req.params.username;
                page = req.query.page ? parseInt(req.query.page, 10) : 0;
                limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
                _context21.next = 6;
                return _userDAO["default"].getUser(username);

              case 6:
                user = _context21.sent;

                if (!(!user || user && !Object.keys(user).length)) {
                  _context21.next = 9;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 9:
                filter = {
                  username: username
                };
                _context21.next = 12;
                return _paymentDAO["default"].getPayments({
                  filter: filter,
                  page: page,
                  limit: limit
                });

              case 12:
                payments = _context21.sent;
                res.json(payments.map(function (item) {
                  var payment = new _models.Payment(item);
                  return payment.toJson();
                }));
                _context21.next = 20;
                break;

              case 16:
                _context21.prev = 16;
                _context21.t0 = _context21["catch"](0);
                console.error("Failed to get user payments. ".concat(_context21.t0));
                res.status(_context21.t0.statusCode).json({
                  message: _context21.t0.message
                });

              case 20:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21, null, [[0, 16]]);
      }));

      function getPayments(_x60, _x61, _x62) {
        return _getPayments.apply(this, arguments);
      }

      return getPayments;
    }()
  }, {
    key: "getMedications",
    value: function () {
      var _getMedications = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee22(req, res, next) {
        var username, page, limit, user, filter, medications;
        return _regenerator["default"].wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                _context22.prev = 0;
                username = req.params.username;
                page = req.query.page ? parseInt(req.query.page, 10) : 0;
                limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
                _context22.next = 6;
                return _userDAO["default"].getUser(username);

              case 6:
                user = _context22.sent;

                if (!(!user || user && !Object.keys(user).length)) {
                  _context22.next = 9;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 9:
                filter = {
                  username: username
                };
                _context22.next = 12;
                return _medicationDAO["default"].getMedications({
                  filter: filter,
                  page: page,
                  limit: limit
                });

              case 12:
                medications = _context22.sent;
                res.json(medications.map(function (item) {
                  var medication = new _models.Medication(item);
                  return medication.toJson();
                }));
                _context22.next = 20;
                break;

              case 16:
                _context22.prev = 16;
                _context22.t0 = _context22["catch"](0);
                console.error("Failed to get user medications. ".concat(_context22.t0));
                res.status(_context22.t0.statusCode).json({
                  message: _context22.t0.message
                });

              case 20:
              case "end":
                return _context22.stop();
            }
          }
        }, _callee22, null, [[0, 16]]);
      }));

      function getMedications(_x63, _x64, _x65) {
        return _getMedications.apply(this, arguments);
      }

      return getMedications;
    }()
  }, {
    key: "getReports",
    value: function () {
      var _getReports = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee23(req, res, next) {
        var username, page, limit, user, filter, labReports;
        return _regenerator["default"].wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                _context23.prev = 0;
                username = req.params.username;
                page = req.query.page ? parseInt(req.query.page, 10) : 0;
                limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
                _context23.next = 6;
                return _userDAO["default"].getUser(username);

              case 6:
                user = _context23.sent;

                if (!(!user || user && !Object.keys(user).length)) {
                  _context23.next = 9;
                  break;
                }

                throw new _errors.HttpBadRequestError("Invalid request. Bad input parameters.");

              case 9:
                filter = {
                  username: username
                };
                _context23.next = 12;
                return _labReportDAO["default"].getLabReports({
                  filter: filter,
                  page: page,
                  limit: limit
                });

              case 12:
                labReports = _context23.sent;
                res.json(labReports.map(function (item) {
                  var labReport = new _models.LabReport(item);
                  return labReport.toJson();
                }));
                _context23.next = 20;
                break;

              case 16:
                _context23.prev = 16;
                _context23.t0 = _context23["catch"](0);
                console.error("Failed to get user reports. ".concat(_context23.t0));
                res.status(_context23.t0.statusCode).json({
                  message: _context23.t0.message
                });

              case 20:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee23, null, [[0, 16]]);
      }));

      function getReports(_x66, _x67, _x68) {
        return _getReports.apply(this, arguments);
      }

      return getReports;
    }()
  }]);
  return UserController;
}();

exports["default"] = UserController;