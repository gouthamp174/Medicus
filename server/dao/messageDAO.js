import { ObjectId } from "mongodb"


export default class MessageDAO {
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
      console.error(`Failed to connect to DB in MessageDAO: ${err}`)
    }
  }

  static async getMessages({filter={}, page=0, limit=10} = {}) {
    try {
      const cursor = await this.messages.find(filter).sort({"timestamp": -1}).skip(page*limit).limit(limit)
      return cursor.toArray()
    } catch (err) {
      console.error(`Failed to retrieve chat messages from DB. ${err}`);
      return []
    }
  }

  static async getMessage(id) {
    try {
      return await this.messages.findOne({ _id: ObjectId(id) })
    } catch (err) {
      console.error(`Failed to retrieve chat message from DB: ${err}`)
      return {}
    }
  }

  static async addMessage({chatId, type, sender, timestamp, content}) {
    try {
      const result = await this.messages.insertOne(
        {
          chatId: ObjectId(chatId),
          type: type,
          sender: sender,
          timestamp: new Date(timestamp),
          content: content
        },
        {
          writeConcern: { w: "majority" }
        }
      )

      return {success: true, id: result.insertedId}
    } catch (err) {
      console.error(`Failed to add chat message to DB: ${chatId}. ${err}`)
      return { error: err }
    }
  }

  static async deleteMessages(filter) {
    try {
      if (!filter || (filter && !Object.keys(filter).length)) {
        throw Error("No filter provided. Cannot delete all documents.")
      }

      await this.messages.deleteMany(
        filter,
        {
          writeConcern: { w: "majority" }
        }
      )

      return { success: true }
    } catch (err) {
      console.error(`Failed to delete chat messages from DB. ${err}`)
      return { error: err }
    }
  }

  static async deleteMessage(id) {
    try {
      await this.messages.deleteOne({
        _id: ObjectId(id)
      })

      return { success: true }
    } catch (err) {
      console.error(`Failed to delete chat message from DB. ${err}`)
      return { error: err }
    }
  }
}
