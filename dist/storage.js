"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

var util = require('util');

var multer = require("multer");

var GridFsStorage = require("multer-gridfs-storage");

_dotenv.default.config();

var storage = new GridFsStorage({
  url: process.env.DB_URI,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  file: function file(req, _file) {
    var fileTypes = ["image/png", "image/jpeg"];

    if (fileTypes.indexOf(_file.mimetype) !== -1) {
      // Required image type.
      return {
        bucketName: "photos",
        filename: "".concat(Date.now(), "-").concat(_file.originalname)
      };
    } else {
      // regular file type.
      return "".concat(Date.now(), "-").concat(_file.originalname);
    }
  }
});
var FileUploader = multer({
  storage: storage,
  limits: {
    fileSize: 2097152
  }
});
var _default = FileUploader;
exports.default = _default;