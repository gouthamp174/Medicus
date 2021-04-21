import { ObjectId } from "mongodb"


export default class ServiceDAO {
  static services

  static async injectDB(conn) {
    if (this.services) {
      return
    }

    try {
      this.services = await conn.db(process.env.DB_NS).collection("services", {
        writeConcern: { w: "majority" }
      })
    } catch (err) {
      console.error(`Failed to connect to DB in ServiceDAO: ${err}`)
    }
  }

  static async getServices({filter={}, page=0, limit=10}) {
    try {
      const cursor = await this.services.find(filter).skip(page*limit).limit(limit)
      return await cursor.toArray()
    } catch (err) {
      return []
    }
  }

  static async getService(id) {
    return await this.services.findOne({ _id: ObjectId(id) })
  }

  static async addService({username, name, rate}) {
    try {
      const rateAsNumber = Number(rate)
      if (rateAsNumber === NaN) {
        throw new Error("Invalid input. Rate must be a number.")
      }

      const response = await this.services.insertOne(
        {
          username: username,
          name: name,
          rate: rateAsNumber
        },
        {
          writeConcern: { w: "majority" }
        }
      )

      return { success: true, id: response.insertedId }
    } catch (err) {
      console.error(`Failed to add a new service to DB. ${err}`);
      return { error: err }
    }
  }

  static async deleteServices(filter) {
    try {
      if (!filter || (filter && !Object.keys(filter).length)) {
        throw Error("No filter provided. Cannot delete all documents.")
      }

      await this.services.deleteMany(
        filter,
        {
          writeConcern: { w: "majority" }
        }
      )

      return { success: true }
    } catch (err) {
      console.error(`Failed to delete services from DB. ${err}`)
      return { error: err }
    }
  }

  static async deleteService(id) {
    try {
      const response = await this.services.deleteOne({ _id: ObjectId(id) })
      return { success: true }
    } catch (err) {
      console.error(`Failed to delete service from DB. ${err}`)
      return { error: err }
    }
  }
}
