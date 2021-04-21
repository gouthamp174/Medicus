import { ObjectId } from "mongodb"


export default class InsuranceDAO {
  static insurances

  static async injectDB(conn) {
    if (this.insurances) {
      return
    }

    try {
      this.insurances = await conn.db(process.env.DB_NS).collection("insurances", {
        writeConcern: { w: "majority" }
      })
    } catch (err) {
      console.error(`Failed to connect to DB in InsuranceDAO: ${err}`)
    }
  }

  static async getInsurances({filter={}, page=0, limit=10}) {
    try {
      const cursor = await this.insurances.find(filter).skip(page*limit).limit(limit)
      return await cursor.toArray()
    } catch (err) {
      return []
    }
  }

  static async getInsurance(id) {
    return await this.insurances.findOne({ _id: ObjectId(id) })
  }

  static async addInsurance({username, insuranceId, providerName, expiryDate}) {
    try {
      const response = await this.insurances.insertOne(
        {
          username: username,
          insuranceId: insuranceId,
          providerName: providerName,
          expiryDate: new Date(expiryDate)
        },
        {
          writeConcern: { w: "majority" }
        }
      )

      return { success: true, id: response.insertedId }
    } catch (err) {
      console.error(`Failed to add a new insurance to DB. ${err}`);
      return { error: err }
    }
  }

  static async deleteInsurances(filter) {
    try {
      if (!filter || (filter && !Object.keys(filter).length)) {
        throw Error("No filter provided. Cannot delete all documents.")
      }

      await this.insurances.deleteMany(
        filter,
        {
          writeConcern: { w: "majority" }
        }
      )

      return { success: true }
    } catch (err) {
      console.error(`Failed to delete insurances from DB. ${err}`)
      return { error: err }
    }
  }

  static async deleteInsurance(id) {
    try {
      const response = await this.insurances.deleteOne({ _id: ObjectId(id) })
      return { success: true }
    } catch (err) {
      console.error(`Failed to delete insurance from DB. ${err}`)
      return { error: err }
    }
  }
}
