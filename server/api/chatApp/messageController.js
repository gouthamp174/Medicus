import { ObjectId } from "mongodb"

import { HttpBadRequestError, HttpUnauthorizedError, HttpInternalServerError } from "../errors"

import UserDAO from "../../dao/userDAO"
import MessageDAO from "../../dao/messageDAO"
import { User, Message } from "../models"


export default class MessageController {
  static async getMessages(req, res, next) {
    try {
      const chatId = req.params.chatId
      const page = (req.query.page) ? parseInt(req.query.page, 10): 0
      const limit = (req.query.limit) ? parseInt(req.query.limit, 10): 10

      const filter = {
        chatId: ObjectId(chatId)
      }
      
      const result = await MessageDAO.getMessages({filter, page, limit})
      res.json(result.map(item => {
        const message = new Message(item)
        return message.toJson()
      }))
    } catch (err) {
      console.error(`Failed to get messages: ${err}`)
      res.status(500).json({message: err.message})
    }
  }

  static async getMessage(req, res, next) {
    try {
      const id = req.params.id
      const response = await MessageDAO.getMessage(id)

      if (response && Object.keys(response).length === 0) {
        res.json({})
      }

      res.json(new Message(response).toJson())
    } catch (err) {
      console.error(`Failed to get message: ${err}`)
      res.status(500).json({message: err.message})
    }
  }

  static async addMessage(req, res, next) {
    try {
      const messageInfo = req.body
      if (!messageInfo || (messageInfo && !Object.keys(messageInfo).length)) {
        throw new HttpBadRequestError("Invalid request. Bad input parameters.")
      }

      const chatId = req.params.chatId
      if (!chatId) {
        throw new HttpBadRequestError("Invalid request. Bad input parameters.")
      }

      const response = await MessageDAO.addMessage(
        {
          chatId: ObjectId(chatId),
          type: "user",
          sender: messageInfo.sender,
          timestamp: messageInfo.timestamp,
          content: messageInfo.content
        }
      )

      if (!response.success) {
        throw new HttpInternalServerError(response.error)
      }

      res.json({ success: true, id: response.id })
    } catch (err) {
      console.error(`Failed to add a new message. ${err}`);
      res.status(err.statusCode).json({message: err.message})
    }
  }

  static async deleteMessages(req, res, next) {
    try {
      const chatId = req.params.chatId
      if (!chatId) {
        throw new HttpBadRequestError("Invalid request. Bad input parameters.")
      }

      const response = await MessageDAO.deleteMessages(chatId)
      if (!response.success) {
        throw new HttpInternalServerError(response.error)
      }

      res.json({ success: true })
    } catch (err) {
      console.error(`Failed to delete all messages in chat. ${err}`);
      res.status(err.statusCode).json({message: err.message})
    }
  }

  static async deleteMessage(req, res, next) {
    try {
      const id = req.params.id
      if (!id) {
        throw new HttpBadRequestError("Invalid request. Bad input parameters.")
      }

      const response = await MessageDAO.deleteMessage(id)
      if (!response.success) {
        throw new HttpInternalServerError(response.error)
      }

      res.json({ success: true })
    } catch (err) {
      console.error(`Failed to delete message. ${err}`);
      res.status(err.statusCode).json({message: err.message})
    }
  }
}
