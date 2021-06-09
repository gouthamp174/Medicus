import { readFile } from "fs/promises"

import { ObjectId } from "mongodb"
import { HttpBadRequestError, HttpInternalServerError } from "../errors"

import { User, Session, Degree, Job, Service,
  Insurance, Payment, Medication, LabReport } from "../models"

import UserDAO from "../../dao/userDAO"
import DegreeDAO from "../../dao/degreeDAO"
import JobDAO from "../../dao/jobDAO"
import ServiceDAO from "../../dao/serviceDAO"
import InsuranceDAO from "../../dao/insuranceDAO"
import PaymentDAO from "../../dao/paymentDAO"
import LabReportDAO from "../../dao/labReportDAO"
import MedicationDAO from "../../dao/medicationDAO"

import { AppointmentApi } from "../appointmentApp/controller"


// This class defines all APIs that are not directly called by User router.
// It is done to factor out shared code that can be called by multiple router APIs.
export class UserApi {
  static async deleteUser(username, profilePhotoId) {
    try {
      const appointmentResponse = await AppointmentApi.deleteAppointments({ "patient.username": username })

      const insuranceResponse = await InsuranceDAO.deleteInsurances({ username: username })
      if (!insuranceResponse.success) {
        throw new HttpInternalServerError(insuranceResponse.error)
      }

      const serviceResponse = await ServiceDAO.deleteServices({ username: username })
      if (!serviceResponse.success) {
        throw new HttpInternalServerError(serviceResponse.error)
      }

      const paymentResponse = await PaymentDAO.deletePayments({ username: username })
      if (!paymentResponse.success) {
        throw new HttpInternalServerError(paymentResponse.error)
      }

      const jobResponse = await JobDAO.deleteJobs({ username: username })
      if (!jobResponse.success) {
        throw new HttpInternalServerError(jobResponse.error)
      }

      const degreeResponse = await DegreeDAO.deleteDegrees({ username: username })
      if (!degreeResponse.success) {
        throw new HttpInternalServerError(degreeResponse.error)
      }

      const photoResponse = await UserDAO.deletePhoto(profilePhotoId)
      if (!photoResponse.success) {
        throw new HttpInternalServerError(photoResponse.error)
      }

      const userResponse = await UserDAO.deleteUser(username)
      if (!userResponse.success) {
        throw new HttpInternalServerError(userResponse.error)
      }
    } catch (err) {
      throw(err)
    }
  }
}


// This class defines all middleware APIs that are directly called by User router.
export default class UserController {
  static async getUsers(req, res, next) {
    try {
      const view = (req.query.view) ? req.query.view: ""
      const search = (req.query.search !== undefined) ? req.query.search: null
      const page = (req.query.page) ? parseInt(req.query.page, 10): 0
      const limit = (req.query.limit) ? parseInt(req.query.limit, 10): 10

      let filter
      if (view === "patient") {
        filter = { isPhysician: false }
      } else {
        filter = { isPhysician: true }
      }

      let result
      if (search !== null) {
        if (search === "") {
          result = []
        } else {
          const queryRegex = new RegExp(search, 'i');
          const searchQuery = {
            $or: [
              { username: queryRegex },
              { fullName: queryRegex },
              { specialization: queryRegex }
            ]
          }

          result = await UserDAO.searchUsers({filter, searchQuery, page, limit})
        }
      } else {
        result = await UserDAO.getUsers({filter, page, limit})
      }

      res.json(result.map(item => {
        const user = new User(item)
        return user.toShortJson()
      }))
    } catch (err) {
      console.error(`Failed to get users. ${err}`);
      res.status(err.statusCode).json({message: err.message})
    }
  }

  static async getUser(req, res, next) {
    try {
      const username = req.params.username
      const result = await UserDAO.getUser(username)
      res.json(new User(result).toJson())
    } catch (err) {
      console.error(`Failed to get user: ${err}`)
      res.status(500).json({message: err.message})
    }
  }

  static async updateUser(req, res, next) {
    try {
      const username = req.params.username
      const updateInfo = req.body
      if (!updateInfo || (updateInfo && !Object.keys(updateInfo).length)) {
        throw new HttpBadRequestError("Invalid request. Bad input parameters.")
      }

      const notUpdatableFields = ["_id", "id", "username", "password", "isPhysician"]

      for (const field of notUpdatableFields) {
        if (updateInfo.hasOwnProperty(field)) {
          throw new HttpBadRequestError(`Invalid request. Cannot update field: '${field}'.`)
        }
      }

      if (updateInfo.dob) {
        updateInfo.dob = new Date(updateInfo.dob)
      }

      const updateResponse = await UserDAO.updateUser(username, updateInfo)
      if (!updateResponse.success) {
        throw new HttpInternalServerError(updateResponse.error)
      }

      res.json({ success: true })
    } catch (err) {
      console.error(`Failed to update user. ${err}`);
      res.status(err.statusCode).json({message: err.message})
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const username = req.params.username
      const session = req.session

      if (session.username !== username) {
        throw new HttpUnauthorizedError("Invalid request. Cannot delete another user account.")
      }

      const user = await UserDAO.getUser(username)
      if (!user || (user && !Object.keys(user).length)) {
        throw new HttpBadRequestError("Invalid request. Bad input parameters.")
      }

      await UserApi.deleteUser(user.username, user.profilePhoto)

      res.json({ success: true })
    } catch (err) {
      console.error(`Failed to delete user. ${err}`);
      res.status(err.statusCode).json({message: err.message})
    }
  }

  static async getPhoto(req, res, next) {
    try {
      const username = req.params.username
      const user = await UserDAO.getUser(username)
      if (!user || (user && !Object.keys(user).length)) {
        throw new HttpBadRequestError("Invalid request. Bad input parameters.")
      }

      const photoId = req.params.id
      const photoStream = await UserDAO.getPhoto(photoId)
      if (photoStream !== null) {
        photoStream.pipe(res)
      } else {
        res.redirect('/public/imgs/person.png')
      }
    } catch (err) {
      console.error(`Failed to get user photo. ${err}`);
      res.status(err.statusCode).json({message: err.message})
    }
  }

  static async addPhoto(req, res, next) {
    try {
      const username = req.params.username
      const addInfo = req.body

      try {
        const user = await UserDAO.getUser(username)
        if (!user || (user && !Object.keys(user).length)) {
          throw new HttpBadRequestError("Invalid request. Bad input parameters.")
        }

        const isProfilePhoto = addInfo.isProfilePhoto
        if (Boolean(isProfilePhoto)) {
          if (user.profilePhotoId) {
            const deleteResponse = await UserDAO.deletePhoto(user.profilePhotoId)
          }

          const response = await UserDAO.updateUser(username, { profilePhotoId: ObjectId(req.file.id) });
          if (!response.success) {
            throw new HttpInternalServerError(response.error)
          }
        }

        res.json({ success: true, id: req.file.id})

      } catch (err) {
        // Cleanup uploaded file.
        const deleteResponse = await UserDAO.deletePhoto(req.file.id)
        if (!deleteResponse.success) {
          throw new HttpInternalServerError(deleteResponse.error)
        }

        throw(err)
      }
    } catch (err) {
      console.error(`Failed to add user photo. ${err}`);
      res.status(500).json({message: err.message})
    }
  }

  static async deletePhoto(req, res, next) {
    try {
      const username = req.params.username
      const photoId = req.params.id

      const user = await UserDAO.getUser(username)
      if (!user || (user && !Object.keys(user).length)) {
        throw new HttpBadRequestError("Invalid request. Bad input parameters.")
      }

      const response = await UserDAO.deletePhoto(photoId)
      if (!response.success) {
        throw new HttpInternalServerError(response.error)
      }

      res.json({ success: true })
    } catch (err) {
      console.error(`Failed to delete user photo. ${err}`);
      res.status(err.statusCode).json({message: err.message})
    }
  }

  static async getDegrees(req, res, next) {
    try {
      const username = req.params.username
      const page = (req.query.page) ? parseInt(req.query.page, 10): 0
      const limit = (req.query.limit) ? parseInt(req.query.limit, 10): 10

      const user = await UserDAO.getUser(username)
      if (!user || (user && !Object.keys(user).length)) {
        throw new HttpBadRequestError("Invalid request. Bad input parameters.")
      }

      const filter = {
        username: username
      }

      const degrees = await DegreeDAO.getDegrees({filter: filter, page: page, limit: limit})
      res.json(degrees.map(item => {
        const degree = new Degree(item)
        return degree.toJson()
      }))
    } catch (err) {
      console.error(`Failed to get user degrees. ${err}`);
      res.status(err.statusCode).json({message: err.message})
    }
  }

  static async addDegree(req, res, next) {
    try {
      const degreeInfo = req.body;
      if (!degreeInfo || (degreeInfo && !Object.keys(degreeInfo).length)) {
        throw new Error("Invalid request. Bad input parameters.")
      }

      const username = req.params.username
      const user = await UserDAO.getUser(username)
      if (!user || (user && !Object.keys(user).length)) {
        throw new HttpBadRequestError("Invalid request. Bad input parameters.")
      }

      const response = await DegreeDAO.addDegree({
        username: username,
        degree: degreeInfo.degree,
        fromDate: new Date(degreeInfo.fromDate),
        toDate: new Date(degreeInfo.toDate),
        university: degreeInfo.university
      })
      if (!response.success) {
        throw new HttpInternalServerError(response.error)
      }

      res.status(201).json({ success: true, id: response.id })
    } catch (err) {
      console.error(`Failed to add user degree. ${err}`);
      res.status(err.statusCode).json({message: err.message})
    }
  }

  static async deleteDegree(req, res, next) {
    try {
      const username = req.params.username
      const degreeId = req.params.id

      const response = await DegreeDAO.deleteDegree(degreeId)
      if (!response.success) {
        throw new HttpInternalServerError(response.error)
      }

      res.json({ success: true })
    } catch (err) {
      console.error(`Failed to delete user degree. ${err}`);
      res.status(err.statusCode).json({message: err.message})
    }
  }

  static async getJobs(req, res, next) {
    try {
      const username = req.params.username
      const page = (req.query.page) ? parseInt(req.query.page, 10): 0
      const limit = (req.query.limit) ? parseInt(req.query.limit, 10): 10

      const user = await UserDAO.getUser(username)
      if (!user || (user && !Object.keys(user).length)) {
        throw new HttpBadRequestError("Invalid request. Bad input parameters.")
      }

      const filter = {
        username: username
      }

      const jobs = await JobDAO.getJobs({filter: filter, page: page, limit: limit})
      res.json(jobs.map(item => {
        const job = new Job(item)
        return job.toJson()
      }))
    } catch (err) {
      console.error(`Failed to get user jobs. ${err}`);
      res.status(err.statusCode).json({message: err.message})
    }
  }

  static async addJob(req, res, next) {
    try {
      const jobInfo = req.body;
      if (!jobInfo || (jobInfo && !Object.keys(jobInfo).length)) {
        throw new Error("Invalid request. Bad input parameters.")
      }

      const username = req.params.username
      const user = await UserDAO.getUser(username)
      if (!user || (user && !Object.keys(user).length)) {
        throw new HttpBadRequestError("Invalid request. Bad input parameters.")
      }

      const response = await JobDAO.addJob({
        username: username,
        title: jobInfo.title,
        fromDate: new Date(jobInfo.fromDate),
        toDate: new Date(jobInfo.toDate),
        company: jobInfo.company
      })
      if (!response.success) {
        throw new HttpInternalServerError(response.error)
      }

      res.status(201).json({ success: true, id: response.id })
    } catch (err) {
      console.error(`Failed to add user job. ${err}`);
      res.status(err.statusCode).json({message: err.message})
    }
  }

  static async deleteJob(req, res, next) {
    try {
      const username = req.params.username
      const jobId = req.params.id

      const response = await JobDAO.deleteJob(jobId)
      if (!response.success) {
        throw new HttpInternalServerError(response.error)
      }

      res.json({ success: true })
    } catch (err) {
      console.error(`Failed to delete user job. ${err}`);
      res.status(err.statusCode).json({message: err.message})
    }
  }

  static async getServices(req, res, next) {
    try {
      const username = req.params.username
      const page = (req.query.page) ? parseInt(req.query.page, 10): 0
      const limit = (req.query.limit) ? parseInt(req.query.limit, 10): 10

      const user = await UserDAO.getUser(username)
      if (!user || (user && !Object.keys(user).length)) {
        throw new HttpBadRequestError("Invalid request. Bad input parameters.")
      }

      const filter = {
        username: username
      }

      const services = await ServiceDAO.getServices({filter: filter, page: page, limit: limit, reverse: true})
      res.json(services.map(item => {
        const service = new Service(item)
        return service.toJson()
      }))
    } catch (err) {
      console.error(`Failed to get user services. ${err}`);
      res.status(err.statusCode).json({message: err.message})
    }
  }

  static async addService(req, res, next) {
    try {
      const serviceInfo = req.body;
      if (!serviceInfo || (serviceInfo && !Object.keys(serviceInfo).length)) {
        throw new Error("Invalid request. Bad input parameters.")
      }

      const username = req.params.username
      const user = await UserDAO.getUser(username)
      if (!user || (user && !Object.keys(user).length)) {
        throw new HttpBadRequestError("Invalid request. Bad input parameters.")
      }

      const rateAsNumber = Number(serviceInfo.rate)
      if (rateAsNumber === NaN || rateAsNumber < 0) {
        throw new HttpBadRequestError("Invalid request. Bad input parameters.")
      }

      const response = await ServiceDAO.addService({
        username: username,
        name: serviceInfo.name,
        rate: rateAsNumber
      })
      if (!response.success) {
        throw new HttpInternalServerError(response.error)
      }

      res.status(201).json({ success: true, id: response.id })
    } catch (err) {
      console.error(`Failed to add user service. ${err}`);
      res.status(err.statusCode).json({message: err.message})
    }
  }

  static async deleteService(req, res, next) {
    try {
      const username = req.params.username
      const serviceId = req.params.id

      const response = await ServiceDAO.deleteService(serviceId)
      if (!response.success) {
        throw new HttpInternalServerError(response.error)
      }

      res.json({ success: true })
    } catch (err) {
      console.error(`Failed to delete user service. ${err}`);
      res.status(err.statusCode).json({message: err.message})
    }
  }

  static async getInsurances(req, res, next) {
    try {
      const username = req.params.username
      const page = (req.query.page) ? parseInt(req.query.page, 10): 0
      const limit = (req.query.limit) ? parseInt(req.query.limit, 10): 10

      const user = await UserDAO.getUser(username)
      if (!user || (user && !Object.keys(user).length)) {
        throw new HttpBadRequestError("Invalid request. Bad input parameters.")
      }

      const filter = {
        username: username
      }

      const insurances = await InsuranceDAO.getInsurances({filter: filter, page: page, limit: limit})
      res.json(insurances.map(item => {
        const insurance = new Insurance(item)
        return insurance.toJson()
      }))
    } catch (err) {
      console.error(`Failed to get user insurances. ${err}`);
      res.status(err.statusCode).json({message: err.message})
    }
  }

  static async addInsurance(req, res, next) {
    try {
      const insuranceInfo = req.body;
      if (!insuranceInfo || (insuranceInfo && !Object.keys(insuranceInfo).length)) {
        throw new Error("Invalid request. Bad input parameters.")
      }

      const username = req.params.username
      const user = await UserDAO.getUser(username)
      if (!user || (user && !Object.keys(user).length)) {
        throw new HttpBadRequestError("Invalid request. Bad input parameters.")
      }

      const response = await InsuranceDAO.addInsurance({
        username: username,
        insuranceId: insuranceInfo.insuranceId,
        providerName: insuranceInfo.providerName,
        expiryDate: new Date(insuranceInfo.expiryDate)
      })
      if (!response.success) {
        throw new HttpInternalServerError(response.error)
      }

      res.status(201).json({ success: true, id: response.id })
    } catch (err) {
      console.error(`Failed to add user insurance. ${err}`);
      res.status(err.statusCode).json({message: err.message})
    }
  }

  static async deleteInsurance(req, res, next) {
    try {
      const username = req.params.username
      const insuranceId = req.params.id

      const response = await InsuranceDAO.deleteInsurance(insuranceId)
      if (!response.success) {
        throw new HttpInternalServerError(response.error)
      }

      res.json({ success: true })
    } catch (err) {
      console.error(`Failed to delete user insurance. ${err}`);
      res.status(err.statusCode).json({message: err.message})
    }
  }

  static async getPayments(req, res, next) {
    try {
      const username = req.params.username
      const page = (req.query.page) ? parseInt(req.query.page, 10): 0
      const limit = (req.query.limit) ? parseInt(req.query.limit, 10): 10

      const user = await UserDAO.getUser(username)
      if (!user || (user && !Object.keys(user).length)) {
        throw new HttpBadRequestError("Invalid request. Bad input parameters.")
      }

      const filter = {
        fromUsername: username
      }

      const payments = await PaymentDAO.getPayments({filter: filter, page: page, limit: limit})
      res.json(payments.map(item => {
        const payment = new Payment(item)
        return payment.toJson()
      }))
    } catch (err) {
      console.error(`Failed to get user payments. ${err}`);
      res.status(err.statusCode).json({message: err.message})
    }
  }

  static async getMedications(req, res, next) {
    try {
      const username = req.params.username
      const page = (req.query.page) ? parseInt(req.query.page, 10): 0
      const limit = (req.query.limit) ? parseInt(req.query.limit, 10): 10

      const user = await UserDAO.getUser(username)
      if (!user || (user && !Object.keys(user).length)) {
        throw new HttpBadRequestError("Invalid request. Bad input parameters.")
      }

      const filter = {
        toUsername: username
      }

      const medications = await MedicationDAO.getMedications({filter: filter, page: page, limit: limit, reverse: true})
      res.json(medications.map(item => {
        const medication = new Medication(item)
        return medication.toJson()
      }))
    } catch (err) {
      console.error(`Failed to get user medications. ${err}`);
      res.status(err.statusCode).json({message: err.message})
    }
  }

  static async getReports(req, res, next) {
    try {
      const username = req.params.username
      const page = (req.query.page) ? parseInt(req.query.page, 10): 0
      const limit = (req.query.limit) ? parseInt(req.query.limit, 10): 10

      const user = await UserDAO.getUser(username)
      if (!user || (user && !Object.keys(user).length)) {
        throw new HttpBadRequestError("Invalid request. Bad input parameters.")
      }

      const filter = {
        fromUsername: username
      }

      const labReports = await LabReportDAO.getLabReports({filter: filter, page: page, limit: limit, reverse: true})
      res.json(labReports.map(item => {
        const labReport = new LabReport(item)
        return labReport.toJson()
      }))
    } catch (err) {
      console.error(`Failed to get user reports. ${err}`);
      res.status(err.statusCode).json({message: err.message})
    }
  }
}
