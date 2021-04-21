import { ObjectId } from "mongodb"

import { HttpBadRequestError, HttpUnauthorizedError, HttpInternalServerError } from "../errors"

import UserDAO from "../../dao/userDAO"
import ChatDAO from "../../dao/chatDAO"
import MessageDAO from "../../dao/messageDAO"
import { User, Appointment, Chat } from "../models"


// This class defines all APIs that are not directly called by Chat router.
// It is done to factor out shared code that can be called by multiple router APIs.
export class ChatApi {
  static async deleteChat(chatId) {
    try {
      const messageResponse = await MessageDAO.deleteMessages({ chatId: chatId })
      if (!messageResponse.success) {
        throw new HttpInternalServerError(messageResponse.error)
      }

      const chatResponse = await ChatDAO.deleteChat(chatId)
      if (!chatResponse.success) {
        throw new HttpInternalServerError(chatResponse.error)
      }
    } catch (err) {
      throw(err)
    }
  }
}


// This class defines all middleware APIs that are directly called by Chat router.
export default class ChatController {
  static async getChats(req, res, next) {
    try {
      const view = (req.query.view) ? req.query.view: ""
      const page = (req.query.page) ? parseInt(req.query.page, 10): 0
      const limit = (req.query.limit) ? parseInt(req.query.limit, 10): 10

      const result = await ChatDAO.getChats({filter: {}, page, limit})
      res.json(result.map(item => {
        const chat = new Chat(item)
        return chat.toJson()
      }))
    } catch (err) {
      console.error(`Failed to get chats: ${err}`)
      res.status(500).json({message: err.message})
    }
  }

  static async getChat(req, res, next) {
    try {
      const chatId = req.params.id
      const result = await ChatDAO.getChat(chatId)

      if (result && Object.keys(result).length === 0) {
        res.json({})
      }

      res.json(new Chat(result).toJson())
    } catch (err) {
      console.error(`Failed to get chat: ${err}`)
      res.status(500).json({message: err.message})
    }
  }

  static async addChat(req, res, next) {
    try {
      const chatInfo = req.body
      if (!chatInfo || (chatInfo && !Object.keys(chatInfo).length)) {
        throw new HttpBadRequestError("Invalid request. Bad input parameters.")
      }

      const hostUsername = chatInfo.host
      const user = await UserDAO.getUser(hostUsername)
      if (!user || (user && !Object.keys(user).length)) {
        throw new HttpBadRequestError("Invalid request. Bad input parameters.")
      }

      const response = await ChatDAO.addChat(
        {
          title: chatInfo.title,
          host: new User(user).toShortJson(),
          members: chatInfo.members,
          activeMembers: [],
          startTime: new Date(),
          appointmentId: null
        }
      )

      if (!response.success) {
        throw new HttpInternalServerError(response.error)
      }

      res.json({success: true, id: response.id })
    } catch (err) {
      console.error(`Failed to add a new chat. ${err}`);
      res.status(err.statusCode).json({message: err.message})
    }
  }

  static async deleteChat(req, res, next) {
    try {
      const chatId = req.params.id

      const chat = await ChatDAO.getChat(chatId)
      if (!chat || (chat && !Object.keys(chat).length)) {
        throw new HttpBadRequestError("Invalid request. Bad input parameters.")
      }

      await ChatApi.deleteChat(chatId)

      res.json({success: true})
    } catch (err) {
      console.error(`Failed to delete chat. ${err}`);
      res.status(err.statusCode).json({message: err.message})
    }
  }

  static async addActiveMember(req, res, next) {
    try {
      const addInfo = req.body
      if (!addInfo || (addInfo && !Object.keys(addInfo).length)) {
        throw new HttpBadRequestError("Invalid request. Bad input parameters.")
      }

      const chatId = req.params.chatId
      const chat = await ChatDAO.getChat(chatId)
      if (!chat || (chat && !Object.keys(chat).length)) {
        throw new HttpBadRequestError("Invalid request. Bad input parameters.")
      }

      if (!chat.members.includes(addInfo.username)) {
        throw new HttpBadRequestError("Invalid request. Bad input parameters.")
      }

      const response = await ChatDAO.addActiveMember({chatId: chatId, username: addInfo.username})
      if (!response.success) {
        throw new HttpInternalServerError(response.error)
      }

      res.json({success: true})
    } catch (err) {
      console.error(`Failed to add a new active member. ${err}`);
      res.status(err.statusCode).json({message: err.message})
    }
  }

  static async deleteActiveMember(req, res, next) {
    try {
      const chatId = req.params.chatId
      const username = req.params.username

      const chat = await ChatDAO.getChat(chatId)
      if (!chat || (chat && !Object.keys(chat).length)) {
        throw new HttpBadRequestError("Invalid request. Bad input parameters.")
      }

      if (!chat.members.includes(username)) {
        throw new HttpBadRequestError("Invalid request. Bad input parameters.")
      }

      const response = await ChatDAO.deleteActiveMember({chatId: chatId, username: username})
      if (!response.success) {
        throw new HttpInternalServerError(response.error)
      }

      res.json({success: true})
    } catch (err) {
      console.error(`Failed to delete active member. ${err}`);
      res.status(err.statusCode).json({message: err.message})
    }
  }
}
