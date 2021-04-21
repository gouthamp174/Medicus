import { ObjectId } from "mongodb"


export default class NoteDAO {
  static notes

  static async injectDB(conn) {
    if (this.notes) {
      return
    }

    try {
      this.notes = await conn.db(process.env.DB_NS).collection("notes", {
        writeConcern: { w: "majority" }
      })
    } catch (err) {
      console.error(`Failed to connect to DB in NoteDAO: ${err}`)
    }
  }

  static async getNotes({filter={}, page=0, limit=10}) {
    try {
      const cursor = await this.notes.find(filter).skip(page*limit).limit(limit)
      return await cursor.toArray()
    } catch (err) {
      return []
    }
  }

  static async getNote(id) {
    return await this.notes.findOne({ _id: ObjectId(id) })
  }

  static async addNote({appointmentId, title, content, date}) {
    try {
      const response = await this.notes.insertOne(
        {
          appointmentId: ObjectId(appointmentId),
          title: title,
          content: content,
          date: new Date(date)
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

  static async deleteNotes(filter) {
    try {
      if (!filter || (filter && !Object.keys(filter).length)) {
        throw Error("No filter provided. Cannot delete all documents.")
      }

      await this.notes.deleteMany(
        filter,
        {
          writeConcern: { w: "majority" }
        }
      )

      return { success: true }
    } catch (err) {
      console.error(`Failed to delete notes from DB. ${err}`)
      return { error: err }
    }
  }

  static async deleteNote(id) {
    try {
      const response = await this.notes.deleteOne({ _id: ObjectId(id) })
      return { success: true }
    } catch (err) {
      console.error(`Failed to delete note from DB. ${err}`)
      return { error: err }
    }
  }
}
