

export default async function createSessionSchema(conn) {
  await conn.db("medicus").createCollection("sessions", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        title: "sessions",
        additionalProperties: false,
        properties: {
          _id: {
            bsonType: "objectId"
          },
          username: {
            bsonType: "string",
            description: "Username of current user."
          },
          authToken: {
            bsonType: "string",
            description: "Authentication token for current user."
          }
        },
        required: ["username", "authToken"]
      }
    },
    validationLevel: "strict",
    validationAction: "error"
  })

  console.log(`Sessions collection using schema was created.`)
}
