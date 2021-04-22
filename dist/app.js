"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _express = _interopRequireDefault(require("express"));

var _http = _interopRequireDefault(require("http"));

var _cors = _interopRequireDefault(require("cors"));

var _helmet = _interopRequireDefault(require("helmet"));

var _socket = _interopRequireDefault(require("socket.io"));

var _mongodb = require("mongodb");

var _userSchema = _interopRequireDefault(require("./schema/userSchema.js"));

var _sessionSchema = _interopRequireDefault(require("./schema/sessionSchema.js"));

var _appointmentSchema = _interopRequireDefault(require("./schema/appointmentSchema.js"));

var _chatSchema = _interopRequireDefault(require("./schema/chatSchema.js"));

var _messageSchema = _interopRequireDefault(require("./schema/messageSchema.js"));

var _userDAO = _interopRequireDefault(require("./dao/userDAO"));

var _sessionDAO = _interopRequireDefault(require("./dao/sessionDAO"));

var _appointmentDAO = _interopRequireDefault(require("./dao/appointmentDAO"));

var _chatDAO = _interopRequireDefault(require("./dao/chatDAO"));

var _messageDAO = _interopRequireDefault(require("./dao/messageDAO"));

var _degreeDAO = _interopRequireDefault(require("./dao/degreeDAO"));

var _jobDAO = _interopRequireDefault(require("./dao/jobDAO"));

var _serviceDAO = _interopRequireDefault(require("./dao/serviceDAO"));

var _insuranceDAO = _interopRequireDefault(require("./dao/insuranceDAO"));

var _paymentDAO = _interopRequireDefault(require("./dao/paymentDAO"));

var _labReportDAO = _interopRequireDefault(require("./dao/labReportDAO"));

var _medicationDAO = _interopRequireDefault(require("./dao/medicationDAO"));

var _noteDAO = _interopRequireDefault(require("./dao/noteDAO"));

var _middlewares = require("./middlewares");

var _appRouter = _interopRequireDefault(require("./api/appRouter"));

var _chatInterface = _interopRequireDefault(require("./api/chatApp/chatInterface"));

_dotenv["default"].config(); // Setting up express & must use middleware


var app = (0, _express["default"])();
app.use((0, _cors["default"])());
app.use(_express["default"].json());
app.set('trust proxy', 1); // When using something like nginx or apache as a proxy

app.use((0, _helmet["default"])({
  contentSecurityPolicy: {
    directives: {
      "default-src": ["'self'", "*.bootstrapcdn.com", "*.googleapis.com", "*.gstatic.com"],
      "script-src": ["'self'", "*.bootstrapcdn.com", "*.cloudflare.com", "*.jquery.com", "*.googleapis.com"],
      "img-src": ["'self'", "data:", "blob:", "*.w3.org"]
    }
  }
})); // Adds extra security
// Custom Middleware

app.use(_middlewares.notFound);
app.use(_middlewares.errorHandler);
app.use('/public', _express["default"]["static"](__dirname + '/../public/'));
app.use('/api', _appRouter["default"]); // Basic Routing

app.get('/robots.txt', function (req, res) {
  return res.sendFile('robots.txt', {
    root: __dirname
  });
});
app.get('*', function (req, res) {
  return res.sendFile('index.html', {
    root: __dirname + '/../public/'
  });
}); // Establish a new connection to DB.

_mongodb.MongoClient.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 100,
  writeConcern: {
    wtimeout: 2500
  }
})["catch"](function (err) {
  console.error(err.stack);
  process.exit(1);
}).then( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(client) {
    var port, httpServer, io, server;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _userSchema["default"])(client);

          case 3:
            _context.next = 5;
            return (0, _sessionSchema["default"])(client);

          case 5:
            _context.next = 7;
            return (0, _appointmentSchema["default"])(client);

          case 7:
            _context.next = 9;
            return (0, _chatSchema["default"])(client);

          case 9:
            _context.next = 11;
            return (0, _messageSchema["default"])(client);

          case 11:
            _context.next = 16;
            break;

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](0);
            console.error("Failed to add collections to DB. ".concat(_context.t0));

          case 16:
            _context.prev = 16;
            _context.next = 19;
            return _userDAO["default"].injectDB(client);

          case 19:
            _context.next = 21;
            return _sessionDAO["default"].injectDB(client);

          case 21:
            _context.next = 23;
            return _appointmentDAO["default"].injectDB(client);

          case 23:
            _context.next = 25;
            return _chatDAO["default"].injectDB(client);

          case 25:
            _context.next = 27;
            return _messageDAO["default"].injectDB(client);

          case 27:
            _context.next = 29;
            return _degreeDAO["default"].injectDB(client);

          case 29:
            _context.next = 31;
            return _jobDAO["default"].injectDB(client);

          case 31:
            _context.next = 33;
            return _serviceDAO["default"].injectDB(client);

          case 33:
            _context.next = 35;
            return _insuranceDAO["default"].injectDB(client);

          case 35:
            _context.next = 37;
            return _paymentDAO["default"].injectDB(client);

          case 37:
            _context.next = 39;
            return _labReportDAO["default"].injectDB(client);

          case 39:
            _context.next = 41;
            return _medicationDAO["default"].injectDB(client);

          case 41:
            _context.next = 43;
            return _noteDAO["default"].injectDB(client);

          case 43:
            _context.next = 48;
            break;

          case 45:
            _context.prev = 45;
            _context.t1 = _context["catch"](16);
            console.error("Failed to initialize DAO layer. ".concat(_context.t1));

          case 48:
            // Setting up node js server
            port = process.env.PORT || 3003;
            httpServer = _http["default"].createServer(app);
            io = (0, _socket["default"])(httpServer, {});
            io.on('connection', function (socket) {
              _chatInterface["default"].register(io, socket);
            });
            server = httpServer.listen(port, function () {
              console.log("Server running on port ".concat(port, "..."));
            });

          case 53:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 13], [16, 45]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());