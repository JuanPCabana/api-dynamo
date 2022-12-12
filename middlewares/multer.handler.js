const multer = require('multer')

/* const storage = multer.diskStorage({
    destination: './public/files/',
    filename: function (req, file, cb) {

        var  extension = file.originalname.slice(file.originalname.lastIndexOf('.'))
        
      cb(null, Date.now()+extension )
    }
  }) */

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true)
  }
  else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false)
  }
}

const storage = multer.memoryStorage()

const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 1000000000, files: 2 } })

module.exports = upload