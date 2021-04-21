import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { UnauthorizedError } from "./errors"


export class User {
  constructor(userInfo = {}) {
    this.info = userInfo
  }

  toShortJson() {
    if (!this.info || (this.info && !Object.keys(this.info).length)) {
      return {}
    }

    const { username, firstName, lastName, isPhysician, profilePhotoId } = this.info
    return {
      username: username,
      firstName: firstName,
      lastName: lastName,
      isPhysician: isPhysician,
      profilePhotoId: profilePhotoId }
  }

  toJson() {
    if (!this.info || (this.info && !Object.keys(this.info).length)) {
      return {}
    }

    const { _id, password, detailsId, ...otherInfo } = this.info
    return { ...otherInfo }
  }

  async comparePassword(plainText) {
    return await bcrypt.compare(plainText, this.info.password)
  }
}


export class Session {
  constructor(sessionInfo={}) {
    this.info = sessionInfo
  }

  toJson() {
    try {
      if (!this.info || (this.info && !Object.keys(this.info).length)) {
        return {}
      }

      const { _id, ...otherInfo } = this.info
      return { id: this.id, ...otherInfo }
    } catch (err) {
      return {}
    }
  }

  async encoded() {
    try {
      if (!this.info || (this.info && !Object.keys(this.info).length)) {
        throw Error()
      }

      const { _id, username, startTime } = this.info
      return jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
          id: _id,
          username: username,
          startTime: startTime.toISOString()
        },
        process.env.DB_SECRET_KEY
      )

    } catch (err) {
      throw Error(`Failed to encode. Invalid session. ${err}`)
    }
  }

  static async decoded(encodedInfo) {
    try {
      return jwt.verify(encodedInfo, process.env.DB_SECRET_KEY)
    } catch (err) {
      throw new UnauthorizedError(`Failed to decode. ${err}`)
    }
  }
}


export class Degree {
  constructor(degreeInfo= {}) {
    this.info = degreeInfo
  }

  toJson() {
    if (!this.info || (this.info && !Object.keys(this.info).length)) {
      return {}
    }

    const {_id, ...otherInfo} = this.info
    return { id: _id, ...otherInfo }
  }
}


export class Job {
  constructor(jobInfo = {}) {
    this.info = jobInfo
  }

  toJson() {
    if (!this.info || (this.info && !Object.keys(this.info).length)) {
      return {}
    }

    const {_id, ...otherInfo} = this.info
    return { id: _id, ...otherInfo }
  }
}


export class Service {
  constructor(serviceInfo = {}) {
    this.info = serviceInfo
  }

  toJson() {
    if (!this.info || (this.info && !Object.keys(this.info).length)) {
      return {}
    }

    const {_id, ...otherInfo} = this.info
    return { id: _id, ...otherInfo }
  }
}


export class Insurance {
  constructor(insuranceInfo = {}) {
    this.info = insuranceInfo
  }

  toJson() {
    if (!this.info || (this.info && !Object.keys(this.info).length)) {
      return {}
    }

    const {_id, ...otherInfo} = this.info
    return { id: _id, ...otherInfo }
  }
}


export class Payment {
  constructor(paymentInfo = {}) {
    this.info = paymentInfo
  }

  toJson() {
    if (!this.info || (this.info && !Object.keys(this.info).length)) {
      return {}
    }

    const {_id, ...otherInfo} = this.info
    return { id: _id, ...otherInfo }
  }
}


// Models for appointmentApp
export class Appointment {
  constructor(appointmentInfo = {}) {
    this.info = appointmentInfo
  }

  toShortJson() {
    if (!this.info || (this.info && !Object.keys(this.info).length)) {
      return {}
    }

    const { _id, title, startTime, endTime } = this.info
    return { id: _id, title: title, startTime: startTime, endTime: endTime }
  }

  toJson() {
    if (!this.info || (this.info && !Object.keys(this.info).length)) {
      return {}
    }

    const { _id, ...otherInfo } = this.info
    return { id: _id, ...otherInfo }
  }
}


export class Note {
  constructor(noteInfo = {}) {
    this.info = noteInfo
  }

  toJson() {
    if (!this.info || (this.info && !Object.keys(this.info).length)) {
      return {}
    }

    const { _id, ...otherInfo } = this.info
    return { id: _id, ...otherInfo }
  }
}


export class Medication {
  constructor(medicationInfo = {}) {
    this.info = medicationInfo
  }

  toJson() {
    if (!this.info || (this.info && !Object.keys(this.info).length)) {
      return {}
    }

    const {_id, ...otherInfo} = this.info
    return { id: _id, ...otherInfo }
  }
}


export class LabReport {
  constructor(labReportInfo = {}) {
    this.info = labReportInfo
  }

  toJson() {
    if (!this.info || (this.info && !Object.keys(this.info).length)) {
      return {}
    }

    const {_id, ...otherInfo} = this.info
    return { id: _id, ...otherInfo }
  }
}


// Models for chatApp
export class Chat {
  constructor(chatInfo = {}) {
    this.info = chatInfo
  }

  toJson() {
    if (!this.info || (this.info && !Object.keys(this.info).length)) {
      return {}
    }

    const { _id, ...otherInfo } = this.info
    return { id: _id, ...otherInfo }
  }
}


export class Message {
  constructor(messageInfo = {}) {
    this.info = messageInfo
  }

  toJson() {
    if (!this.info || (this.info && !Object.keys(this.info).length)) {
      return {}
    }

    const { _id, ...otherInfo } = this.info
    return { id: _id, ...otherInfo }
  }
}
