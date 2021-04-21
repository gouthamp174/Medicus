import { ObjectId } from "mongodb"


export default class PaymentDAO {
  static payments

  static async injectDB(conn) {
    if (this.payments) {
      return
    }

    try {
      this.payments = await conn.db(process.env.DB_NS).collection("payments", {
        writeConcern: { w: "majority" }
      })
    } catch (err) {
      console.error(`Failed to connect to DB in PaymentDAO: ${err}`)
    }
  }

  static async getPayments({filter={}, page=0, limit=10}) {
    try {
      const cursor = await this.payments.find(filter).skip(page*limit).limit(limit)
      return await cursor.toArray()
    } catch (err) {
      return []
    }
  }

  static async getPayment(id) {
    return await this.payments.findOne({ _id: ObjectId(id) })
  }

  static async addPayment({username, amount, date, appointmentId}) {
    try {
      const amountAsNumber = Number(amount)
      if (amountAsNumber === NaN) {
        throw new Error("Invalid input. Amount must be a number.")
      }

      const response = await this.payments.insertOne(
        {
          username: username,
          amount: amountAsNumber,
          date: new Date(date),
          appointmentId: appointmentId
        },
        {
          writeConcern: { w: "majority" }
        }
      )

      return { success: true, id: response.insertedId }
    } catch (err) {
      console.error(`Failed to add a new payment to DB. ${err}`);
      return { error: err }
    }
  }

  static async deletePayments(filter) {
    try {
      if (!filter || (filter && !Object.keys(filter).length)) {
        throw Error("No filter provided. Cannot delete all documents.")
      }

      await this.payments.deleteMany(
        filter,
        {
          writeConcern: { w: "majority" }
        }
      )

      return { success: true }
    } catch (err) {
      console.error(`Failed to delete payments from DB. ${err}`)
      return { error: err }
    }
  }

  static async deletePayment(id) {
    try {
      const response = await this.payments.deleteOne({ _id: ObjectId(id) })
      return { success: true }
    } catch (err) {
      console.error(`Failed to delete payment from DB. ${err}`)
      return { error: err }
    }
  }
}
