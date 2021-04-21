

export default async function createAppointmentSchema(conn) {
  await conn.db("medicus").createCollection("appointments", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        title: "appointments",
        additionalProperties: false,
        properties: {
          _id: {
            bsonType: "objectId"
          },
          title: {
            bsonType: ["string"],
            minLength: 1,
            description: "Title of appointment."
          },
          patient: {
            bsonType: ["object"],
            description: "Username of patient."
          },
          physician: {
            bsonType: ["object"],
            minLength: 1,
            description: "Username of physician."
          },
          status: {
            enum: ["Pending", "Accepted", "Rejected", "Completed"],
            description: "Status of appointment."
          },
          startTime: {
            bsonType: ["date"],
            description: "Start time of appointment."
          },
          endTime: {
            bsonType: ["date"],
            description: "End Time of appointment."
          },
          description: {
            bsonType: ["string"],
            description: "Description of appointment."
          },
          chatId: {
            bsonType: ["objectId", null],
            description: "Associated Chat Id for the appointment."
          }
        },
        required: ["title", "patient", "physician", "status", "startTime", "endTime", "description"]
      }
    },
    validationLevel: "strict",
    validationAction: "error"
  })

  console.log(`Appointments collection using schema was created.`)
}
