import { ObjectId } from "mongodb"


export default class JobDAO {
  static jobs

  static async injectDB(conn) {
    if (this.jobs) {
      return
    }

    try {
      this.jobs = await conn.db(process.env.DB_NS).collection("jobs", {
        writeConcern: { w: "majority" }
      })
    } catch (err) {
      console.error(`Failed to connect to DB in JobDAO: ${err}`)
    }
  }

  static async getJobs({filter={}, page=0, limit=10}) {
    try {
      const cursor = await this.jobs.find(filter).skip(page*limit).limit(limit)
      return await cursor.toArray()
    } catch (err) {
      return []
    }
  }

  static async getJob(id) {
    return await this.jobs.findOne({ _id: ObjectId(id) })
  }

  static async addJob({username, title, fromDate, toDate, company}) {
    try {
      const response = await this.jobs.insertOne(
        {
          username: username,
          title: title,
          fromDate: new Date(fromDate),
          toDate: new Date(toDate),
          company: company
        },
        {
          writeConcern: { w: "majority" }
        }
      )

      return { success: true, id: response.insertedId }
    } catch (err) {
      console.error(`Failed to add a new job to DB. ${err}`);
      return { error: err }
    }
  }

  static async deleteJobs(filter) {
    try {
      if (!filter || (filter && !Object.keys(filter).length)) {
        throw Error("No filter provided. Cannot delete all documents.")
      }

      await this.jobs.deleteMany(
        filter,
        {
          writeConcern: { w: "majority" }
        }
      )

      return { success: true }
    } catch (err) {
      console.error(`Failed to delete jobs from DB. ${err}`)
      return { error: err }
    }
  }

  static async deleteJob(id) {
    try {
      const response = await this.jobs.deleteOne({ _id: ObjectId(id) })
      return { success: true }
    } catch (err) {
      console.error(`Failed to delete job from DB. ${err}`)
      return { error: err }
    }
  }
}
