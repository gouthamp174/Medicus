import dotenv  from "dotenv"
import express from "express"
import http from "http"
import cors from "cors"
import helmet from "helmet"
import socketIO from "socket.io"
import { MongoClient } from "mongodb"

import createUserSchema from "./schema/userSchema.js"
import createSessionSchema from "./schema/sessionSchema.js"
import createAppointmentSchema from "./schema/appointmentSchema.js"
import createChatSchema from "./schema/chatSchema.js"
import createMessageSchema from "./schema/messageSchema.js"

import UserDAO from "./dao/userDAO"
import SessionDAO from "./dao/sessionDAO"
import AppointmentDAO from "./dao/appointmentDAO"
import ChatDAO from "./dao/chatDAO"
import MessageDAO from "./dao/messageDAO"
import DegreeDAO from "./dao/degreeDAO"
import JobDAO from "./dao/jobDAO"
import ServiceDAO from "./dao/serviceDAO"
import InsuranceDAO from "./dao/insuranceDAO"
import PaymentDAO from "./dao/paymentDAO"
import LabReportDAO from "./dao/labReportDAO"
import MedicationDAO from "./dao/medicationDAO"
import NoteDAO from "./dao/noteDAO"

import { notFound, errorHandler } from "./middlewares"
import AppRouter from "./api/appRouter"
import ChatInterface from "./api/chatApp/chatInterface"

dotenv.config()

// Setting up express & must use middleware
let app = express()
app.use(cors())
app.use(express.json())
app.set('trust proxy', 1) // When using something like nginx or apache as a proxy
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      "default-src": ["'self'", "*.bootstrapcdn.com", "*.googleapis.com", "*.gstatic.com"],
      "script-src": ["'self'", "*.bootstrapcdn.com", "*.cloudflare.com", "*.jquery.com", "*.googleapis.com"],
      "img-src": ["'self'", "data:", "blob:", "*.w3.org"]
    }
  }
})) // Adds extra security

// Custom Middleware
app.use(notFound)
app.use(errorHandler)
app.use('/public', express.static(__dirname+'/../public/'))
app.use('/api', AppRouter)


// Basic Routing
app.get('/robots.txt', (req, res) => res.sendFile('robots.txt', {root: __dirname}))
app.get('*', (req, res) => res.sendFile('index.html', {root: __dirname+'/../public/'}))


// Establish a new connection to DB.
MongoClient.connect(process.env.DB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 100,
    writeConcern: {
      wtimeout: 2500
    }
  },
).catch(err => {
  console.error(err.stack)
  process.exit(1)
}).then(async client => {
  try {
    await createUserSchema(client)
    await createSessionSchema(client)
    await createAppointmentSchema(client)
    await createChatSchema(client)
    await createMessageSchema(client)
  } catch (err) {
    console.error(`Failed to add collections to DB. ${err}`)
  }

  try {
    await UserDAO.injectDB(client)
    await SessionDAO.injectDB(client)
    await AppointmentDAO.injectDB(client)
    await ChatDAO.injectDB(client)
    await MessageDAO.injectDB(client)
    await DegreeDAO.injectDB(client)
    await JobDAO.injectDB(client)
    await ServiceDAO.injectDB(client)
    await InsuranceDAO.injectDB(client)
    await PaymentDAO.injectDB(client)
    await LabReportDAO.injectDB(client)
    await MedicationDAO.injectDB(client)
    await NoteDAO.injectDB(client)

  } catch (err) {
    console.error(`Failed to initialize DAO layer. ${err}`)
  }

  // Setting up node js server
  let port = process.env.PORT || 3003
  let httpServer = http.createServer(app)

  const io = socketIO(httpServer, {})
  io.on('connection', (socket) => {
    ChatInterface.register(io, socket)
  })

  let server = httpServer.listen(port, () => {
    console.log(`Server running on port ${port}...`)
  });
})
