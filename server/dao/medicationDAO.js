import { ObjectId } from "mongodb"


export default class MedicationDAO {
  static medications

  static async injectDB(conn) {
    if (this.medications) {
      return
    }

    try {
      this.medications = await conn.db(process.env.DB_NS).collection("medications", {
        writeConcern: { w: "majority" }
      })
    } catch (err) {
      console.error(`Failed to connect to DB in MedicationDAO: ${err}`)
    }
  }

  static async getMedications({filter={}, page=0, limit=10, reverse=false}) {
    try {
      const cursor = await this.medications
        .find(filter)
        .sort({_id: (reverse) ? -1 : 1 })
        .skip(page*limit)
        .limit(limit)
      return await cursor.toArray()
    } catch (err) {
      return []
    }
  }

  static async getMedication(id) {
    return await this.medications.findOne({ _id: ObjectId(id) })
  }

  static async addMedication({fromUsername, toUsername, appointmentId, name, dosage}) {
    try {
      const response = await this.medications.insertOne(
        {
          fromUsername: fromUsername,
          toUsername: toUsername,
          appointmentId: appointmentId,
          name: name,
          dosage: dosage
        },
        {
          writeConcern: { w: "majority" }
        }
      )

      return { success: true, id: response.insertedId }
    } catch (err) {
      console.error(`Failed to add a new medication to DB. ${err}`);
      return { error: err }
    }
  }

  static async deleteMedications(filter) {
    try {
      if (!filter || (filter && !Object.keys(filter).length)) {
        throw Error("No filter provided. Cannot delete all documents.")
      }

      await this.medications.deleteMany(
        filter,
        {
          writeConcern: { w: "majority" }
        }
      )

      return { success: true }
    } catch (err) {
      console.error(`Failed to delete medications from DB. ${err}`)
      return { error: err }
    }
  }

  static async deleteMedication(id) {
    try {
      const response = await this.medications.deleteOne({ _id: ObjectId(id) })
      return { success: true }
    } catch (err) {
      console.error(`Failed to delete medication from DB. ${err}`)
      return { error: err }
    }
  }
}
