"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userRouter = exports.authRouter = void 0;

var _express = require("express");

var _userController = _interopRequireDefault(require("./userController"));

var _authController = _interopRequireDefault(require("./authController"));

var _storage = _interopRequireDefault(require("../../storage"));

var authRouter = new _express.Router();
exports.authRouter = authRouter;
var userRouter = new _express.Router(); // Authentication Router

exports.userRouter = userRouter;
authRouter.route('/register').post(_authController.default.register);
authRouter.route('/signin').post(_authController.default.signIn);
authRouter.route('/signout').get(_authController.default.signOut);
authRouter.route('/password').put(_authController.default.updatePassword); // User Router

userRouter.route('/').get(_userController.default.getUsers);
userRouter.route('/:username').get(_userController.default.getUser).delete(_userController.default.deleteUser).put(_userController.default.updateUser);
userRouter.route('/:username/photos').post(_storage.default.single("data"), _userController.default.addPhoto);
userRouter.route('/:username/photos/:id').get(_userController.default.getPhoto).delete(_userController.default.deletePhoto);
userRouter.route('/:username/degrees').get(_userController.default.getDegrees).post(_userController.default.addDegree);
userRouter.route('/:username/degrees/:id').delete(_userController.default.deleteDegree);
userRouter.route('/:username/jobs').get(_userController.default.getJobs).post(_userController.default.addJob);
userRouter.route('/:username/jobs/:id').delete(_userController.default.deleteJob);
userRouter.route('/:username/services').get(_userController.default.getServices).post(_userController.default.addService);
userRouter.route('/:username/services/:id').delete(_userController.default.deleteService);
userRouter.route('/:username/insurances').get(_userController.default.getInsurances).post(_userController.default.addInsurance);
userRouter.route('/:username/insurances/:id').delete(_userController.default.deleteInsurance);
userRouter.route('/:username/payments').get(_userController.default.getPayments);
userRouter.route('/:username/labReports').get(_userController.default.getReports);
userRouter.route('/:username/medications').get(_userController.default.getMedications); // router.get('/user/:username', utils.limiter, utils.speedLimiter, authCtrl.getUser);
// router.use('/example-path', example); ==> to be routed to: api/chosen_path for example