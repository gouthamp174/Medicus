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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var UserDAO = /*#__PURE__*/function () {
  function UserDAO() {
    (0, _classCallCheck2["default"])(this, UserDAO);
  }

  (0, _createClass2["default"])(UserDAO, null, [{
    key: "injectDB",
    value: function () {
      var _injectDB = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(conn) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(this.users && this.gfs)) {
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
                this.gfs = new _mongodb.GridFSBucket(conn.db(process.env.DB_NS), {
                  bucketName: "photos",
                  writeConcern: {
                    w: "majority"
                  }
                });
                _context.next = 12;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](2);
                console.error("Failed to connect to DB in UserDAO: ".concat(_context.t0));

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 9]]);
      }));

      function injectDB(_x) {
        return _injectDB.apply(this, arguments);
      }

      return injectDB;
    }()
  }, {
    key: "getUsers",
    value: function () {
      var _getUsers = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref) {
        var _ref$filter, filter, _ref$page, page, _ref$limit, limit, cursor;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _ref$filter = _ref.filter, filter = _ref$filter === void 0 ? {} : _ref$filter, _ref$page = _ref.page, page = _ref$page === void 0 ? 0 : _ref$page, _ref$limit = _ref.limit, limit = _ref$limit === void 0 ? 10 : _ref$limit;
                _context2.prev = 1;
                _context2.next = 4;
                return this.users.find(filter).skip(page * limit).limit(limit);

              case 4:
                cursor = _context2.sent;
                return _context2.abrupt("return", cursor.toArray());

              case 8:
                _context2.prev = 8;
                _context2.t0 = _context2["catch"](1);
                console.error("Failed to retrieve users from DB. ".concat(_context2.t0));
                return _context2.abrupt("return", []);

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[1, 8]]);
      }));

      function getUsers(_x2) {
        return _getUsers.apply(this, arguments);
      }

      return getUsers;
    }()
  }, {
    key: "searchUsers",
    value: function () {
      var _searchUsers = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_ref2) {
        var _ref2$filter, filter, _ref2$searchQuery, searchQuery, _ref2$page, page, _ref2$limit, limit, cursor;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _ref2$filter = _ref2.filter, filter = _ref2$filter === void 0 ? {} : _ref2$filter, _ref2$searchQuery = _ref2.searchQuery, searchQuery = _ref2$searchQuery === void 0 ? {} : _ref2$searchQuery, _ref2$page = _ref2.page, page = _ref2$page === void 0 ? 0 : _ref2$page, _ref2$limit = _ref2.limit, limit = _ref2$limit === void 0 ? 10 : _ref2$limit;
                _context3.prev = 1;
                _context3.next = 4;
                return this.users.aggregate([{
                  $match: filter
                }, {
                  $addFields: {
                    fullName: {
                      $concat: ["$firstName", " ", "$lastName"]
                    }
                  }
                }]).match(searchQuery).project({
                  fullName: 0
                }).skip(page * limit).limit(limit);

              case 4:
                cursor = _context3.sent;
                return _context3.abrupt("return", cursor.toArray());

              case 8:
                _context3.prev = 8;
                _context3.t0 = _context3["catch"](1);
                console.error("Failed to search users based on query within DB. ".concat(_context3.t0));
                return _context3.abrupt("return", []);

              case 12:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[1, 8]]);
      }));

      function searchUsers(_x3) {
        return _searchUsers.apply(this, arguments);
      }

      return searchUsers;
    }()
  }, {
    key: "getUser",
    value: function () {
      var _getUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(username) {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return this.users.findOne({
                  username: username
                });

              case 3:
                return _context4.abrupt("return", _context4.sent);

              case 6:
                _context4.prev = 6;
                _context4.t0 = _context4["catch"](0);
                console.error("Failed to retrieve user from DB. ".concat(_context4.t0));
                return _context4.abrupt("return", {});

              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 6]]);
      }));

      function getUser(_x4) {
        return _getUser.apply(this, arguments);
      }

      return getUser;
    }()
  }, {
    key: "addUser",
    value: function () {
      var _addUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(_ref3) {
        var username, password, firstName, lastName, isPhysician, profilePhotoId, dob, gender, _ref3$qualification, qualification, _ref3$specialization, specialization, _ref3$description, description, response;

        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                username = _ref3.username, password = _ref3.password, firstName = _ref3.firstName, lastName = _ref3.lastName, isPhysician = _ref3.isPhysician, profilePhotoId = _ref3.profilePhotoId, dob = _ref3.dob, gender = _ref3.gender, _ref3$qualification = _ref3.qualification, qualification = _ref3$qualification === void 0 ? "" : _ref3$qualification, _ref3$specialization = _ref3.specialization, specialization = _ref3$specialization === void 0 ? "" : _ref3$specialization, _ref3$description = _ref3.description, description = _ref3$description === void 0 ? "" : _ref3$description;
                _context5.prev = 1;
                _context5.next = 4;
                return this.users.insertOne({
                  username: username,
                  password: password,
                  firstName: firstName,
                  lastName: lastName,
                  isPhysician: Boolean(isPhysician),
                  profilePhotoId: profilePhoto ? (0, _mongodb.ObjectId)(profilePhoto) : null,
                  dob: new Date(dob),
                  gender: gender,
                  emailId: "",
                  phoneNumber: "",
                  qualification: qualification,
                  specialization: specialization,
                  description: description
                }, {
                  writeConcern: {
                    w: "majority"
                  }
                });

              case 4:
                response = _context5.sent;
                return _context5.abrupt("return", {
                  success: true,
                  id: response.id
                });

              case 8:
                _context5.prev = 8;
                _context5.t0 = _context5["catch"](1);
                console.error("Failed to add a new user. ".concat(_context5.t0));
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

      function addUser(_x5) {
        return _addUser.apply(this, arguments);
      }

      return addUser;
    }()
  }, {
    key: "deleteUser",
    value: function () {
      var _deleteUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(username) {
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                _context6.next = 3;
                return this.users.deleteOne({
                  username: username
                });

              case 3:
                return _context6.abrupt("return", {
                  success: true
                });

              case 6:
                _context6.prev = 6;
                _context6.t0 = _context6["catch"](0);
                console.error("Failed to delete user. ".concat(_context6.t0));
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

      function deleteUser(_x6) {
        return _deleteUser.apply(this, arguments);
      }

      return deleteUser;
    }()
  }, {
    key: "updateUser",
    value: function () {
      var _updateUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(username, updateQuery) {
        var udpateResponse;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                _context7.next = 3;
                return this.users.updateOne({
                  username: username
                }, {
                  $set: _objectSpread({}, updateQuery)
                });

              case 3:
                udpateResponse = _context7.sent;

                if (!(udpateResponse.matchedCount === 0)) {
                  _context7.next = 6;
                  break;
                }

                throw new Error("No user found with that username.");

              case 6:
                return _context7.abrupt("return", {
                  success: true
                });

              case 9:
                _context7.prev = 9;
                _context7.t0 = _context7["catch"](0);
                console.error("Failed to update user in DB. ".concat(_context7.t0));
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

      function updateUser(_x7, _x8) {
        return _updateUser.apply(this, arguments);
      }

      return updateUser;
    }()
  }, {
    key: "getPhoto",
    value: function () {
      var _getPhoto = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(photoId) {
        var cursor, files;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.prev = 0;
                _context8.next = 3;
                return this.gfs.find({
                  _id: (0, _mongodb.ObjectId)(photoId)
                });

              case 3:
                cursor = _context8.sent;
                _context8.next = 6;
                return cursor.toArray();

              case 6:
                files = _context8.sent;

                if (!(!files || files.length === 0)) {
                  _context8.next = 9;
                  break;
                }

                return _context8.abrupt("return", null);

              case 9:
                _context8.next = 11;
                return this.gfs.openDownloadStream((0, _mongodb.ObjectId)(photoId));

              case 11:
                return _context8.abrupt("return", _context8.sent);

              case 14:
                _context8.prev = 14;
                _context8.t0 = _context8["catch"](0);
                return _context8.abrupt("return", null);

              case 17:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this, [[0, 14]]);
      }));

      function getPhoto(_x9) {
        return _getPhoto.apply(this, arguments);
      }

      return getPhoto;
    }()
  }, {
    key: "deletePhoto",
    value: function () {
      var _deletePhoto = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(photoId) {
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.prev = 0;
                _context9.next = 3;
                return this.gfs["delete"]((0, _mongodb.ObjectId)(photoId));

              case 3:
                return _context9.abrupt("return", {
                  success: true
                });

              case 6:
                _context9.prev = 6;
                _context9.t0 = _context9["catch"](0);
                console.error("Failed to delete photo from DB. ".concat(_context9.t0));
                return _context9.abrupt("return", {
                  error: _context9.t0
                });

              case 10:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this, [[0, 6]]);
      }));

      function deletePhoto(_x10) {
        return _deletePhoto.apply(this, arguments);
      }

      return deletePhoto;
    }()
  }]);
  return UserDAO;
}();

exports["default"] = UserDAO;
(0, _defineProperty2["default"])(UserDAO, "users", void 0);
(0, _defineProperty2["default"])(UserDAO, "gfs", void 0);