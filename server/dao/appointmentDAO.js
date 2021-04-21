import { ObjectId } from "mongodb"
import ChatDAO from "./chatDAO"


export default class AppointmentDAO {
  static users
  static appointments
  static chats

  static async injectDB(conn) {
    if (this.users && this.appointments && this.chats) {
      return
    }

    try {
      this.users = await conn.db(process.env.DB_NS).collection("users", {
        writeConcern: { w: "majority" }
      })
      this.appointments = await conn.db(process.env.DB_NS).collection("appointments", {
        writeConcern: { w: "majority" }
      })
      this.chats = await conn.db(process.env.DB_NS).collection("chats", {
        writeConcern: { w: "majority" }
      })
    } catch (err) {
      console.error(`Failed to connect to DB in AppointmentDAO: ${err}`)
    }
  }

  static async getAppointments({filter=null, page=0, limit=10} = {}) {
    try {
      const cursor = await this.appointments.find(filter).sort({ "startTime": -1 })
        .skip(page*limit).limit(limit)
      return await cursor.toArray()
    } catch (err) {
      console.error(`Failed to retrieve appointments from DB. ${err}`)
      return []
    }
  }

  static async searchAppointments({filter=null, searchQuery=null, page=0, limit=10} = {}) {
    try {
      const cursor = await this.appointments
        .aggregate([
          {
            $match: filter
          },
          {
            $addFields: {
              patientFullName: {
                $concat: ["$patient.firstName", " ", "$patient.lastName"]
              },
              physicianFullName: {
                $concat: ["$physician.firstName", " ", "$physician.lastName"]
              }
            }
          }
        ])
        .match(searchQuery)
        .project({patientFullName: 0, physicianFullName: 0})
        .sort({ "startTime": -1 })
        .skip(page*limit)
        .limit(limit)

      return await cursor.toArray()
    } catch (err) {
      console.error(`Failed to search and retrieve appointments from DB. ${err}`)
      return []
    }
  }

  static async getAppointment(id) {
    try {
      return await this.appointments.findOne({ _id: ObjectId(id) })
    } catch (err) {
      console.error(`Failed to retrieve appointment in DB: ${err}`)
      return {}
    }
  }

  static async addAppointment({title, patient, physician, status, startTime, endTime,
    description, serviceName, serviceCharge, paymentBalance}) {
    try {
      const response = await this.appointments.insertOne(
        {
          title: title,
          patient: patient,
          physician: physician,
          status: status,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          description: description,
          serviceName: serviceName,
          serviceCharge: serviceCharge,
          paymentBalance: paymentBalance
        },
        {
          writeConcern: { w: "majority" }
        }
      )

      return { success: true, id: response.insertedId }
    } catch (err) {
      console.error(`Failed to add a new appointment to DB. ${err}`);
      return { error: err }
    }
  }

  static async deleteAppointment(id) {
    try {
      await this.appointments.deleteOne({ _id: ObjectId(id) })
      return { success: true }
    } catch (err) {
      console.error(`Failed to delete appointment from DB. ${err}`);
      return { error: err }
    }
  }

  static async updateAppointment(id, updateQuery) {
    try {
      const response = await this.appointments.updateOne(
        { _id: ObjectId(id) },
        {
          $set: { ...updateQuery }
        }
      )

      if (response.matchedCount === 0) {
        throw new Error("No appointment found with that ID.")
      }

      return { success: true }
    } catch (err) {
      console.error(`Failed to update appointment in DB. ${err}`);
      return { error: err }
    }
  }
}
