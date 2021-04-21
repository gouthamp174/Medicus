import { ObjectId, Binary } from "mongodb"


export default class LabReportDAO {
  static labReports

  static async injectDB(conn) {
    if (this.labReports) {
      return
    }

    try {
      this.labReports = await conn.db(process.env.DB_NS).collection("lab_reports", {
        writeConcern: { w: "majority" }
      })
    } catch (err) {
      console.error(`Failed to connect to DB in LabReportDAO: ${err}`)
    }
  }

  static async getLabReports({filter={}, page=0, limit=10}) {
    try {
      const cursor = await this.labReports.find(filter).skip(page*limit).limit(limit)
      return await cursor.toArray()
    } catch (err) {
      return []
    }
  }

  static async getLabReport(id) {
    return await this.labReports.findOne({ _id: ObjectId(id) })
  }

  static async addLabReport({username, name, date, appointmentId}) {
    try {
      const response = await this.labReports.insertOne(
        {
          username: username,
          name: name,
          date: new Date(date),
          appointmentId: ObjectId(appointmentId)
        },
        {
          writeConcern: { w: "majority" }
        }
      )

      return { success: true, id: response.insertedId }
    } catch (err) {
      console.error(`Failed to add a new lab report to DB. ${err}`);
      return { error: err }
    }
  }

  static async deleteLabReports(filter) {
    try {
      if (!filter || (filter && !Object.keys(filter).length)) {
        throw Error("No filter provided. Cannot delete all documents.")
      }

      await this.labReports.deleteMany(
        filter,
        {
          writeConcern: { w: "majority" }
        }
      )

      return { success: true }
    } catch (err) {
      console.error(`Failed to delete lab reports from DB. ${err}`)
      return { error: err }
    }
  }

  static async deleteLabReport(id) {
    try {
      const response = await this.labReports.deleteOne({ _id: ObjectId(id) })
      return { success: true }
    } catch (err) {
      console.error(`Failed to delete lab report from DB. ${err}`)
      return { error: err }
    }
  }
}
