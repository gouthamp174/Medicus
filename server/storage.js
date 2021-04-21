import dotenv  from "dotenv"
const util = require('util');
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

dotenv.config()

const storage = new GridFsStorage({
  url: process.env.DB_URI,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  file: (req, file) => {
    const fileTypes = ["image/png", "image/jpeg"]

    if (fileTypes.indexOf(file.mimetype) !== -1) {
      // Required image type.
      return {
        bucketName: "photos",
        filename: `${Date.now()}-${file.originalname}`
      }

    } else {
      // regular file type.
      return `${Date.now()}-${file.originalname}`
    }
  }
})

const FileUploader = multer({
  storage: storage,
  limits: {
    fileSize: 2097152
  }
})

export default FileUploader
