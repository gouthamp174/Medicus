import socketIO from "socket.io"
import MessageDAO from "../../dao/messageDAO"


export default class ChatInterface {
  static io

  static async register(io, socket) {
    try {
      this.io = io

      socket.on('disconnect', ChatInterface.disconnect)
      socket.on('disconnecting', ChatInterface.disconnecting)
      socket.on('join', ChatInterface.join)
      socket.on('leave', ChatInterface.leave)
      socket.on('chat', ChatInterface.receive)

    } catch (err) {
      console.log(`Failed to register chat interface callbacks. ${err}`)
    }
  }

  static async join(data, callback) {
    try {
      this.join(data.chatId)
      this.chatId = data.chatId

      callback({
        status: "ok"
      });
    } catch (err) {
      console.error(`Failed to join chat. ${err}`)
    }
  }

  static async leave(data, callback) {
    try {
      this.leave(data.chatId)
      this.chatId = null
      
      callback({
        status: "ok"
      });
    } catch (err) {
      console.error(`Failed to leave chat. ${err}`)
    }
  }

  static async disconnect(reason) {
    console.log(`Client is diconnecting. ${reason}`)
  }

  static async disconnecting(reason) {
    try {
      console.log(`Disconnecting from rooms. ${reason}`)

      for (const room of this.rooms) {
        if (room === this.chatId) {
          //socket.to(room).emit("user has left", socket.id);
          this.leave(this.chatId)
        }
      }
    } catch (err) {
      console.error(`Failed to leave room while disconnecting.`)
    }
  }

  static async receive(data) {
    try {
      const addResponse = await MessageDAO.addMessage({
        chatId: data.chatId,
        type: "user",
        sender: data.sender,
        timestamp: data.timestamp,
        content: data.content
      })

      if (!addResponse.success) {
        throw new Error(`Failed to add message to DB. ${addResponse.error}`)
      }

      const message = await MessageDAO.getMessage(addResponse.id)

      ChatInterface.io.in(this.chatId).emit("chat", message)
    } catch (err) {
      console.error(`Failed to store message and resend it back to chat room.`)
    }
  }
}
