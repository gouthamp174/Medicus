import { ObjectId, GridFSBucket } from "mongodb"


export default class UserDAO {
  static users
  static gfs

  static async injectDB(conn) {
    if (this.users && this.gfs) {
      return
    }

    try {
      this.users = await conn.db(process.env.DB_NS).collection("users", {
        writeConcern: { w: "majority" }
      })
      this.gfs = new GridFSBucket(conn.db(process.env.DB_NS), {
        bucketName: "photos",
        writeConcern: { w: "majority" }
      })
    } catch (err) {
      console.error(`Failed to connect to DB in UserDAO: ${err}`)
    }
  }

  static async getUsers({filter={}, page=0, limit=10}) {
    try {
      const cursor = await this.users.find(filter).skip(page*limit).limit(limit)
      return cursor.toArray()
    } catch (err) {
      console.error(`Failed to retrieve users from DB. ${err}`)
      return []
    }
  }

  static async searchUsers({filter={}, searchQuery={}, page=0, limit=10}) {
    try {
      const cursor = await this.users.aggregate([
        {
          $match: filter
        },
        {
          $addFields: {
            fullName: {
              $concat: ["$firstName", " ", "$lastName"]
            }
          }
        }
      ])
      .match(searchQuery)
      .project({
        fullName: 0
      })
      .skip(page*limit)
      .limit(limit)

      return cursor.toArray()
    } catch (err) {
      console.error(`Failed to search users based on query within DB. ${err}`)
      return []
    }
  }

  static async getUser(username) {
    try {
      return await this.users.findOne({username: username})
    } catch (err) {
      console.error(`Failed to retrieve user from DB. ${err}`)
      return {}
    }
  }

  static async addUser({username, password, firstName, lastName, isPhysician, profilePhotoId,
    dob, gender, qualification="", specialization="", description=""}) {
    try {
      const response = await this.users.insertOne(
        {
          username: username,
          password: password,
          firstName: firstName,
          lastName: lastName,
          isPhysician: Boolean(isPhysician),
          profilePhotoId: (profilePhoto) ? ObjectId(profilePhoto): null,
          dob: new Date(dob),
          gender: gender,
          emailId: "",
          phoneNumber: "",
          qualification: qualification,
          specialization: specialization,
          description: description
        },
        {
          writeConcern: { w: "majority" }
        }
      )

      return { success: true, id: response.id }
    } catch (err) {
      console.error(`Failed to add a new user. ${err}`)
      return { error: err}
    }
  }

  static async deleteUser(username) {
    try {
      await this.users.deleteOne({username: username})

      return { success: true }
    } catch (err) {
      console.error(`Failed to delete user. ${err}`)
      return { error: err }
    }
  }

  static async updateUser(username, updateQuery) {
    try {
      const udpateResponse = await this.users.updateOne(
        { username: username },
        {
          $set: {...updateQuery }
        }
      )

      if (udpateResponse.matchedCount === 0) {
        throw new Error("No user found with that username.")
      }

      return { success: true }
    } catch (err) {
      console.error(`Failed to update user in DB. ${err}`);
      return { error: err }
    }
  }

  static async getPhoto(photoId) {
    try {
      const cursor = await this.gfs.find({ _id: ObjectId(photoId) })
      const files = await cursor.toArray()

      if (!files || files.length === 0) {
        return null
      }

      return await this.gfs.openDownloadStream(ObjectId(photoId))
    } catch (err) {
      // console.error(`Failed to get photo from DB. ${err}`);
      return null
    }
  }

  static async deletePhoto(photoId) {
    try {
      await this.gfs.delete(ObjectId(photoId))

      return { success: true }
    } catch (err) {
      console.error(`Failed to delete photo from DB. ${err}`);
      return { error: err }
    }
  }
}
