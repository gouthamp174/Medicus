"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _controller = _interopRequireDefault(require("./controller"));

var router = new _express.Router();
router.route('/').get(_controller.default.getAppointments).post(_controller.default.addAppointment);
router.route('/:id').get(_controller.default.getAppointment).put(_controller.default.updateAppointment).delete(_controller.default.deleteAppointment);
router.route('/:appointmentId/notes').get(_controller.default.getNotes).post(_controller.default.addNote);
router.route('/:appointmentId/notes/:id').delete(_controller.default.deleteNote);
router.route('/:appointmentId/payments').get(_controller.default.getPayments).post(_controller.default.addPayment);
router.route('/:appointmentId/payments/:id').delete(_controller.default.deletePayment);
router.route('/:appointmentId/medications').get(_controller.default.getMedications).post(_controller.default.addMedication);
router.route('/:appointmentId/medications/:id').delete(_controller.default.deleteMedication);
router.route('/:appointmentId/labReports').get(_controller.default.getReports).post(_controller.default.addReport);
router.route('/:appointmentId/labReports/:id').delete(_controller.default.deleteReport);
var _default = router;
exports.default = _default;