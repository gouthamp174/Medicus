

export default async function createChatSchema(conn) {
  await conn.db("medicus").createCollection("chats", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        title: "chats",
        additionalProperties: false,
        properties: {
          _id: {
            bsonType: "objectId"
          },
          title: {
            bsonType: ["string"],
            minLength: 1,
            description: "Title of chat."
          },
          host: {
            bsonType: ["string"],
            minLength: 1,
            description: "Username of host of chat."
          },
          startTime: {
            bsonType: ["date"],
            description: "Start time of chat."
          },
          members: {
            bsonType: ["array"],
            minLength: 1,
            description: "List of usernames of members within chat."
          },
          activeMembers: {
            bsonType: ["array"],
            minLength: 1,
            description: "List of usernames of members active within chat."
          },
          appointmentId: {
            bsonType: ["objectId", null],
            description: "Associated appointment Id for chat."
          }
        },
        required: ["title", "members", "host", "startTime"]
      }
    },
    validationLevel: "strict",
    validationAction: "error"
  })

  console.log(`Chats collection using schema was created.`)
}
