import { Router } from "express"
import AppointmentCtrl from "./controller"


const router = new Router()

router.route('/')
  .get(AppointmentCtrl.getAppointments)
  .post(AppointmentCtrl.addAppointment)

router.route('/:id')
  .get(AppointmentCtrl.getAppointment)
  .put(AppointmentCtrl.updateAppointment)
  .delete(AppointmentCtrl.deleteAppointment)

router.route('/:appointmentId/notes')
  .get(AppointmentCtrl.getNotes)
  .post(AppointmentCtrl.addNote)

router.route('/:appointmentId/notes/:id')
  .delete(AppointmentCtrl.deleteNote)

router.route('/:appointmentId/payments')
  .get(AppointmentCtrl.getPayments)
  .post(AppointmentCtrl.addPayment)

router.route('/:appointmentId/payments/:id')
  .delete(AppointmentCtrl.deletePayment)

router.route('/:appointmentId/medications')
  .get(AppointmentCtrl.getMedications)
  .post(AppointmentCtrl.addMedication)

router.route('/:appointmentId/medications/:id')
  .delete(AppointmentCtrl.deleteMedication)

router.route('/:appointmentId/labReports')
  .get(AppointmentCtrl.getReports)
  .post(AppointmentCtrl.addReport)

router.route('/:appointmentId/labReports/:id')
  .delete(AppointmentCtrl.deleteReport)

export default router;
