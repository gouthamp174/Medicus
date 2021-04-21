import { ObjectId } from "mongodb"


export default class DegreeDAO {
  static degrees

  static async injectDB(conn) {
    if (this.degrees) {
      return
    }

    try {
      this.degrees = await conn.db(process.env.DB_NS).collection("degrees", {
        writeConcern: { w: "majority" }
      })
    } catch (err) {
      console.error(`Failed to connect to DB in DegreeDAO: ${err}`)
    }
  }

  static async getDegrees({filter={}, page=0, limit=10}) {
    try {
      const cursor = await this.degrees.find(filter).skip(page*limit).limit(limit)
      return await cursor.toArray()
    } catch (err) {
      return []
    }
  }

  static async getDegree(id) {
    return await this.degrees.findOne({ _id: ObjectId(id) })
  }

  static async addDegree({username, degree, fromDate, toDate, university}) {
    try {
      const response = await this.degrees.insertOne(
        {
          username: username,
          degree: degree,
          fromDate: new Date(fromDate),
          toDate: new Date(toDate),
          university: university
        },
        {
          writeConcern: { w: "majority" }
        }
      )

      return { success: true, id: response.insertedId }
    } catch (err) {
      console.error(`Failed to add a new degree to DB. ${err}`);
      return { error: err }
    }
  }

  static async deleteDegrees(filter) {
    try {
      if (!filter || (filter && !Object.keys(filter).length)) {
        throw Error("No filter provided. Cannot delete all documents.")
      }

      await this.degrees.deleteMany(
        filter,
        {
          writeConcern: { w: "majority" }
        }
      )

      return { success: true }
    } catch (err) {
      console.error(`Failed to delete degrees from DB. ${err}`)
      return { error: err }
    }
  }

  static async deleteDegree(id) {
    try {
      const response = await this.degrees.deleteOne({ _id: ObjectId(id) })
      return { success: true }
    } catch (err) {
      console.error(`Failed to delete degree from DB. ${err}`)
      return { error: err }
    }
  }
}
