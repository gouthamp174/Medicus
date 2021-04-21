import { ObjectId } from "mongodb"


export default class SessionDAO {
  static sessions

  static async injectDB(conn) {
    if (this.sessions) {
      return
    }

    try {
      this.sessions = await conn.db(process.env.DB_NS).collection("sessions", {
        writeConcern: { w: "majority" }
      })
    } catch (err) {
      console.error(`Failed to connect to DB in SessionDAO: ${err}`)
    }
  }

  static async getSession(id) {
    try {
      return await this.sessions.findOne({ _id: ObjectId(id) })
    } catch (err) {
      console.error(`Failed to retrieve session from DB. ${err}`)
      return {}
    }
  }

  static async addSession(username, startTime) {
    try {
      const response = await this.sessions.insertOne(
        {
          username: username,
          startTime: new Date(startTime)
        },
        {
          writeConcern: { w: "majority" }
        }
      );


      return { success: true, id: response.insertedId }
    } catch (err) {
      console.error(`Failed to add a new session to DB. ${err}`)
      return { error: err }
    }
  }

  static async deleteSession(id) {
    try {
      await this.sessions.deleteOne({ _id: ObjectId(id) })
      return { success: true }
    } catch (err) {
      console.error(`Failed to delete session from DB. ${err}`)
      return { error: err }
    }
  }
}
