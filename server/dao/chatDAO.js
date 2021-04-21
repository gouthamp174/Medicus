import { ObjectId } from "mongodb"


export default class ChatDAO {
  static chats
  static messages

  static async injectDB(conn) {
    if (this.chats && this.messages) {
      return
    }

    try {
      this.chats = await conn.db(process.env.DB_NS).collection("chats", {
        writeConcern: { w: "majority" }
      })
      this.messages = await conn.db(process.env.DB_NS).collection("messages", {
        writeConcern: { w: "majority" }
      })
    } catch (err) {
      console.error(`Failed to connect to DB in ChatDAO: ${err}`)
    }
  }

  static async getChats({filter={}, page=0, limit=10} = {}) {
    try {
      const cursor = await this.chats.find(filter).sort({"startTime": -1}).skip(page*limit).limit(limit)
      return cursor.toArray()
    } catch (err) {
      console.error(`Failed to retrieve chats from DB. ${err}`);
      return []
    }
  }

  static async getChat(id) {
    try {
      return await this.chats.findOne({ _id: ObjectId(id) })
    } catch (err) {
      console.error(`Failed to retrieve chat from DB: ${err}`)
      return {}
    }
  }

  static async addChat({title, host, members, activeMembers, startTime, appointmentId=null}) {
    try {
      if (host.username) {
        members.push(host.username)
      }

      const result = await this.chats.insertOne(
        {
          title: title,
          host: host,
          members: members,
          activeMembers: (activeMembers) ? activeMembers: [],
          startTime: new Date(startTime),
          appointmentId: (appointmentId) ? ObjectId(appointmentId): null
        },
        {
          writeConcern: { w: "majority" }
        }
      )

      return {success: true, id: result.insertedId}
    } catch (err) {
      console.error(`Failed to add new chat to DB. ${err}`)
      return { error: err}
    }
  }

  static async deleteChat(id) {
    try {
      await this.chats.deleteOne({ _id: ObjectId(id) })
      return { success: true }
    } catch (err) {
      console.error(`Failed to delete chat from DB. ${err}`);
      return { error: err }
    }
  }

  static async addActiveMember({chatId, username}) {
    try {
      const result = await this.chats.updateOne(
        { _id: ObjectId(chatId) },
        {
          $push: {
            activeMembers: username
          }
        }
      )

      return {success: true}
    } catch (err) {
      console.error(`Failed to add a new active member to DB. ${err}`)
      return { error: err}
    }
  }

  static async deleteActiveMember({chatId, username}) {
    try {
      const result = await this.chats.updateOne(
        { _id: ObjectId(chatId) },
        {
          $pull: {
            activeMembers: username
          }
        }
      )

      return {success: true}
    } catch (err) {
      console.error(`Failed to delete active member from DB. ${err}`)
      return { error: err}
    }
  }
}
