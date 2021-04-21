

export default async function createMessageSchema(conn) {
  await conn.db("medicus").createCollection("messages", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        title: "messages",
        additionalProperties: false,
        properties: {
          _id: {
            bsonType: "objectId"
          },
          chatId: {
            bsonType: "objectId",
            description: "Associated Chat Id of message."
          },
          type: {
            enum: ["user", "system", "info"],
            description: "Type of message."
          },
          sender: {
            bsonType: ["string"],
            minLength: 1,
            description: "Username of sender of message."
          },
          timestamp: {
            bsonType: ["date"],
            description: "Sent time of message."
          },
          content: {
            bsonType: ["string"],
            minLength: 1,
            description: "Content of message."
          }
        }
      }
    },
    validationLevel: "strict",
    validationAction: "error"
  })

  console.log(`Messages collection using schema was created.`)
}
